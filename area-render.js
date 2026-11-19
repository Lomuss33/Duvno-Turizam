import { destinations, translations, galleryPhotos } from './content.js';
import { localBusinesses } from './local.js';
import { areaGuides, areaText } from './area-data.js';
import { outings, discoveryText } from './discovery-data.js';
import { destinationCard, businessCard, photo } from './render.js';
import { outingStageMarkup } from './discovery-render.js';
import { areaHref, pageHref, homeHref, escapeHtml } from './routes.js';

const entries = [...destinations, ...localBusinesses];
const find = (id) => entries.find((place) => place.id === id);
const gallery = (image) => galleryPhotos.find((item) => item.image === image);

function areaNavigation(area, language, root) {
  return `<nav class="area-navigation" aria-label="${areaText[language].areas}">${areaGuides.map((item, index) => `<a href="${areaHref(root, language, item.id)}" ${area.id === item.id ? 'aria-current="page"' : ''}><span>0${index + 1}</span>${item[language].name}<i aria-hidden="true">↗</i></a>`).join('')}</nav>`;
}

function areaPhotoButton(image, language, root, className = '') {
  const item = gallery(image);
  if (!item) return '';
  return `<button type="button" class="${className}" data-open-gallery="${image}" aria-label="${escapeHtml(item[language].name)}">${photo(image, '', { root, sizes: '(max-width: 760px) 50vw, 28vw' })}<span>${item[language].name}</span><i aria-hidden="true">⤢</i></button>`;
}

