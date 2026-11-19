import test from 'node:test';
import assert from 'node:assert/strict';
import { validTrip, normalizeSearch, findPlaces, movePlace, shareUrl, downloadText, drivingRoutes } from '../trip.js';
import { translations, destinations } from '../content.js';
import { localBusinesses } from '../local.js';
import { findBusinesses } from '../local-ui.js';
import { normalizePlan, planDays, assignNewStops, moveWithinDay, sharedDayLayout, importSharedPlan, dayRoutes, planDownload, arrangeByArea } from '../planner.js';
import { validComparison, photographArea, photoShareUrl } from '../browse-data.js';

test('shared and stored trips discard malformed IDs and duplicates, preserving order', () => {
  assert.deepEqual(validTrip(['grad', 'bad-id', 'busko', 'grad', null, 42, '<script>']), ['grad', 'busko']);
  assert.deepEqual(validTrip({ trip: ['grad'] }), []);
});

test('search supports Croatian diacritics and translated names', () => {
  assert.equal(normalizeSearch('  ŠujiČki ĐIR '), 'sujicki dir');
  assert.deepEqual(findPlaces({ search: 'busko' }).map((place) => place.id), ['busko', 'karmel']);
  assert.deepEqual(findPlaces({ language: 'en', search: 'sujica' }).map((place) => place.id), ['sujica', 'rijeka-sujica', 'galecka-cuprija', 'kanjon-sujice']);
  assert.deepEqual(findPlaces({ category: 'culture', search: 'jezero' }), []);
  assert.ok(findPlaces({ category: 'water' }).every((place) => place.categories.includes('water')));
  assert.deepEqual(findPlaces({ area: 'sujica', category: 'water', search: 'Šujica' }).map((place) => place.id), ['sujica', 'rijeka-sujica', 'kanjon-sujice']);
  assert.deepEqual(findPlaces({ area: 'busko', category: 'water', search: 'Šujica' }), []);
});

test('comparisons accept only three distinct destinations and photo links preserve locale and project paths', () => {
  assert.deepEqual(validComparison(['busko', 'bad', 'busko', 'grad', 'knebu', null, 'blidinje', 'polje']), ['busko', 'grad', 'blidinje']);
  assert.deepEqual(validComparison({ places: ['busko'] }), []);
  assert.equal(photographArea({ id: 'galecka-cuprija' }), 'sujica');
  const url = new URL(photoShareUrl('https://example.com/Duvno-Turizam/', 'en', 'galecka', 'sujica'));
  assert.equal(url.pathname, '/Duvno-Turizam/en/');
  assert.equal(url.searchParams.get('photo'), 'galecka');
  assert.equal(url.searchParams.get('view'), 'sujica');
  assert.equal(new URL(photoShareUrl('https://example.com/Duvno-Turizam/', 'hr', 'galecka', 'unknown')).searchParams.has('view'), false);
});

test('trip order changes without mutating input or crossing list boundaries', () => {
  const trip = ['grad', 'busko', 'blidinje'];
  assert.deepEqual(movePlace(trip, 'busko', -1), ['busko', 'grad', 'blidinje']);
  assert.deepEqual(movePlace(trip, 'grad', -1), trip);
  assert.deepEqual(movePlace(trip, 'blidinje', 1), trip);
  assert.deepEqual(movePlace(trip, 'unknown', 1), trip);
  assert.deepEqual(trip, ['grad', 'busko', 'blidinje']);
});

test('sharing preserves the GitHub Pages path and strips unrelated parameters', () => {
  const url = new URL(shareUrl('https://lomuss33.github.io/Duvno-Turizam/?place=grad#mjesta', ['busko', 'grad'], 'en'));
  assert.equal(url.pathname, '/Duvno-Turizam/');
  assert.equal(url.searchParams.get('trip'), 'busko,grad');
  assert.equal(url.searchParams.get('lang'), 'en');
  assert.equal(url.searchParams.has('place'), false);
  assert.equal(url.hash, '');
});

test('download includes selected places in order, practical notes and map links', () => {
  const text = downloadText(['busko', 'grad'], 'en', translations.en);
  assert.ok(text.includes('1. Buško Lake'));
  assert.ok(text.includes('2. Tomislavgrad'));
  assert.ok(text.includes('https://www.google.com/maps/search/'));
  assert.ok(text.includes(translations.en.tripDisclaimer));
  assert.ok(!text.includes('undefined'));
});

test('both languages cover every translation and every destination field', () => {
  assert.deepEqual(Object.keys(translations.hr).sort(), Object.keys(translations.en).sort());
  for (const place of destinations) {
    assert.deepEqual(Object.keys(place.hr).sort(), Object.keys(place.en).sort());
  }
});

