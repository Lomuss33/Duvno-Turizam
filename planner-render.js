import { tripPlaces, mapUrl } from './trip.js';
import { normalizePlan, planDays, plannerText } from './planner.js';
import { translations } from './content.js';
import { localBusinesses } from './local.js';
import { photo, areaName, savePlaceButton } from './render.js';
import { pageHref, escapeHtml } from './routes.js';

export function plannerShellMarkup(language) {
  const p = plannerText[language];
  return `<div id="planner-controls" hidden><div class="planner-settings"><label class="planner-name"><span>${p.title}</span><input id="plan-name" type="text" maxlength="80" placeholder="${p.titlePlaceholder}"></label><fieldset class="planner-duration"><legend>${p.duration}</legend>${[1, 2, 3].map((day) => `<button type="button" data-plan-length="${day}" aria-pressed="${day === 1}">${p[['oneDay', 'twoDays', 'threeDays'][day - 1]]}</button>`).join('')}</fieldset></div><div id="plan-day-overview" class="plan-day-overview"></div><div class="planner-view-bar"><div id="plan-day-tabs" class="plan-day-tabs" role="group" aria-label="${p.overview}"></div><button type="button" id="arrange-plan" title="${p.groupHint}">${p.groupByArea} <span aria-hidden="true">↝</span></button><button type="button" id="undo-arrangement" hidden>${p.undoArrangement}</button></div></div><h3 id="print-plan-name" class="print-plan-name"></h3>`;
}

export function plannerOverviewMarkup(trip, value, language, root, active = 0) {
  const p = plannerText[language];
  const days = planDays(trip, value);
  if (days.length === 1) return '';
  return days.map((day) => {
    const places = day.ids.map((id) => tripPlaces.find((place) => place.id === id));
    const areas = [...new Set(places.map((place) => place.area))];
    return `<button type="button" class="plan-day-preview" data-plan-day="${day.day}" aria-pressed="${day.day === active}"><span class="plan-day-preview-image">${places.length ? photo(places[0].image, '', { root, sizes: '100px' }) : '<span aria-hidden="true">↝</span>'}</span><span><strong>${p.day} ${day.day}<i>${day.ids.length}</i></strong><small>${areas.length ? areas.map((area) => areaName(area, language)).join(' · ') : p.emptyDay}</small></span></button>`;
  }).join('');
}

export function plannerItemsMarkup(trip, value, language, root, activeDay = 0) {
  const plan = normalizePlan(value, trip);
  const t = translations[language];
  const p = plannerText[language];
  return planDays(trip, plan).filter((day) => !activeDay || day.day === activeDay).map((day) => {
    const areas = [...new Set(day.ids.map((id) => tripPlaces.find((place) => place.id === id).area))];
    const heading = `<div class="plan-day-heading"><h3>${p.day} ${day.day}</h3><span>${day.ids.length} ${p.stops}</span><div>${areas.map((area) => `<span data-area="${area}">${areaName(area, language)}</span>`).join('')}</div></div>`;
    if (!day.ids.length) return `${heading}<div class="plan-day-empty"><span aria-hidden="true">↝</span><h3>${p.emptyDay}</h3><p>${p.emptyDayText}</p><button type="button" class="text-link" data-explore-places>${p.browse} ↗</button></div>`;
    return `${heading}<ol class="trip-list" data-day-list="${day.day}">${day.ids.map((id, index) => {
      const place = tripPlaces.find((entry) => entry.id === id);
      const text = place[language];
      const note = plan.notes[id] || '';
      return `<li data-trip-stop="${id}"><span class="trip-item-number">${String(index + 1).padStart(2, '0')}</span>${photo(place.image, '', { root, sizes: '75px' })}<div class="trip-item-content"><h3><a class="trip-guide-link" href="${pageHref(root, language, id)}">${text.name}</a></h3><div class="trip-row-meta"><span>${text.time}</span><a href="${mapUrl(place.map)}" target="_blank" rel="noopener noreferrer">${t.map} ↗</a></div>${plan.dayCount > 1 ? `<label class="plan-day-assignment"><span class="sr-only">${p.assign}: ${escapeHtml(text.name)}</span><select data-assign-day="${id}">${Array.from({ length: plan.dayCount }, (_, number) => `<option value="${number + 1}" ${number + 1 === day.day ? 'selected' : ''}>${p.day} ${number + 1}</option>`).join('')}</select></label>` : ''}<details class="plan-note"><summary><span>${note ? p.yourNote : p.notes}</span><i aria-hidden="true">✎</i></summary><label><span class="sr-only">${p.yourNote}: ${escapeHtml(text.name)}</span><textarea rows="2" maxlength="280" data-plan-note="${id}" placeholder="${p.notePlaceholder}">${escapeHtml(note)}</textarea></label><button type="button" class="remove-note" data-clear-note="${id}">${p.noteRemoved}</button></details><p class="plan-print-note" ${note ? '' : 'hidden'}><strong>${p.noteLabel}: </strong><span>${escapeHtml(note)}</span></p><div class="trip-print-detail"><p>${text.description}</p><p>${text.practical}</p>${place.phone ? `<p>${place.phone}${place.email ? ` · ${place.email}` : ''}</p>` : ''}<span>${p.source || 'Source'}: ${place.source}</span></div></div><div class="trip-item-actions"><button type="button" data-move="${id}" data-offset="-1" aria-label="${escapeHtml(`${t.up}: ${text.name}`)}" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-move="${id}" data-offset="1" aria-label="${escapeHtml(`${t.down}: ${text.name}`)}" ${index === day.ids.length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-remove="${id}" aria-label="${escapeHtml(`${t.remove}: ${text.name}`)}">×</button></div></li>`;
    }).join('')}</ol>`;
  }).join('');
}

export function localPlanSuggestions(trip, value, day = 0) {
  const plan = normalizePlan(value, trip);
  const selected = tripPlaces.filter((place) => trip.includes(place.id) && (!day || plan.assignments[place.id] === day));
  const areas = [...new Set(selected.map((place) => place.area))];
  if (!areas.length) return [];
  const matches = localBusinesses.filter((place) => !trip.includes(place.id) && areas.includes(place.area));
  matches.sort((a, b) => Number(b.nearby.some((id) => selected.some((place) => place.id === id))) - Number(a.nearby.some((id) => selected.some((place) => place.id === id))));
  const suggestions = [];
  for (const kind of ['food', 'stay', 'made']) {
    const categories = kind === 'food' ? ['eat', 'drink'] : kind === 'made' ? ['made', 'active'] : ['stay'];
    if (selected.some((place) => place.kind === 'business' && place.categories.some((category) => categories.includes(category)))) continue;
    const place = matches.find((place) => !suggestions.some((item) => item.place.id === place.id) && place.categories.some((category) => categories.includes(category)));
    if (place) suggestions.push({ place, kind });
  }
  return suggestions;
}

export function plannerSuggestionsMarkup(suggestions, language, root) {
  const p = plannerText[language];
  return `<p class="eyebrow">${p.suggestions}</p><div>${suggestions.map(({ place, kind }) => `<article>${photo(place.image, '', { root, sizes: '75px' })}<div><small>${p[kind]}</small><a href="${pageHref(root, language, place.id)}">${place[language].name} ↗</a><span>${place.location} · ${language === 'hr' ? 'kadar područja' : 'area photograph'}</span></div>${savePlaceButton(place, language, { compact: true })}</article>`).join('')}</div>`;
}
