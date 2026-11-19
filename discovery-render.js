import { destinations } from './content.js';
import { localBusinesses } from './local.js';
import { atlasAreas, outings, historyChapters, discoveryText, foodNotes, foodSource } from './discovery-data.js';
import { photo, savePlaceButton } from './render.js';
import { pageHref, homeHref, escapeHtml, areaHref } from './routes.js';

const entries = [...destinations, ...localBusinesses];
const entry = (id) => entries.find((place) => place.id === id);

export function atlasCard(place, language, root, saved = []) {
  const text = place[language];
  return `<article class="atlas-place"><a href="${pageHref(root, language, place.id)}">${photo(place.image, '', { root, sizes: '(max-width: 760px) 42vw, 16vw' })}<span><small>${text.category}</small><strong>${text.name}</strong><i aria-hidden="true">↗</i></span></a>${savePlaceButton(place, language, { compact: true, saved: saved.includes(place.id) })}</article>`;
}

export function atlasSelectionMarkup(language, root, areaId = 'town') {
  const area = atlasAreas.find((item) => item.id === areaId) || atlasAreas[0];
  const text = area[language];
  const t = discoveryText[language];
  const outing = outings.find((item) => item.area === area.id);
  return `${photo(area.image, '', { root, sizes: '(max-width: 760px) 100vw, 40vw' })}<div class="atlas-cover-shade"></div><div class="atlas-cover-copy"><p class="eyebrow">${text.detail}</p><h3>${text.title}</h3><p>${text.text}</p><div class="atlas-cover-links"><a class="atlas-area-link" href="${areaHref(root, language, area.id)}">${t.openArea} ↗</a><a class="atlas-outing-link" href="${homeHref(root, language)}?outing=${outing.id}#izleti"><span>${t.areaOuting}</span><strong>${outing[language].title} ↗</strong></a></div></div><button type="button" class="photo-expand" data-open-gallery="${area.image}" aria-label="${escapeHtml(text.name)}">⤢</button>`;
}