test('driving links preserve stop order and split long trips into mobile-friendly legs', () => {
  const trip = destinations.slice(0, 6).map((place) => place.id);
  const routes = drivingRoutes(trip);
  assert.deepEqual(routes.map((route) => route.ids), [trip.slice(0, 4), trip.slice(3)]);
  const first = new URL(routes[0].url);
  const second = new URL(routes[1].url);
  assert.equal(first.searchParams.get('origin'), destinations[0].map);
  assert.equal(first.searchParams.get('destination'), destinations[3].map);
  assert.equal(second.searchParams.get('origin'), destinations[3].map);
  assert.equal(second.searchParams.get('destination'), destinations[5].map);
  assert.equal(first.searchParams.get('travelmode'), 'driving');
  assert.equal(first.searchParams.get('waypoints').split('|').length, 2);
  assert.deepEqual(drivingRoutes([]), []);
  const single = new URL(drivingRoutes(['grad'])[0].url);
  assert.equal(single.searchParams.has('origin'), false);
  assert.equal(single.searchParams.get('destination'), destinations.find((place) => place.id === 'grad').map);
});

test('business search combines category, area and names without diacritics', () => {
  assert.deepEqual(findBusinesses({ search: 'papic' }).map((business) => business.id), ['papic']);
  assert.deepEqual(findBusinesses({ category: 'made', area: 'town' }).map((business) => business.id), ['knebu', 'opg-ljubicic', 'duvanjska-kuca']);
  assert.ok(findBusinesses({ area: 'blidinje', category: 'stay' }).every((business) => business.area === 'blidinje' && business.categories.includes('stay')));
  assert.equal(findBusinesses({ search: '<script>' }).length, 0);
});

test('mixed business and destination trips share, route and export without losing stops', () => {
  const trip = validTrip(['busko', 'eco-grabovica', 'muzej', 'duvanjska-kuca', 'bogus']);
  assert.deepEqual(trip, ['busko', 'eco-grabovica', 'muzej', 'duvanjska-kuca']);
  const text = downloadText(trip, 'en', translations.en);
  assert.ok(text.includes('Eco-selo Grabovica'));
  assert.ok(text.includes('Duvanjska kuća'));
  assert.equal(new URL(drivingRoutes(trip)[0].url).searchParams.get('destination'), localBusinesses.find((business) => business.id === 'duvanjska-kuca').map);
  assert.ok(!text.includes('undefined'));
});

test('legacy favourites gain a day without loss and shortening a trip keeps notes and every stop', () => {
  const trip = ['busko', 'grad', 'muzej'];
  const migrated = normalizePlan(null, trip);
  assert.deepEqual(planDays(trip, migrated), [{ day: 1, ids: trip }]);
  const long = { dayCount: 3, assignments: { busko: 1, grad: 2, muzej: 3, unknown: 3 }, notes: { muzej: 'Ask about a guided visit', unknown: 'Not a saved place' } };
  const shorter = normalizePlan({ ...long, dayCount: 2 }, trip);
  assert.deepEqual(planDays(trip, shorter).map((day) => day.ids), [['busko'], ['grad', 'muzej']]);
  assert.equal(shorter.notes.muzej, 'Ask about a guided visit');
  assert.equal(shorter.notes.unknown, undefined);
});

test('multi-day sharing preserves assignments and order without putting personal notes in the link', () => {
  const trip = ['busko', 'grad', 'karmel'];
  const plan = normalizePlan({ dayCount: 3, title: 'Private family trip', assignments: { busko: 1, grad: 2, karmel: 1 }, notes: { busko: 'Private note' } }, trip);
  const url = new URL(shareUrl('https://example.com/project/en/', trip, 'en', sharedDayLayout(trip, plan)));
  const shared = importSharedPlan(url.searchParams);
  assert.deepEqual(planDays(shared.trip, shared.plan), planDays(trip, plan));
  assert.ok(!url.href.includes('Private'));
  assert.deepEqual(shared.plan.notes, {});
  const malformed = importSharedPlan(new URLSearchParams('trip=busko,bad,grad,busko&days=2,3,1,3&length=3'));
  assert.deepEqual(planDays(malformed.trip, malformed.plan).map((day) => day.ids), [['grad'], ['busko'], []]);
});

test('adding stops preserves existing days; reordering and directions stay inside each day', () => {
  const trip = ['busko', 'grad', 'karmel'];
  const plan = normalizePlan({ dayCount: 2, assignments: { busko: 1, grad: 2, karmel: 1 }, notes: { grad: 'Meet here' } }, trip);
  const next = assignNewStops(trip, plan, ['busko', 'muzej'], 2);
  assert.equal(next.plan.assignments.busko, 1);
  assert.equal(next.plan.assignments.muzej, 2);
  assert.deepEqual(moveWithinDay(next.trip, next.plan, 'karmel', -1), ['karmel', 'grad', 'busko', 'muzej']);
  const routes = dayRoutes(next.trip, next.plan);
  assert.deepEqual(routes.map((route) => route.ids), [['busko', 'karmel'], ['grad', 'muzej']]);
  const text = planDownload(next.trip, 'en', translations.en, next.plan);
  assert.ok(text.includes('DAY 2'));
  assert.ok(text.includes('MY NOTE: Meet here'));
  assert.ok(text.includes('Franciscan Museum'));
  const grouped = arrangeByArea(next.trip, next.plan);
  assert.equal(grouped.assignments.busko, grouped.assignments.karmel);
  assert.equal(grouped.assignments.grad, grouped.assignments.muzej);
  assert.equal(grouped.notes.grad, 'Meet here');
});
