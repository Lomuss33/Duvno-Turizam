import { destinations } from './content.js';
import { localBusinesses } from './local.js';
import { discoveryText } from './discovery-data.js';
import { photo, areaName } from './render.js';
import { pageHref, escapeHtml } from './routes.js';
import { normalizeSearch } from './trip.js';
import { areaGuides } from './area-data.js';
import { pillarHubs } from './pillars-data.js';

export function searchDialogMarkup(language) {
  const t = discoveryText[language];
  return `<dialog id="search-dialog" class="guide-search-dialog" aria-labelledby="search-dialog-title"><div class="dialog-header"><div><p class="eyebrow">VISIT DUVNO · ${t.searchAll}</p><h2 id="search-dialog-title">${t.searchTitle}</h2></div><button type="button" class="dialog-close" data-close-dialog="search-dialog" aria-label="${language === 'hr' ? 'Zatvori' : 'Close'}">×</button></div><form id="guide-search-form" role="search"><label><span aria-hidden="true">⌕</span><input type="search" id="guide-search-input" maxlength="100" autocomplete="off" placeholder="${t.searchPlaceholder}" aria-label="${t.searchLabel}"></label></form><div class="guide-search-filters" role="group" aria-label="${t.searchAll}">${['all', 'areas', 'sights', 'local'].map((type, index) => `<button type="button" data-search-kind="${type}" aria-pressed="${index === 0}">${t[['searchAll', 'searchAreas', 'searchSights', 'searchLocal'][index]]}</button>`).join('')}<span id="guide-search-count" role="status"></span></div><div id="guide-search-results" class="guide-search-results"></div><p class="guide-search-hint">${t.searchHint}<kbd>Ctrl K</kbd></p></dialog>`;
}

export function mountGuideSearch({ language, root, openDialog }) {
  const dialog = document.querySelector('#search-dialog');
  if (!dialog) return;
  const t = discoveryText[language];
  const all = [...pillarHubs.filter((item) => item.kind === 'pillar').map((pillar) => ({ ...pillar, area: 'town' })), ...areaGuides.map((area) => ({ ...area, area: area.id })), ...destinations, ...localBusinesses];
  const input = dialog.querySelector('#guide-search-input');
  const results = dialog.querySelector('#guide-search-results');
  let kind = 'all';
  function render() {
    const query = normalizeSearch(input.value);
    const matches = all.filter((place) => (kind === 'all' || (kind === 'local' ? place.kind === 'business' : kind === 'areas' ? place.kind === 'area' : !['area', 'business'].includes(place.kind))) && normalizeSearch([place.hr.name, place.en.name, place[language].description, place[language].category, place[language].mood, place.location || '', areaName(place.area, language)].join(' ')).includes(query));
    // Name matches come first; source-backed description text remains searchable too.
    matches.sort((a, b) => Number(normalizeSearch(b[language].name).includes(query)) - Number(normalizeSearch(a[language].name).includes(query)));
    dialog.querySelector('#guide-search-count').textContent = `${matches.length} ${t.searchResults}`;
    results.innerHTML = matches.length ? `${!query ? `<p class="search-browse-label">${t.searchBrowse}</p>` : ''}${matches.slice(0, query ? 24 : 8).map((place) => `<a class="guide-search-result" href="${pageHref(root, language, place.id, place.kind === 'area' ? 'area' : place.kind === 'pillar' ? 'pillar' : 'home')}">${photo(place.image, '', { root, sizes: '70px' })}<span><small>${escapeHtml(place[language].category)} · ${escapeHtml(areaName(place.area, language))}</small><strong>${escapeHtml(place[language].name)}</strong><span>${escapeHtml(place[language].tagline)}</span></span><i aria-hidden="true">↗</i></a>`).join('')}` : `<p class="search-no-results">${t.searchEmpty}</p>`;
  }
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-open-search]')) { render(); openDialog('search-dialog'); input.focus(); }
    const filter = event.target.closest('[data-search-kind]');
    if (filter) {
      kind = filter.dataset.searchKind;
      dialog.querySelectorAll('[data-search-kind]').forEach((button) => button.setAttribute('aria-pressed', String(button === filter))); render(); input.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && (!document.querySelector('dialog[open]') || dialog.open)) {
      event.preventDefault(); if (dialog.open) dialog.close(); else { render(); openDialog('search-dialog'); input.focus(); }
    }
  });
  input.addEventListener('input', render);
  dialog.querySelector('#guide-search-form').addEventListener('submit', (event) => { event.preventDefault(); results.querySelector('a')?.click(); });
  dialog.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    event.preventDefault();
    const index = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') links[(index + 1) % links.length].focus();
    else if (index <= 0) input.focus(); else links[index - 1].focus();
  });
}