export function areaGuideMarkup(area, language, root = './') {
  const t = areaText[language];
  const dt = discoveryText[language];
  const text = area[language];
  const places = destinations.filter((place) => place.area === area.id);
  const businesses = localBusinesses.filter((place) => place.area === area.id);
  const ideas = outings.filter((outing) => outing.area === area.id);
  const photographs = area.photos.filter((image) => gallery(image));
  return `<main id="main" class="area-main"><nav class="breadcrumbs" aria-label="${translations[language].breadcrumbs}"><a href="${homeHref(root, language)}">${translations[language].home}</a><span aria-hidden="true">/</span><a href="${homeHref(root, language)}#kraj">${t.areas}</a><span aria-hidden="true">/</span><span aria-current="page">${text.name}</span></nav>${areaNavigation(area, language, root)}
    <section class="area-hero"><div class="area-hero-cover">${photo(area.image, text.alt, { root, eager: true, sizes: '(max-width: 760px) 100vw, 65vw' })}<div class="area-hero-shade"></div><div class="area-hero-copy"><p class="eyebrow">${text.category} · ${t.areaGuide}</p><h1>${text.name}</h1><p>${text.tagline}</p><div class="area-hero-counts"><a href="#area-places"><strong>${places.length}</strong>${t.sights} ↓</a><a href="#area-local"><strong>${businesses.length}</strong>${t.addresses} ↓</a><a href="#area-outings"><strong>${ideas.length}</strong>${t.outings} ↓</a></div></div></div><div class="area-hero-details">${photographs.slice(1, 3).map((image) => areaPhotoButton(image, language, root)).join('')}${photographs.length < 3 ? `<div class="area-hero-quote"><p class="eyebrow">${t.rhythm}</p><p>${text.rhythm}</p><a href="${area.source}" target="_blank" rel="noopener noreferrer">${t.source} ↗</a></div>` : ''}</div></section>
    <section class="section area-introduction"><div><p class="eyebrow">${t.start}</p><h2>${t.startTitle}</h2><p class="area-lead">${text.description}</p><div class="area-essentials"><div><p class="eyebrow">${t.rhythm}</p><p>${text.rhythm}</p></div><div><p class="eyebrow">${t.takeaway}</p><p>${text.takeaway}</p></div></div></div><div class="area-start-list">${area.start.map((id, index) => { const place = find(id); return `<a href="${pageHref(root, language, id)}"><span>0${index + 1}</span>${photo(place.image, '', { root, sizes: '75px' })}<span><small>${place[language].category}</small><strong>${place[language].name}</strong></span><i aria-hidden="true">↗</i></a>`; }).join('')}</div></section>
    <section class="section area-chapters"><div class="section-heading"><div><p class="eyebrow">${t.chapters}</p><h2>${t.chapterTitle}</h2></div></div><div class="area-chapter-grid">${text.chapters.map((chapter, index) => `<article><span class="area-chapter-number">0${index + 1}</span><h3>${chapter.title}</h3><p>${chapter.text}</p><div>${chapter.places.map((id) => `<a href="${pageHref(root, language, id)}">${find(id)[language].name} ↗</a>`).join('')}</div></article>`).join('')}</div></section>
    <section id="area-places" class="section area-places-section"><div class="section-heading"><div><p class="eyebrow">${text.name}</p><h2>${t.sights} <em>(${places.length})</em></h2></div><a class="text-link" href="${homeHref(root, language)}?area=${area.id}#kraj">${dt.mapLabel} ↗</a></div><div class="place-grid area-place-grid">${places.map((place) => destinationCard(place, language, { root, quickLook: false })).join('')}</div></section>
    <section id="area-local" class="section area-local-section"><div class="section-heading"><div><p class="eyebrow">${t.addresses}</p><h2>${t.localTitle}</h2></div></div><div class="area-offer-filters" role="group" aria-label="${t.addresses}">${['all', 'food', 'stay', 'made'].map((kind, index) => `<button type="button" data-area-offer="${kind}" aria-pressed="${index === 0}">${t[kind === 'all' ? 'allOffers' : kind]}</button>`).join('')}<span id="area-local-count" role="status">${businesses.length}</span></div><p class="directory-note">${t.localNote}</p><div id="area-business-grid" class="business-grid ${businesses.length === 1 ? 'single-business-grid' : ''}">${businesses.map((place) => businessCard(place, language, { root })).join('')}</div><p id="area-local-empty" class="area-local-empty" hidden>${t.localEmpty}</p></section>
    ${ideas.length ? `<section id="area-outings" class="section area-outings-section"><div class="section-heading"><div><p class="eyebrow">${t.outings}</p><h2>${t.outingTitle}</h2></div></div><div class="area-outing-selector" role="group" aria-label="${t.outings}">${ideas.map((outing, index) => `<button type="button" data-area-outing="${outing.id}" aria-pressed="${index === 0}">${outing[language].title} <span aria-hidden="true">↗</span></button>`).join('')}</div><div id="area-outing-stage">${outingStageMarkup(ideas[0], language, root)}</div><p class="directory-note">${dt.outingNote}</p><noscript><div class="area-static-outings">${ideas.slice(1).map((outing) => `<h3><a href="${homeHref(root, language)}?outing=${outing.id}#izleti">${outing[language].title} ↗</a></h3>`).join('')}</div></noscript></section>` : ''}
    <section class="section area-photo-section"><div class="section-heading"><div><p class="eyebrow">${t.photos}</p><h2>${t.photoTitle}</h2></div><p class="section-aside">${t.photoHint}</p></div><div class="area-photo-grid">${photographs.map((image) => areaPhotoButton(image, language, root)).join('')}</div></section>
    <section class="section area-practical"><div><p class="eyebrow">${t.before}</p><p>${text.arrival}</p></div><a class="text-link" href="${area.source}" target="_blank" rel="noopener noreferrer">${t.source} ↗</a></section>
    <section class="section other-areas"><div class="section-heading"><div><p class="eyebrow">${t.moreAreas}</p><h2>${t.moreTitle}</h2></div></div><div>${areaGuides.filter((item) => item.id !== area.id).map((item) => `<a href="${areaHref(root, language, item.id)}">${photo(item.image, '', { root, sizes: '(max-width: 760px) 45vw, 24vw' })}<span><small>${item[language].category}</small><strong>${item[language].name} ↗</strong></span></a>`).join('')}</div></section>
  </main>`;
}

export function guideAreaLinkMarkup(place, language, root = './') {
  const area = areaGuides.find((item) => item.id === place.area);
  if (!area) return '';
  const t = areaText[language];
  return `<a class="guide-area-link" href="${areaHref(root, language, area.id)}">${photo(area.image, '', { root, sizes: '70px' })}<span><small>${t.guideInArea}</small><strong>${area[language].name}</strong><span>${t.exploreArea} ↗</span></span></a>`;
}

export function placePhotoStoryMarkup(place, language, root = './') {
  const t = areaText[language];
  const area = areaGuides.find((item) => item.id === place.area);
  if (!area) return '';
  const exact = galleryPhotos.filter((item) => item.id === place.id).map((item) => item.image);
  const choices = [...new Set([...exact, ...area.photos])].filter((image) => image !== place.image && gallery(image)).slice(0, 4);
  if (!choices.length) return '';
  return `<section class="section guide-photo-story"><div class="guide-photo-story-heading"><p class="eyebrow">${t.photoContext}</p><h2>${t.photosNear}</h2><a href="${areaHref(root, language, place.area)}">${area[language].name} ↗</a></div><div class="guide-photo-strip">${choices.map((image) => areaPhotoButton(image, language, root)).join('')}</div></section>`;
}
