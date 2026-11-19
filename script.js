import { translations, destinations, itineraryStyles } from './content.js';
import { validTrip, findPlaces, shareUrl, mapUrl, tripPlaces } from './trip.js';
import { pageHref, homeHref } from './routes.js';
import { destinationCard, savePlaceButton, itineraryMarkup, seasonMarkup, faqMarkup } from './render.js';
import { mountImmersion } from './immersion.js';
import { mountLocalDirectory } from './local-ui.js';
import { mountDiscovery } from './discovery.js';
import { mountGuideSearch } from './guide-search.js';
import { discoveryText } from './discovery-data.js';
import { localBusinesses } from './local.js';
import { areaGuides } from './area-data.js';
import { mountAreaGuide } from './area-ui.js';
import { normalizePlan, planDays, assignNewStops, moveWithinDay, sharedDayLayout, importSharedPlan, dayRoutes, planDownload, arrangeByArea, plannerText } from './planner.js';
import { plannerOverviewMarkup, plannerItemsMarkup, localPlanSuggestions, plannerSuggestionsMarkup } from './planner-render.js';
import { mountComparison } from './comparison.js';
import { browseText } from './browse-data.js';
import { browseAreas } from './browse-render.js';
import { mountRiverStory } from './river.js';
import { mountTownExplorer } from './town.js';
import { pillarHubs } from './pillars-data.js';
import { mountPillarPage } from './pillars-ui.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
document.documentElement.classList.remove('no-js');
const siteRoot = new URL(document.body.dataset.siteRoot || './', document.baseURI).href;
const guideId = document.body.dataset.destination;
const areaId = document.body.dataset.area;
const pillarId = document.body.dataset.pillar;
const staticPage = document.body.dataset.staticPage;
const imageRoot = `${siteRoot}images/`;
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const stored = {
  read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { $('#storage-note').hidden = false; }
  },
};

