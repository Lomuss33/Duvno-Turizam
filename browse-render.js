import { destinations, translations, galleryPhotos } from './content.js';
import { browseText, validComparison, photographArea } from './browse-data.js';
import { photo, areaName, savePlaceButton } from './render.js';
import { pageHref, homeHref, escapeHtml } from './routes.js';

export const browseAreas = ['town', 'field', 'busko', 'sujica', 'blidinje'];

export function browseToolbarMarkup(language) {
  const t = browseText[language];
  return `<div class="browse-options"><label class="browse-area"><span class="sr-only">${t.area}</span><select id="place-area"><option value="all">${t.allAreas}</option>${browseAreas.map((area) => `<option value="${area}">${areaName(area, language)}</option>`).join('')}</select></label><div class="browse-views" role="group" aria-label="${t.view}"><button type="button" data-place-view="cards" aria-pressed="true"><span aria-hidden="true">▦</span>${t.cards}</button><button type="button" data-place-view="list" aria-pressed="false"><span aria-hidden="true">☷</span>${t.list}</button></div><span id="browse-count" ></span><button type="button" id="browse-reset" hidden>${t.reset} ↻</button></div><div id="compare-tray" class="compare-tray"><p>${t.compareHint}</p><div id="compare-thumbnails"></div><button type="button" data-open-compare disabled>${t.compare} <span id="compare-count">0/3</span></button></div>`;
}

export function compareDialogMarkup(language, root = './') {
  const t = browseText[language];
  return `<dialog id="compare-dialog" class="compare-dialog" aria-labelledby="compare-title"><div class="dialog-header"><div><p class="eyebrow">${t.compareEyebrow}</p><h2 id="compare-title">${t.compareTitle}</h2></div><button type="button" class="dialog-close" data-close-dialog="compare-dialog" aria-label="${translations[language].close}">×</button></div><p class="compare-scroll-hint">${t.compareScroll}</p><div id="compare-content"></div><div class="compare-footer"><a class="text-link" href="${homeHref(root, language)}#mjesta" id="compare-more">${t.chooseMore} ↗</a><button type="button" id="compare-clear">${t.clearCompare}</button></div></dialog>`;
}

export function comparisonMarkup(ids, language, root, saved = []) {
  const t = browseText[language];
  const places = validComparison(ids).map((id) => destinations.find((place) => place.id === id));
  if (!places.length) return `<p class="compare-empty">${t.compareEmpty}</p>`;
  const rows = [
    [t.compareArea, (place) => areaName(place.area, language)],
    [t.compareVisit, (place) => place[language].time],
    [t.compareMood, (place) => place[language].mood],
    [t.comparePractical, (place) => place[language].practical],
    [t.compareSource, (place) => `<a href="${place.source}" target="_blank" rel="noopener noreferrer">${t.compareSource} ↗</a>`],
  ];
  return `<div class="compare-table-wrap" tabindex="0" role="region" aria-label="${t.compareScroll}"><table class="compare-table"><caption class="sr-only">${t.compareEyebrow}</caption><thead><tr><td class="compare-label-cell"><div class="compare-key"><span aria-hidden="true">↔</span><strong>${places.length}</strong><small>${t.selected}</small></div></td>${places.map((place) => `<th scope="col"><div class="compare-place-photo">${photo(place.image, '', { root, sizes: '300px' })}<button type="button" data-compare="${place.id}" aria-label="${escapeHtml(`${t.removeCompare}: ${place[language].name}`)}">×</button></div><div class="compare-place-heading">${place.photoContext ? `<small class="compare-photo-note">${place.photoContext[language]}</small>` : ''}<p>${place[language].category}</p><h3><a href="${pageHref(root, language, place.id)}">${place[language].name} ↗</a></h3>${savePlaceButton(place, language, { saved: saved.includes(place.id) })}</div></th>`).join('')}</tr></thead><tbody>${rows.map(([label, value]) => `<tr><th scope="row">${label}</th>${places.map((place) => `<td>${value(place)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function photoFilterMarkup(language, attribute) {
  const t = browseText[language];
  return `<div class="photo-area-filters" role="group" aria-label="${t.photoAreas}">${['all', ...browseAreas].map((area) => `<button type="button" ${attribute}="${area}" aria-pressed="${area === 'all'}">${area === 'all' ? t.allPhotos : areaName(area, language)}<span>${galleryPhotos.filter((item) => area === 'all' || photographArea(item) === area).length}</span></button>`).join('')}</div>`;
}
