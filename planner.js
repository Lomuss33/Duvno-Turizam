import { validTrip, tripPlaces, drivingRoutes } from './trip.js';

export const plannerText = {
  hr: {
    source: 'Izvor', undoArrangement: 'Vrati prethodni raspored',
    eyebrow: 'OD SPREMLJENIH MJESTA DO TVOG PUTOVANJA', title: 'Kako želiš nazvati izlet?', titlePlaceholder: 'Moj vikend u Duvnu', duration: 'Koliko dana planiraš?', allDays: 'Cijeli izlet', day: 'Dan', days: 'dana', oneDay: '1 dan', twoDays: '2 dana', threeDays: '3 dana', assign: 'Rasporedi u dan', notes: 'Dodaj bilješku', yourNote: 'Tvoja bilješka', notePlaceholder: 'Što želiš zapamtiti? Najava posjeta, pitanje za domaćina, ideja za predah…', localNote: 'Bilješke i naziv čuvaju se u ovom pregledniku. Poveznica dijeli mjesta, dane i njihov redoslijed.', emptyDay: 'Ovaj dan još nema stanica.', emptyDayText: 'Premjesti ovdje neko spremljeno mjesto ili dodaj novu ideju iz vodiča.', browse: 'Dodaj još mjesta', dayRoute: 'Upute za ovaj dan', noteLabel: 'MOJA BILJEŠKA', routeNote: 'Upute slijede tvoj redoslijed. Za duži dan otvori uzastopne dionice.', dayChanged: 'Mjesto je raspoređeno u odabrani dan.', daysReduced: 'Mjesta su zadržana u preostalim danima.', dayTheme: 'DAN PO TVOME', food: 'Za stol', stay: 'Za noćenje', made: 'Nešto lokalno', addStop: 'Dodaj stanku', suggestions: 'LOKALNO ZA OVAJ DAN', saved: 'Spremljeno u ovom pregledniku', stops: 'stanica', overview: 'Pregled dana', allSaved: 'Sva spremljena mjesta', noteRemoved: 'Ukloni bilješku', printTitle: 'Plan putovanja', groupByArea: 'Rasporedi po krajevima', groupHint: 'Spaja mjesta iz istog kraja u isti dan. Redoslijed unutar kraja ostaje tvoj.', grouped: 'Mjesta su raspoređena po krajevima.',
  },
  en: {
    source: 'Source', undoArrangement: 'Undo arrangement',
    eyebrow: 'FROM SAVED PLACES TO YOUR OWN TRIP', title: 'What would you call your trip?', titlePlaceholder: 'My weekend in Duvno', duration: 'How many days are you planning?', allDays: 'Whole trip', day: 'Day', days: 'days', oneDay: '1 day', twoDays: '2 days', threeDays: '3 days', assign: 'Assign to a day', notes: 'Add a note', yourNote: 'Your note', notePlaceholder: 'What would you like to remember? A visit to arrange, a question for a host, an idea for a break…', localNote: 'Notes and the trip name stay in this browser. Shared links include places, days and their order.', emptyDay: 'No stops for this day yet.', emptyDayText: 'Move a saved place here or add another idea from the guide.', browse: 'Add more places', dayRoute: 'Directions for this day', noteLabel: 'MY NOTE', routeNote: 'Directions follow your order. For a longer day, open each successive leg.', dayChanged: 'The place has been assigned to that day.', daysReduced: 'Your places have been kept in the remaining days.', dayTheme: 'MAKE THE DAY YOUR OWN', food: 'A local table', stay: 'Somewhere to stay', made: 'Something local', addStop: 'Add this stop', suggestions: 'LOCAL STOPS FOR THIS DAY', saved: 'Saved in this browser', stops: 'stops', overview: 'Your days at a glance', allSaved: 'All saved places', noteRemoved: 'Remove note', printTitle: 'Travel plan', groupByArea: 'Arrange by area', groupHint: 'Keeps places in the same area on the same day. Your order within an area stays intact.', grouped: 'Places have been arranged by area.',
  },
};

export function normalizePlan(value, trip) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const count = Number.isInteger(source.dayCount) ? Math.min(3, Math.max(1, source.dayCount)) : 1;
  const assignments = {};
  const notes = {};
  for (const id of validTrip(trip)) {
    const day = source.assignments?.[id];
    assignments[id] = Number.isInteger(day) && day >= 1 ? Math.min(count, day) : 1;
    if (typeof source.notes?.[id] === 'string') notes[id] = source.notes[id].slice(0, 280);
  }
  return { version: 1, dayCount: count, title: typeof source.title === 'string' ? source.title.slice(0, 80) : '', assignments, notes };
}