const parameters = new URLSearchParams(location.search);
const preferredLanguage = guideId || staticPage ? document.body.dataset.pageLanguage : parameters.get('lang') || (document.body.dataset.pageLanguage === 'en' ? 'en' : stored.read('duvno-language', 'hr'));
const state = {
  language: preferredLanguage === 'en' ? 'en' : 'hr',
  category: 'all', search: '', days: 2, season: 'spring', vibe: 'slow',
  trip: validTrip(stored.read('duvno-trip', [])), activePlace: null,
};
state.placeArea = browseAreas.includes(parameters.get('where')) ? parameters.get('where') : 'all';
state.category = ['all', 'nature', 'water', 'culture'].includes(parameters.get('kind')) ? parameters.get('kind') : 'all';
state.search = (parameters.get('q') || '').slice(0, 100);
state.placeView = ['cards', 'list'].includes(parameters.get('layout')) ? parameters.get('layout') : stored.read('duvno-place-view', 'cards') === 'list' ? 'list' : 'cards';
state.plan = normalizePlan(stored.read('duvno-plan', {}), state.trip);
const rememberedPlanDay = stored.read('duvno-plan-day', 0);
state.planDay = Number.isInteger(rememberedPlanDay) && rememberedPlanDay >= 0 && rememberedPlanDay <= state.plan.dayCount ? rememberedPlanDay : 0;
state.previousArrangement = null;
let credits;
let comparison;
let toastTimeout;
const t = (key) => translations[state.language][key];
const applyTheme = (theme) => {
  const light = theme === 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  const button = $('[data-theme-toggle]');
  if (button) {
    button.setAttribute('aria-pressed', String(light));
    button.querySelector('.theme-toggle-label').textContent = light ? t('themeLight') : t('themeDark');
    button.querySelector('.theme-icon').textContent = light ? '☼' : '◐';
  }
};
applyTheme(stored.read('duvno-theme', 'dark') === 'light' ? 'light' : 'dark');
const externalLink = (url, label, className = '') => `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const placeLink = (id) => {
  return pageHref(siteRoot, state.language, id);
};

function notify(message) {
  clearTimeout(toastTimeout);
  // Keep feedback inside the active modal's accessible tree and above its backdrop.
  (document.querySelector('dialog[open]') || document.body).append($('#toast'));
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
}

function setPressed(selector, attribute, selected) {
  $$(selector).forEach((button) => {
    const active = button.getAttribute(attribute) === String(selected);
    button.setAttribute('aria-pressed', String(active));
    button.classList.toggle('active', active);
  });
}

function saveButton(place, compact = false) {
  return savePlaceButton(place, state.language, { compact, saved: state.trip.includes(place.id) });
}

function renderPlaces({ remember = false } = {}) {
  if (!$('#place-grid')) return;
  const places = findPlaces({ language: state.language, category: state.category, area: state.placeArea, search: state.search });
  $('#place-grid').innerHTML = places.map((place) => destinationCard(place, state.language, { root: siteRoot, saved: state.trip.includes(place.id) })).join('');
  $('#empty-results').hidden = places.length > 0;
  $('#result-count').textContent = `${t('results')} ${places.length}`;
  setPressed('[data-filter]', 'data-filter', state.category);
  setPressed('[data-place-view]', 'data-place-view', state.placeView);
  $('#place-grid').classList.toggle('is-list', state.placeView === 'list');
  $('#place-area').value = state.placeArea;
  if ($('#place-search').value !== state.search) $('#place-search').value = state.search;
  $('#browse-count').textContent = `${places.length} / ${destinations.length} ${browseText[state.language].shown}`;
  $('#browse-reset').hidden = state.category === 'all' && state.placeArea === 'all' && !state.search;
  comparison?.syncButtons();
  if (remember) {
    const url = new URL(location.href);
    for (const [key, value, fallback] of [['where', state.placeArea, 'all'], ['kind', state.category, 'all'], ['q', state.search, ''], ['layout', state.placeView, 'cards']]) {
      if (value !== fallback) url.searchParams.set(key, value); else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }
}

function renderItinerary() {
  if (!$('#itinerary')) return;
  $('#itinerary').innerHTML = itineraryMarkup(state.language, state.days, siteRoot, state.vibe);
  setPressed('[data-days]', 'data-days', state.days);
  setPressed('[data-vibe]', 'data-vibe', state.vibe);
}

function renderSeason() {
  if (!$('#season-content')) return;
  $('#season-content').innerHTML = seasonMarkup(state.language, state.season, siteRoot);
  setPressed('[data-season]', 'data-season', state.season);
}

function renderFaqs() {
  if (!$('#faq-list')) return;
  const opened = $$('#faq-list details').map((item) => item.open);
  $('#faq-list').innerHTML = faqMarkup(state.language, opened);
}

function renderPlaceDialog() {
  const place = tripPlaces.find((item) => item.id === state.activePlace);
  if (!place) return;
  const content = place[state.language];
  $('#place-dialog-content').innerHTML = `<img class="dialog-photo" src="${imageRoot}${place.image}.webp" srcset="${imageRoot}${place.image}-640.webp 640w, ${imageRoot}${place.image}-960.webp 960w, ${imageRoot}${place.image}.webp 1920w" sizes="(max-width: 850px) 95vw, 810px" width="1200" height="700" alt="${escapeHtml(content.alt)}"><div class="place-dialog-body"><p class="eyebrow">${content.category}</p><h2 id="place-dialog-title">${content.name}</h2><p class="dialog-lead">${content.description}</p><dl class="place-facts"><div><dt>${t('visitTime')}</dt><dd>${content.time}</dd></div><div><dt>${t('goodFor')}</dt><dd>${content.mood}</dd></div></dl><ul class="place-ideas">${content.ideas.map((idea) => `<li>${idea}</li>`).join('')}</ul><div class="before-you-go"><h3>${t('beforeYouGo')}</h3><p>${content.practical}</p></div><div class="place-dialog-actions">${saveButton(place)}${externalLink(mapUrl(place.map), `${t('map')} ↗`, 'button button-outline')}</div><a class="full-guide-link text-link" href="${placeLink(place.id)}">${t('fullGuide')} ↗</a>${externalLink(place.source, t('moreInformation'), 'source-link')}</div>`;
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-is-open');
}

function openPlace(id) {
  if (!tripPlaces.some((item) => item.id === id)) return;
  state.activePlace = id;
  renderPlaceDialog();
  openDialog('place-dialog');
  const url = new URL(location.href);
  url.searchParams.set('place', id);
  history.replaceState(null, '', url);
}

function renderTrip() {
  $('#share-fallback')?.remove();
  const dt = discoveryText[state.language];
  const pt = plannerText[state.language];
  state.plan = normalizePlan(state.plan, state.trip);
  if (state.planDay > state.plan.dayCount) state.planDay = 0;
  const visibleTrip = state.trip.filter((id) => !state.planDay || state.plan.assignments[id] === state.planDay);
  const selectedPlaces = visibleTrip.map((id) => tripPlaces.find((place) => place.id === id));
  const areas = new Set(selectedPlaces.map((place) => place.area));
  const businessCount = selectedPlaces.filter((place) => place.kind === 'business').length;
  $('#planner-controls').hidden = !state.trip.length;
  const name = $('#plan-name');
  if (document.activeElement !== name) name.value = state.plan.title;
  $('#print-plan-name').textContent = state.plan.title;
  $$('[data-plan-length]').forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.planLength) === state.plan.dayCount)));
  $('#plan-day-overview').innerHTML = plannerOverviewMarkup(state.trip, state.plan, state.language, siteRoot, state.planDay);
  $('#plan-day-tabs').innerHTML = [{ day: 0, label: pt.allDays }, ...planDays(state.trip, state.plan).map((day) => ({ day: day.day, label: `${pt.day} ${day.day}` }))].map((day) => `<button type="button" data-plan-day="${day.day}" aria-pressed="${day.day === state.planDay}">${day.label}</button>`).join('');
  $('#arrange-plan').hidden = state.plan.dayCount < 2;
  $('#undo-arrangement').hidden = !state.previousArrangement;
  $('#trip-summary').hidden = !state.trip.length;
  $('#trip-summary').innerHTML = `<span>${dt.tripSummary}</span><strong>${visibleTrip.length - businessCount} ${dt.tripSights}</strong><strong>${businessCount} ${dt.tripLocal}</strong><strong>${areas.size} ${dt.tripAreas}</strong>`;
  const suggestions = localPlanSuggestions(state.trip, state.plan, state.planDay);
  $('#trip-suggestion').hidden = !suggestions.length;
  $('#trip-suggestion').innerHTML = plannerSuggestionsMarkup(suggestions, state.language, siteRoot);
  $('#trip-items').innerHTML = state.trip.length ? plannerItemsMarkup(state.trip, state.plan, state.language, siteRoot, state.planDay) : `<div class="empty-trip"><span aria-hidden="true">♡</span><h3>${t('emptyTitle')}</h3><p>${t('emptyDescription')}</p><button type="button" class="button button-dark" data-explore-places>${t('explorePlaces')} ↗</button></div>`;
  $('#trip-actions').hidden = !state.trip.length;
  const routes = dayRoutes(state.trip, state.plan, state.planDay);
  $('#trip-route-links').innerHTML = routes.map((route) => externalLink(route.url, `${state.plan.dayCount > 1 ? `${pt.day} ${route.day} · ` : ''}${t('drivingRoute')}${route.total > 1 ? ` · ${t('routePart')} ${route.leg}` : ''} ↗`, 'button button-outline')).join('');
  $('#trip-routes').hidden = !routes.length;
  let note = $('#planner-local-note');
  if (!note) { note = document.createElement('p'); note.id = 'planner-local-note'; note.className = 'planner-local-note'; $('#trip-actions').after(note); }
  note.textContent = pt.localNote; note.hidden = !state.trip.length;
}

function syncTrip() {
  state.plan = normalizePlan(state.plan, state.trip);
  stored.write('duvno-trip', state.trip);
  stored.write('duvno-plan', state.plan);
  stored.write('duvno-plan-day', state.planDay);
  $$('.plan-count').forEach((element) => { element.textContent = state.trip.length; });
  $('.plan-toggle').setAttribute('aria-label', `${t('myTrip')}: ${state.trip.length}`);
  $('#journey-dock').hidden = state.trip.length === 0;
  document.body.classList.toggle('has-trip', state.trip.length > 0);
  $('#dock-count').textContent = `${state.trip.length} · ${t('savedPlaces')}${state.planDay ? ` · ${plannerText[state.language].day} ${state.planDay}` : ''}`;
  $('#dock-thumbnails').innerHTML = state.trip.slice(0, 3).map((id) => `<img src="${imageRoot}${tripPlaces.find((place) => place.id === id).image}-640.webp" alt="" width="44" height="44">`).join('');
  $$('[data-save]').forEach((button) => {
    const place = tripPlaces.find((item) => item.id === button.dataset.save);
    const saved = state.trip.includes(place.id);
    button.classList.toggle('is-saved', saved);
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute('aria-label', `${saved ? t('saved') : t('save')}: ${place[state.language].name}`);
    button.querySelector('[aria-hidden]').textContent = saved ? '♥' : '♡';
    const label = button.querySelector('[data-save-label]');
    if (label) label.textContent = saved ? t('saved') : t('save');
  });
  renderTrip();
}

function updateLanguage(language) {
  state.language = language;
  document.documentElement.lang = language;
  const guide = tripPlaces.find((place) => place.id === guideId) || areaGuides.find((area) => area.id === areaId) || pillarHubs.find((pillar) => pillar.id === pillarId);
  const title = guide ? `${guide[language].name} — Visit Duvno` : staticPage === 'credits' ? `${t('creditsTitle').replace(/<[^>]+>/g, '')} — Visit Duvno` : t('pageTitle');
  const description = guide ? guide[language].description : staticPage === 'credits' ? t('creditsDescription') : t('metaDescription');
  document.title = title;
  $('meta[name="description"]').content = description;
  $('meta[property="og:title"]').content = title;
  $('meta[property="og:description"]').content = description;
  // Only trusted, repository-owned translation strings are rendered as HTML.
  $$('[data-i18n]').forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  for (const [attribute, property] of [['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt'], ['data-i18n-placeholder', 'placeholder']]) {
    $$(`[${attribute}]`).forEach((element) => element.setAttribute(property, t(element.getAttribute(attribute))));
  }
  $$('[data-language]').forEach((link) => {
    if (link.dataset.language === language) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  applyTheme(document.documentElement.dataset.theme || 'dark');
  stored.write('duvno-language', language);
  renderPlaces(); renderItinerary(); renderSeason(); renderFaqs(); renderTrip();
  if (state.activePlace) renderPlaceDialog();
  $$('.plan-count').forEach((element) => { element.textContent = state.trip.length; });
  $('.plan-toggle').setAttribute('aria-label', `${t('myTrip')}: ${state.trip.length}`);
}

async function renderCredits() {
  try {
    if (!credits) {
      const response = await fetch(`${siteRoot}image-credits.json`);
      if (!response.ok) throw new Error('Credits request failed');
      credits = await response.json();
    }
    $('#credits-list').innerHTML = credits.map((credit) => `<article class="credit-item"><img src="${siteRoot}${escapeHtml(credit.local)}" alt="" width="100" height="70" loading="lazy"><div>${externalLink(credit.page, escapeHtml(credit.title.replace('File:', '')))}<p>${escapeHtml(credit.artist)} · ${externalLink(credit.licenseUrl, escapeHtml(credit.license))}</p></div></article>`).join('');
  } catch {
    $('#credits-list').innerHTML = `<p>${t('creditError')}</p><a href="${siteRoot}image-credits.json">${t('openCreditsFile')}</a>`;
  }
}

function closeMenu() {
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
  $('#navigation').classList.remove('open');
}

$('[data-theme-toggle]')?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  stored.write('duvno-theme', next);
  applyTheme(next);
});

$('.menu-toggle').addEventListener('click', () => {
  const expanded = $('.menu-toggle').getAttribute('aria-expanded') === 'true';
  $('.menu-toggle').setAttribute('aria-expanded', String(!expanded));
  $('#navigation').classList.toggle('open', !expanded);
});
$('#navigation').addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && $('.menu-toggle').getAttribute('aria-expanded') === 'true') {
    closeMenu(); $('.menu-toggle').focus();
  }
});
window.matchMedia('(min-width: 1025px)').addEventListener('change', closeMenu);

document.addEventListener('click', (event) => {
  const place = event.target.closest('[data-place]');
  if (place && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault(); openPlace(place.dataset.place); return;
  }
  const save = event.target.closest('[data-save]');
  if (save) {
    const fromSuggestion = Boolean(save.closest('#trip-suggestion'));
    const alreadySaved = state.trip.includes(save.dataset.save);
    if (alreadySaved) state.trip = state.trip.filter((id) => id !== save.dataset.save);
    else {
      const result = assignNewStops(state.trip, state.plan, [save.dataset.save], state.planDay || 1);
      state.trip = result.trip; state.plan = result.plan;
    }
    syncTrip();
    if (fromSuggestion) $(`#trip-items [data-remove="${save.dataset.save}"]`)?.focus();
    notify(t(alreadySaved ? 'removedToast' : 'addedToast')); return;
  }
  const openPlan = event.target.closest('[data-open-plan]');
  if (openPlan) { renderTrip(); openDialog('trip-dialog'); closeMenu(); return; }
  const close = event.target.closest('[data-close-dialog]');
  if (close) { document.getElementById(close.dataset.closeDialog).close(); return; }
  const language = event.target.closest('[data-language]');
  if (language) {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    stored.write('duvno-language', language.dataset.language);
    const url = new URL(guideId || staticPage ? pageHref(siteRoot, language.dataset.language, guideId || areaId || pillarId, staticPage) : homeHref(siteRoot, language.dataset.language));
    if (areaId || pillarId) {
      const selectedOuting = new URL(location.href).searchParams.get('outing');
      if (selectedOuting) url.searchParams.set('outing', selectedOuting);
      url.hash = location.hash;
    }
    if (!guideId && !staticPage) {
      url.hash = location.hash;
      for (const key of ['area', 'outing', 'where', 'kind', 'q', 'layout', 'river', 'town']) {
        const value = new URL(location.href).searchParams.get(key);
        if (value) url.searchParams.set(key, value);
      }
    }
    location.assign(url.href); return;
  }
  const filter = event.target.closest('[data-filter], [data-filter-link]');
  if (filter) {
    state.category = filter.dataset.filter ?? filter.dataset.filterLink;
    state.search = ''; $('#place-search').value = ''; renderPlaces({ remember: true }); return;
  }
  const view = event.target.closest('[data-place-view]');
  if (view) { state.placeView = view.dataset.placeView; stored.write('duvno-place-view', state.placeView); renderPlaces({ remember: true }); return; }
  const length = event.target.closest('[data-plan-length]');
  if (length) {
    const oldCount = state.plan.dayCount;
    state.plan.dayCount = Number(length.dataset.planLength);
    state.plan = normalizePlan(state.plan, state.trip);
    if (state.planDay > state.plan.dayCount) state.planDay = 0;
    syncTrip();
    if (state.plan.dayCount < oldCount) notify(plannerText[state.language].daysReduced);
    return;
  }
  const planDay = event.target.closest('[data-plan-day]');
  if (planDay) {
    state.planDay = Number(planDay.dataset.planDay);
    stored.write('duvno-plan-day', state.planDay);
    renderTrip();
    $(`#plan-day-tabs [data-plan-day="${state.planDay}"]`)?.focus({ preventScroll: true });
    return;
  }
  if (event.target.closest('#arrange-plan') && state.plan.dayCount > 1) {
    state.previousArrangement = { ...state.plan.assignments };
    state.plan = arrangeByArea(state.trip, state.plan); state.planDay = 0;
    syncTrip(); notify(plannerText[state.language].grouped); return;
  }
  if (event.target.closest('#undo-arrangement') && state.previousArrangement) {
    for (const id of state.trip) if (state.previousArrangement[id]) state.plan.assignments[id] = Math.min(state.plan.dayCount, state.previousArrangement[id]);
    state.previousArrangement = null; syncTrip(); $('#arrange-plan').focus(); return;
  }
  const clearNote = event.target.closest('[data-clear-note]');
  if (clearNote) {
    delete state.plan.notes[clearNote.dataset.clearNote];
    syncTrip(); $(`[data-trip-stop="${clearNote.dataset.clearNote}"] .plan-note summary`)?.focus(); return;
  }
  const days = event.target.closest('[data-days]');
  if (days) { state.days = Number(days.dataset.days); renderItinerary(); return; }
  const vibe = event.target.closest('[data-vibe]');
  if (vibe) { state.vibe = vibe.dataset.vibe; renderItinerary(); return; }
  const season = event.target.closest('[data-season]');
  if (season) { state.season = season.dataset.season; renderSeason(); return; }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    const index = state.trip.indexOf(remove.dataset.remove);
    state.trip = state.trip.filter((id) => id !== remove.dataset.remove); syncTrip();
    const buttons = $$('#trip-items [data-remove]');
    (buttons[Math.min(index, buttons.length - 1)] || $('#trip-dialog [data-close-dialog]')).focus();
    notify(t('removedToast')); return;
  }
  const move = event.target.closest('[data-move]');
  if (move) {
    const id = move.dataset.move;
    const offset = Number(move.dataset.offset);
    state.trip = moveWithinDay(state.trip, state.plan, id, offset); syncTrip();
    const sameButton = $(`#trip-items [data-move="${id}"][data-offset="${offset}"]`);
    (sameButton.disabled ? $(`#trip-items [data-remove="${id}"]`) : sameButton).focus(); return;
  }
  if (event.target.closest('[data-explore-places]')) {
    if (guideId || staticPage) { location.assign(`${homeHref(siteRoot, state.language)}#mjesta`); return; }
    $('#trip-dialog').close(); state.category = 'all'; state.placeArea = 'all'; state.search = ''; $('#place-search').value = ''; renderPlaces({ remember: true });
    $('#mjesta').scrollIntoView(); $('#place-search').focus({ preventScroll: true });
  }
});