export function orientationMarkup(language) {
  const t = discoveryText[language];
  const contours = Array.from({ length: 9 }, (_, i) => `<path d="M${-150 + i * 62} -40 Q${200 + i * 30} 70 ${120 + i * 64} 200 T${180 + i * 88} 500"/>`).join('');
  return `<svg viewBox="0 0 760 430" class="orientation-map" role="group" aria-label="${t.mapLabel}"><defs><pattern id="atlas-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#839778" stroke-width=".4" opacity=".25"/></pattern></defs><rect width="760" height="430" fill="#20372b"/><rect width="760" height="430" fill="url(#atlas-grid)"/><g class="atlas-contours">${contours}</g><text class="orientation-north" x="710" y="45">N ↑</text><text class="orientation-coordinate" x="22" y="33">43° N / 17° E</text>${atlasAreas.map((area, index) => {
    const x = (area.point[1] - 16.98) / .66 * 760;
    const y = (43.90 - area.point[0]) / .36 * 430;
    return `<g data-atlas-area="${area.id}" tabindex="0" role="button" aria-label="${area[language].name}" aria-pressed="${index === 0}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle class="orientation-halo" r="23"/><circle class="orientation-dot" r="8"/><text x="${area.id === 'field' ? -15 : 17}" y="${area.id === 'field' ? 25 : 5}" text-anchor="${area.id === 'field' ? 'end' : 'start'}">${area[language].short}</text></g>`;
  }).join('')}</svg>`;
}

export function atlasMarkup(language, root = './') {
  const t = discoveryText[language];
  return `<section id="kraj" class="section discovery-atlas"><div class="section-heading"><div><p class="eyebrow">${t.atlasEyebrow}</p><h2>${t.atlasTitle}</h2></div><p class="section-aside">${t.atlasIntro}</p></div><div class="atlas-area-tabs" role="group" aria-label="${t.mapLabel}">${atlasAreas.map((area, index) => `<button type="button" data-atlas-area="${area.id}" aria-pressed="${index === 0}" class="${index === 0 ? 'active' : ''}"><span>0${index + 1}</span>${area[language].name}<small>${entries.filter((item) => item.area === area.id).length}</small></button>`).join('')}</div><div class="atlas-board"><div id="atlas-cover" class="atlas-cover">${atlasSelectionMarkup(language, root)}</div><div class="atlas-map-shell"><div id="atlas-orientation">${orientationMarkup(language)}</div><div id="atlas-map" class="atlas-map" aria-label="${t.mapLabel}" hidden></div><div class="atlas-map-controls"><span>${t.mapHint}</span><button type="button" id="load-atlas-map">${t.mapLoad} <span aria-hidden="true">↗</span></button><button type="button" id="atlas-map-reset" hidden>${t.mapOverview} ⤢</button></div><p id="atlas-map-status" class="sr-only" role="status"></p></div></div><div class="atlas-collection-heading"><p><span class="eyebrow">${t.selectedArea}</span><strong id="atlas-area-name">${atlasAreas[0][language].name}</strong></p><div role="group" aria-label="${t.both}">${['all', 'sights', 'local'].map((kind, index) => `<button type="button" data-atlas-kind="${kind}" aria-pressed="${index === 0}">${t[kind === 'all' ? 'both' : kind]}</button>`).join('')}</div><span id="atlas-count" role="status"></span></div><div id="atlas-places" class="atlas-places">${entries.filter((place) => place.area === 'town').map((place) => atlasCard(place, language, root)).join('')}</div></section>`;
}

export function outingStageMarkup(outing, language, root = './', saved = []) {
  const t = discoveryText[language];
  const text = outing[language];
  return `<div class="outing-feature"><div class="outing-feature-image">${photo(outing.image, '', { root, sizes: '(max-width: 760px) 100vw, 36vw' })}<span>${atlasAreas.find((area) => area.id === outing.area)[language].name}</span></div><div class="outing-feature-copy"><p class="eyebrow">${text.time} <span>·</span> ${text.rhythm}</p><h3>${text.title}</h3><p>${text.description}</p><div class="outing-feature-bottom"><span>${String(outing.stops.length).padStart(2, '0')} ${t.stops}</span><button class="button button-light" type="button" data-add-outing="${outing.id}">${t.addOuting}<span aria-hidden="true">+</span></button></div></div></div><ol class="outing-stops">${outing.stops.map((id, index) => {
    const place = entry(id);
    return `<li><span class="outing-stop-index">0${index + 1}</span><a class="outing-stop-image" href="${pageHref(root, language, id)}" tabindex="-1" aria-hidden="true">${photo(place.image, '', { root, sizes: '150px' })}${place.kind === 'business' ? `<small>${t.stopPhoto}</small>` : ''}</a><div><p>${text.roles[index]}</p><h4><a href="${pageHref(root, language, id)}">${place[language].name} ↗</a></h4><span>${place[language].category}</span></div>${savePlaceButton(place, language, { compact: true, saved: saved.includes(id) })}</li>`;
  }).join('')}</ol><p class="outing-detail-note">↳ ${text.note}</p>`;
}

export function outingsMarkup(language, root = './') {
  const t = discoveryText[language];
  return `<section id="izleti" class="section outings-section"><div class="section-heading"><div><p class="eyebrow">${t.outingsEyebrow}</p><h2>${t.outingsTitle}</h2></div><p class="section-aside">${t.outingsIntro}</p></div><div class="outing-filters"><label><span>${language === 'hr' ? 'GDJE?' : 'WHERE?'}</span><select id="outing-area"><option value="all">${t.anyArea}</option>${atlasAreas.map((area) => `<option value="${area.id}">${area[language].name}</option>`).join('')}</select></label><label><span>${language === 'hr' ? 'KOLIKO VREMENA?' : 'HOW LONG?'}</span><select id="outing-length"><option value="all">${t.anyTime}</option><option value="short">${t.short}</option><option value="day">${t.day}</option></select></label><label><span>${language === 'hr' ? 'ŠTO TE PRIVLAČI?' : 'WHAT DRAWS YOU?'}</span><select id="outing-interest"><option value="all">${t.anyInterest}</option>${['nature', 'culture', 'water', 'food'].map((interest) => `<option value="${interest}">${t[interest]}</option>`).join('')}</select></label><p id="outing-count" role="status">${outings.length} ${t.outingCount}</p></div><div class="outing-browser"><div id="outing-options" class="outing-options" role="group" aria-label="${t.viewOuting}">${outingOptionsMarkup(outings, language, root, outings[0].id)}</div><div id="outing-stage" class="outing-stage" aria-live="polite">${outingStageMarkup(outings[0], language, root)}</div></div><p class="directory-note">${t.outingNote}</p></section>`;
}

export function outingOptionsMarkup(items, language, root, selected) {
  return items.map((outing, index) => `<button type="button" data-outing="${outing.id}" aria-pressed="${outing.id === selected}" class="${outing.id === selected ? 'active' : ''}">${photo(outing.image, '', { root, sizes: '85px' })}<span><small>${outing[language].time}</small><strong>${outing[language].title}</strong></span><i aria-hidden="true">${outing.id === selected ? '↗' : String(index + 1).padStart(2, '0')}</i></button>`).join('');
}

export function historyStageMarkup(chapter, language, root = './') {
  const t = discoveryText[language];
  const text = chapter[language];
  return `<div class="history-photo">${photo(chapter.image, '', { root, sizes: '(max-width: 760px) 90vw, 40vw' })}<span>${t.historyPhotoNote}</span></div><div class="history-copy"><p class="eyebrow">${chapter.date[language]}</p><h3>${text.title}</h3><p>${text.text}</p><div class="history-guide-links">${chapter.places.map((id) => `<a href="${pageHref(root, language, id)}">${entry(id)[language].name} ↗</a>`).join('')}</div><a class="history-source" href="${chapter.source}" target="_blank" rel="noopener noreferrer">${t.chapterSource} ↗</a></div>`;
}

export function historyMarkup(language, root = './') {
  const t = discoveryText[language];
  return `<section id="povijest" class="section history-section"><div class="section-heading"><div><p class="eyebrow">${t.historyEyebrow}</p><h2>${t.historyTitle}</h2></div><p class="section-aside">${t.historyIntro}</p></div><div class="history-timeline" role="group" aria-label="${t.historyTitle.replace(/<[^>]+>/g, '')}">${historyChapters.map((chapter, index) => `<button type="button" data-history="${chapter.id}" aria-pressed="${index === 0}"><span>0${index + 1}</span><strong>${chapter.date[language]}</strong><i aria-hidden="true">${index === 0 ? '●' : '○'}</i></button>`).join('')}</div><div id="history-stage" class="history-stage" aria-live="polite">${historyStageMarkup(historyChapters[0], language, root)}</div><noscript><div class="history-static">${historyChapters.slice(1).map((chapter) => `<article><h3>${chapter[language].title}</h3><p>${chapter[language].text}</p><a href="${chapter.source}">${t.chapterSource} ↗</a></article>`).join('')}</div></noscript></section>`;
}

export function guideConnectionsMarkup(place, language, root = './') {
  const t = discoveryText[language];
  const matches = outings.filter((outing) => outing.stops.includes(place.id));
  const relevant = matches.length ? matches : outings.filter((outing) => outing.area === place.area).slice(0, 1);
  if (!relevant.length) return '';
  return `<section class="section guide-connections"><div class="section-heading"><div><p class="eyebrow">${t.relatedOuting}</p><h2>${t.relatedTitle}</h2></div><a class="text-link" href="${homeHref(root, language)}?area=${place.area}#kraj">${t.sameArea} ↗</a></div><div class="guide-outings">${relevant.slice(0, 2).map((outing) => `<article>${photo(outing.image, '', { root, sizes: '(max-width: 760px) 35vw, 200px' })}<div><p class="eyebrow">${outing[language].time} · ${outing.stops.length} ${t.stops}</p><h3><a href="${homeHref(root, language)}?outing=${outing.id}#izleti">${outing[language].title} ↗</a></h3><p>${outing[language].description}</p><div>${outing.stops.map((id) => `<a href="${pageHref(root, language, id)}">${entry(id)[language].name}</a>`).join('')}</div></div><button type="button" data-add-outing="${outing.id}" class="connection-save" aria-label="${escapeHtml(`${t.addOuting}: ${outing[language].title}`)}">+</button></article>`).join('')}</div></section>`;
}

export function foodMarkup(language, root = './') {
  const t = discoveryText[language];
  return `<section id="okusi" class="section food-section"><div class="section-heading"><div><p class="eyebrow">${t.foodEyebrow}</p><h2>${t.foodTitle}</h2></div><p class="section-aside">${t.foodIntro}</p></div><div class="food-grid">${foodNotes.map((note, index) => `<article class="food-card"><figure>${photo(note.image, note[language].caption, { root, sizes: '(max-width: 760px) 45vw, 24vw' })}<figcaption>${note[language].caption}</figcaption><span aria-hidden="true">0${index + 1}</span></figure><div><h3>${note[language].name}</h3><p>${note[language].text}</p><span class="food-ask-label">${t.foodAsk}</span><div class="food-local-links">${note.places.map((id) => `<a href="${pageHref(root, language, id)}">${entry(id)[language].name} ↗</a>`).join('')}</div></div></article>`).join('')}</div><div class="food-footer"><p>${t.foodNote}</p><a href="${foodSource}" target="_blank" rel="noopener noreferrer">${t.foodSource} ↗</a></div></section>`;
}