export function planDays(trip, value) {
  const selected = validTrip(trip);
  const plan = normalizePlan(value, selected);
  return Array.from({ length: plan.dayCount }, (_, index) => ({ day: index + 1, ids: selected.filter((id) => plan.assignments[id] === index + 1) }));
}

export function assignNewStops(trip, value, ids, day = 1) {
  const next = validTrip([...validTrip(trip), ...validTrip(ids)]);
  const plan = normalizePlan(value, trip);
  const target = Math.min(plan.dayCount, Math.max(1, day));
  for (const id of validTrip(ids)) if (!plan.assignments[id]) plan.assignments[id] = target;
  return { trip: next, plan: normalizePlan(plan, next) };
}

export function moveWithinDay(trip, value, id, offset) {
  const next = validTrip(trip);
  const plan = normalizePlan(value, next);
  const siblings = next.filter((placeId) => plan.assignments[placeId] === plan.assignments[id]);
  const position = siblings.indexOf(id);
  const target = siblings[position + offset];
  if (target) {
    const a = next.indexOf(id), b = next.indexOf(target);
    [next[a], next[b]] = [next[b], next[a]];
  }
  return next;
}

export function arrangeByArea(trip, value) {
  const plan = normalizePlan(value, trip);
  const selected = validTrip(trip);
  const areas = [...new Set(selected.map((id) => tripPlaces.find((place) => place.id === id).area))];
  // Assign whole areas as units. Extra areas share the least populated day.
  const loads = Array(plan.dayCount).fill(0);
  for (const area of areas) {
    const ids = selected.filter((id) => tripPlaces.find((place) => place.id === id).area === area);
    const day = loads.indexOf(Math.min(...loads));
    for (const id of ids) plan.assignments[id] = day + 1;
    loads[day] += ids.length;
  }
  return plan;
}

export function sharedDayLayout(trip, value) {
  const plan = normalizePlan(value, trip);
  return { count: plan.dayCount, days: validTrip(trip).map((id) => plan.assignments[id]).join(',') };
}

export function importSharedPlan(parameters) {
  // Align days with the original ID tokens before invalid entries/duplicates are removed.
  const tokens = (parameters.get('trip') || '').split(',');
  const selected = validTrip(tokens);
  const values = (parameters.get('days') || '').split(',');
  const assignments = {};
  for (let index = 0; index < tokens.length; index++) {
    const id = tokens[index];
    if (selected.includes(id) && !Object.hasOwn(assignments, id)) assignments[id] = /^[1-3]$/.test(values[index] || '') ? Number(values[index]) : 1;
  }
  const requested = parameters.get('length');
  const count = Math.max(/^[1-3]$/.test(requested || '') ? Number(requested) : 1, ...Object.values(assignments));
  return { trip: selected, plan: normalizePlan({ dayCount: count, assignments }, selected) };
}

export function dayRoutes(trip, value, selectedDay = 0) {
  return planDays(trip, value).filter((day) => !selectedDay || selectedDay === day.day).flatMap((day) => drivingRoutes(day.ids).map((route, index, routes) => ({ ...route, day: day.day, leg: index + 1, total: routes.length })));
}

export function planDownload(trip, language, dictionary, value) {
  const plan = normalizePlan(value, trip);
  const text = plannerText[language];
  const lines = [plan.title || dictionary.planHeading, 'Visit Duvno · Tomislavgrad', ''];
  for (const day of planDays(trip, plan)) {
    if (!day.ids.length) continue;
    let number = 0;
    lines.push(`${text.day.toUpperCase()} ${day.day}`, '');
    for (const id of day.ids) {
      const place = tripPlaces.find((item) => item.id === id);
      const entry = place[language];
      lines.push(`${++number}. ${entry.name}`, entry.description, `${dictionary.visitTime}: ${entry.time}`);
      if (plan.notes[id]) lines.push(`${text.noteLabel}: ${plan.notes[id]}`);
      lines.push(`${dictionary.beforeYouGo}: ${entry.practical}`, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.map)}`);
      if (place.phone) lines.push(place.phone);
      if (place.email) lines.push(place.email);
      lines.push(place.source, '');
    }
    for (const route of drivingRoutes(day.ids)) lines.push(`${text.dayRoute}: ${route.url}`);
    lines.push('');
  }
  lines.push(dictionary.tripDisclaimer);
  return lines.join('\n');
}