$('#trip-dialog').addEventListener('change', (event) => {
  const select = event.target.closest('[data-assign-day]');
  if (!select || !state.trip.includes(select.dataset.assignDay)) return;
  const day = Number(select.value);
  if (!Number.isInteger(day) || day < 1 || day > state.plan.dayCount) return;
  const id = select.dataset.assignDay;
  state.plan.assignments[id] = day; syncTrip();
  ($(`[data-assign-day="${id}"]`) || $(`#plan-day-tabs [data-plan-day="${state.planDay}"]`))?.focus({ preventScroll: true });
  notify(plannerText[state.language].dayChanged);
});
$('#trip-dialog').addEventListener('input', (event) => {
  const input = event.target;
  if (input.id === 'plan-name') {
    state.plan.title = input.value.slice(0, 80); $('#print-plan-name').textContent = state.plan.title;
    stored.write('duvno-plan', state.plan); return;
  }
  if (!input.matches('[data-plan-note]') || !state.trip.includes(input.dataset.planNote)) return;
  const id = input.dataset.planNote;
  const value = input.value.slice(0, 280);
  if (value) state.plan.notes[id] = value; else delete state.plan.notes[id];
  const row = input.closest('[data-trip-stop]');
  row.querySelector('.plan-note summary>span').textContent = plannerText[state.language][value ? 'yourNote' : 'notes'];
  row.querySelector('.plan-print-note').hidden = !value;
  row.querySelector('.plan-print-note>span').textContent = value;
  stored.write('duvno-plan', state.plan);
});

