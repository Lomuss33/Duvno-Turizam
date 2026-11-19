import { destinations } from './content.js';
import { localBusinesses } from './local.js';
export const tripPlaces = [...destinations, ...localBusinesses];

const ids = new Set(tripPlaces.map((place) => place.id));

export function validTrip(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id) => typeof id === 'string' && ids.has(id)))];
}

export function normalizeSearch(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase().trim();
}

export function findPlaces({ language = 'hr', category = 'all', area = 'all', search = '' } = {}) {
  const query = normalizeSearch(search);
  return destinations.filter((place) => {
    const matchesCategory = category === 'all' || place.categories.includes(category);
    const text = [place.hr.name, place.en.name, place[language].tagline, place[language].category].join(' ');
    return matchesCategory && (area === 'all' || place.area === area) && normalizeSearch(text).includes(query);
  });
}

export function movePlace(trip, id, offset) {
  const next = validTrip(trip);
  const from = next.indexOf(id);
  const to = from + offset;
  if (from < 0 || to < 0 || to >= next.length) return next;
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

export function shareUrl(currentUrl, trip, language, layout = null) {
  const url = new URL(currentUrl);
  url.search = '';
  url.hash = '';
  url.searchParams.set('lang', language === 'en' ? 'en' : 'hr');
  url.searchParams.set('trip', validTrip(trip).join(','));
  if (layout && Number.isInteger(layout.count) && layout.count > 1 && layout.count <= 3) {
    const days = typeof layout.days === 'string' ? layout.days.split(',') : [];
    url.searchParams.set('length', String(layout.count));
    url.searchParams.set('days', validTrip(trip).map((_, index) => /^[1-3]$/.test(days[index] || '') ? Math.min(layout.count, Number(days[index])) : 1).join(','));
  }
  return url.href;
}

export function mapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function drivingRoutes(trip) {
  const selected = validTrip(trip);
  if (!selected.length) return [];
  // Keep each link below Maps' mobile-browser waypoint limit. Adjacent legs share an endpoint.
  const groups = [];
  for (let start = 0; start < selected.length; start += 3) {
    const stops = selected.slice(start, start + 4);
    if (stops.length === 1 && groups.length) break;
    const queries = stops.map((id) => tripPlaces.find((place) => place.id === id).map);
    const url = new URL('https://www.google.com/maps/dir/');
    url.searchParams.set('api', '1');
    url.searchParams.set('travelmode', 'driving');
    url.searchParams.set('destination', queries.at(-1));
    if (queries.length > 1) url.searchParams.set('origin', queries[0]);
    if (queries.length > 2) url.searchParams.set('waypoints', queries.slice(1, -1).join('|'));
    groups.push({ ids: stops, url: url.href });
  }
  return groups;
}

export function downloadText(trip, language, dictionary) {
  const lines = [dictionary.planHeading, 'Visit Duvno · Tomislavgrad', ''];
  validTrip(trip).forEach((id, index) => {
    const place = tripPlaces.find((item) => item.id === id);
    const text = place[language];
    lines.push(`${index + 1}. ${text.name}`, text.description, `${dictionary.visitTime}: ${text.time}`, `${dictionary.beforeYouGo}: ${text.practical}`, mapUrl(place.map), place.source, '');
  });
  lines.push(dictionary.tripDisclaimer);
  return lines.join('\n');
}