$('#place-search')?.addEventListener('input', (event) => { state.search = event.target.value; renderPlaces({ remember: true }); });
$('#place-area')?.addEventListener('change', (event) => { state.placeArea = event.target.value; renderPlaces({ remember: true }); });
function resetBrowse() { state.category = 'all'; state.placeArea = 'all'; state.search = ''; renderPlaces({ remember: true }); $('#place-search').focus(); }
$('#browse-reset')?.addEventListener('click', resetBrowse);
$('#reset-search')?.addEventListener('click', () => {
  resetBrowse();
});
$('#save-itinerary')?.addEventListener('click', () => {
  state.plan.dayCount = Math.max(state.plan.dayCount, state.days);
  itineraryStyles[state.vibe].slice(0, state.days).forEach((day, index) => {
    const result = assignNewStops(state.trip, state.plan, day.places, index + 1);
    state.trip = result.trip; state.plan = result.plan;
  });
  state.planDay = 0;
  syncTrip(); renderTrip(); openDialog('trip-dialog'); notify(t('itineraryToast'));
});
$('#clear-plan').addEventListener('click', () => {
  state.trip = []; state.plan = normalizePlan({}, []); state.planDay = 0; state.previousArrangement = null;
  syncTrip(); $('#trip-dialog [data-explore-places]').focus(); notify(t('clearToast'));
});
$('#download-plan').addEventListener('click', () => {
  const blob = new Blob(['\uFEFF', planDownload(state.trip, state.language, translations[state.language], state.plan)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `visit-duvno-${state.language}.txt`;
  document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('#print-plan').addEventListener('click', () => {
  const selectedDay = state.planDay;
  state.planDay = 0; renderTrip();
  document.body.classList.add('printing-trip');
  window.addEventListener('afterprint', () => { document.body.classList.remove('printing-trip'); state.planDay = selectedDay; renderTrip(); }, { once: true });
  window.print();
});
$('#share-plan').addEventListener('click', async () => {
  const url = shareUrl(homeHref(siteRoot, state.language), state.trip, state.language, sharedDayLayout(state.trip, state.plan));
  try { await navigator.clipboard.writeText(url); notify(t('copiedToast')); }
  catch {
    let fallback = $('#share-fallback');
    if (!fallback) {
      fallback = document.createElement('label'); fallback.id = 'share-fallback'; fallback.className = 'share-fallback';
      fallback.innerHTML = `<span>${t('shareFallback')}</span><input type="text" readonly>`;
      $('#trip-actions').append(fallback);
    }
    fallback.querySelector('input').value = url; fallback.querySelector('input').focus(); fallback.querySelector('input').select();
    notify(t('copyFailure'));
  }
});
$('#open-credits').addEventListener('click', (event) => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); openDialog('credits-dialog'); renderCredits();
});

$$('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (dialog.contains($('#toast'))) document.body.append($('#toast'));
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-is-open');
    if (dialog.id === 'place-dialog') {
      state.activePlace = null;
      const url = new URL(location.href); url.searchParams.delete('place'); history.replaceState(null, '', url);
    }
  });
});

// A shared link merges known place IDs into the visitor's existing plan, without discarding it.
const shared = importSharedPlan(parameters);
const sharedTrip = shared.trip;
if (sharedTrip.length) {
  state.planDay = 0;
  const existing = new Set(state.trip);
  state.trip = validTrip([...state.trip, ...sharedTrip]);
  state.plan.dayCount = Math.max(state.plan.dayCount, shared.plan.dayCount);
  for (const id of sharedTrip) if (!existing.has(id)) state.plan.assignments[id] = shared.plan.assignments[id];
  state.plan = normalizePlan(state.plan, state.trip);
}
updateLanguage(state.language);
syncTrip();
if (!guideId && !staticPage && state.language !== document.body.dataset.pageLanguage) {
  const url = new URL(homeHref(siteRoot, state.language));
  url.search = location.search;
  url.searchParams.delete('lang');
  url.hash = location.hash;
  location.replace(url.href);
}
$('#year').textContent = new Date().getFullYear();
let lastSurprise;
mountLocalDirectory({ language: state.language, root: siteRoot, getSaved: () => state.trip });
mountAreaGuide({ language: state.language, root: siteRoot, getSaved: () => state.trip });
mountPillarPage({ language: state.language, addStops(ids, message) {
  const result = assignNewStops(state.trip, state.plan, ids, state.planDay || 1);
  state.trip = result.trip; state.plan = result.plan;
  syncTrip(); openDialog('trip-dialog'); notify(message);
} });
mountDiscovery({ language: state.language, root: siteRoot, getSaved: () => state.trip, addStops(ids, message) {
  const result = assignNewStops(state.trip, state.plan, ids, state.planDay || 1);
  state.trip = result.trip; state.plan = result.plan;
  syncTrip(); openDialog('trip-dialog'); notify(message);
} });
mountGuideSearch({ language: state.language, root: siteRoot, openDialog });
mountRiverStory({ language: state.language, root: siteRoot, getSaved: () => state.trip, addStops(ids, message) {
  const result = assignNewStops(state.trip, state.plan, ids, state.planDay || 1);
  state.trip = result.trip; state.plan = result.plan;
  syncTrip(); openDialog('trip-dialog'); notify(message);
} });
mountTownExplorer({ language: state.language, root: siteRoot, getSaved: () => state.trip, addStops(ids, message) {
  const result = assignNewStops(state.trip, state.plan, ids, state.planDay || 1);
  state.trip = result.trip; state.plan = result.plan;
  syncTrip(); openDialog('trip-dialog'); notify(message);
} });
comparison = mountComparison({ language: state.language, root: siteRoot, getSaved: () => state.trip, read: () => stored.read('duvno-compare', []), write: (value) => stored.write('duvno-compare', value), openDialog, notify });
mountImmersion({
  language: state.language, root: siteRoot, openDialog, notify, getSaved: () => state.trip,
  surprise() {
    const matches = findPlaces({ language: state.language, category: state.category, area: state.placeArea, search: state.search });
    const choices = (matches.length ? matches : destinations).filter((place) => place.id !== lastSurprise);
    const place = choices[Math.floor(Math.random() * choices.length)] || matches[0];
    if (place) { lastSurprise = place.id; openPlace(place.id); }
  },
});
if (sharedTrip.length) {
  const url = new URL(location.href);
  for (const key of ['trip', 'days', 'length']) url.searchParams.delete(key);
  history.replaceState(null, '', url);
  openDialog('trip-dialog'); notify(t('sharedPlanToast'));
} else {
  const initialPlace = parameters.get('place') || location.hash.slice(1);
  if (destinations.some((place) => place.id === initialPlace)) openPlace(initialPlace);
}
