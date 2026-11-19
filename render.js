import { destinations, translations, itineraryStyles, seasons, faqs, regions, landscapeScenes, galleryPhotos, heritageStories } from './content.js';
import { localBusinesses } from './local.js';
import { mapUrl } from './trip.js';
import { pageHref, homeHref, escapeHtml } from './routes.js';
import { browseText } from './browse-data.js';

export function photo(image, alt, { root = './', sizes = '100vw', className = '', eager = false } = {}) {
  return `<img class="${className}" src="${root}images/${image}.webp" srcset="${root}images/${image}-640.webp 640w, ${root}images/${image}-960.webp 960w, ${root}images/${image}.webp 1920w" sizes="${sizes}" alt="${escapeHtml(alt)}" width="1920" height="1080" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
}

export function savePlaceButton(place, language, { compact = false, saved = false } = {}) {
  const t = translations[language];
  return `<button type="button" class="save-place ${compact ? 'compact' : 'button button-dark'} ${saved ? 'is-saved' : ''}" data-save="${place.id}" aria-pressed="${saved}" aria-label="${escapeHtml(`${saved ? t.saved : t.save}: ${place[language].name}`)}"><span aria-hidden="true">${saved ? '♥' : '♡'}</span>${compact ? '' : `<span data-save-label>${saved ? t.saved : t.save}</span>`}</button>`;
}

export function destinationCard(place, language, { root = './', saved = false, quickLook = true } = {}) {
  const content = place[language];
  const href = pageHref(root, language, place.id);
  return `<article class="place-card" id="${place.id}"><div class="card-image"><a href="${href}" tabindex="-1" aria-hidden="true">${photo(place.image, '', { root, sizes: '(max-width: 760px) 45vw, (max-width: 1200px) 30vw, 17vw' })}</a><span class="card-category">${content.category}</span>${savePlaceButton(place, language, { compact: true, saved })}<button type="button" class="card-compare" data-compare="${place.id}" aria-pressed="false" aria-label="${escapeHtml(`${browseText[language].compare}: ${content.name}`)}"><span aria-hidden="true">↔</span></button>${quickLook ? `<button type="button" class="quick-look" data-place="${place.id}" aria-label="${escapeHtml(`${translations[language].quickLook}: ${content.name}`)}">${translations[language].quickLook}<span aria-hidden="true">+</span></button>` : ''}</div><div class="card-content"><p class="card-time">${content.time}</p><h3><a href="${href}" data-guide="${place.id}">${content.name}<span class="card-arrow" aria-hidden="true">↗</span></a></h3><p>${content.tagline}</p>${place.photoContext ? `<small class="image-context">${place.photoContext[language]}</small>` : ''}</div></article>`;
}

export function areaName(area, language) {
  return translations[language][({ town: 'areaTown', field: 'areaField', busko: 'areaBusko', sujica: 'areaSujica', blidinje: 'areaBlidinje' })[area]];
}

export function businessCard(business, language, { root = './', saved = false } = {}) {
  const text = business[language];
  const t = translations[language];
  return `<article class="business-card" data-business-id="${business.id}"><div class="business-image">${photo(business.image, text.alt, { root, sizes: '130px' })}<span>${business.location}</span></div><div class="business-copy"><p class="business-category">${text.category} <span>· ${areaName(business.area, language)}</span></p><h3><a href="${pageHref(root, language, business.id)}">${text.name}</a></h3><p class="business-summary">${text.description}</p><div class="business-actions"><a href="${pageHref(root, language, business.id)}">${t.businessGuide} ↗</a>${business.phone ? `<a href="tel:${business.phone.replace(/\s/g, '')}" class="business-call">${t.businessCall} ↗</a>` : `<a href="${mapUrl(business.map)}" target="_blank" rel="noopener noreferrer">${t.map} ↗</a>`}</div></div>${savePlaceButton(business, language, { compact: true, saved })}</article>`;
}

export function businessSectionMarkup(language, root = './') {
  const t = translations[language];
  return `<section id="lokalno" class="section local-directory"><div class="section-heading"><div><p class="eyebrow">${t.localEyebrow}</p><h2>${t.localTitle}</h2></div><p class="section-aside">${t.localIntro}</p></div><div class="business-toolbar"><div class="business-filters" role="group" aria-label="${t.localAll}">${['all', 'eat', 'drink', 'stay', 'made', 'active'].map((filter) => `<button type="button" data-business-filter="${filter}" aria-pressed="${filter === 'all'}" class="${filter === 'all' ? 'active' : ''}">${t[filter === 'all' ? 'localAll' : filter]}</button>`).join('')}</div><label class="search-field"><span aria-hidden="true">⌕</span><input id="business-search" type="search" maxlength="100" placeholder="${t.localPlaceholder}" aria-label="${t.localSearch}"></label><select id="business-area" aria-label="${t.businessArea}"><option value="all">${t.areaAll}</option>${['town', 'field', 'busko', 'sujica', 'blidinje'].map((area) => `<option value="${area}">${areaName(area, language)}</option>`).join('')}</select></div><p class="directory-note">${t.businessPhotoNote}</p><p id="business-result-count" class="sr-only" role="status"></p><div id="business-grid" class="business-grid">${localBusinesses.map((business) => businessCard(business, language, { root })).join('')}</div><div id="business-empty" class="empty-results" hidden><p>${t.localEmpty}</p><button type="button" class="text-link" id="business-reset">${t.localReset} ↗</button></div><p class="directory-note">${t.businessNote}</p></section>`;
}

export function nearbyBusinessesMarkup(place, language, root = './') {
  const matches = localBusinesses.filter((business) => business.area === place.area || business.nearby.includes(place.id)).slice(0, 4);
  if (!matches.length) return '';
  const t = translations[language];
  return `<section class="section local-nearby"><div class="section-heading"><div><p class="eyebrow">${t.localNearby}</p><h2>${t.localNearbyTitle}</h2></div><a class="text-link" href="${homeHref(root, language)}#lokalno">${t.allLocal} ↗</a></div><p class="directory-note">${t.businessPhotoNote}</p><div class="business-grid">${matches.map((business) => businessCard(business, language, { root })).join('')}</div></section>`;
}

export function photoJournalMarkup(language, root = './') {
  const t = translations[language];
  return `<section id="galerija" class="section photo-journal"><div class="section-heading"><div><p class="eyebrow">${t.journalEyebrow}</p><h2>${t.journalTitle}</h2></div><p class="section-aside">${t.journalHint}</p></div><div class="journal-grid">${galleryPhotos.map((item) => `<button type="button" data-open-gallery="${item.image}" aria-label="${escapeHtml(item[language].name)}">${photo(item.image, '', { root, sizes: '(max-width: 480px) 25vw, 10vw' })}<span>${item[language].name}</span><i aria-hidden="true">⤢</i></button>`).join('')}</div></section>`;
}

export function heritageMarkup(language, root = './') {
  const t = translations[language];
  return `<section id="bastina" class="section heritage-section"><div class="section-heading"><div><p class="eyebrow">${t.heritageEyebrow}</p><h2>${t.heritageTitle}</h2></div></div><div class="heritage-grid">${heritageStories.map((story) => `<article class="heritage-card"><figure>${photo(story.image, story.photoPlace, { root, sizes: '(max-width: 760px) 45vw, 30vw' })}<figcaption>${story.photoPlace}</figcaption></figure><div><h3>${story[language].title}</h3><p>${story[language].text}</p><div class="heritage-links">${story.places.map((id) => `<a href="${pageHref(root, language, id)}">${destinations.find((place) => place.id === id)[language].name} ↗</a>`).join('')}<a class="heritage-source" href="${story.source}" target="_blank" rel="noopener noreferrer">${t.heritageMore} ↗</a></div></div></article>`).join('')}</div></section>`;
}

export function heroMosaicMarkup(language, root = './') {
  return `<div class="hero-mosaic">${['galecka', 'dugo-polje', 'basilica-front', 'strzanj'].map((image) => {
    const item = galleryPhotos.find((entry) => entry.image === image);
    return `<button type="button" data-open-gallery="${image}" aria-label="${escapeHtml(item[language].name)}">${photo(image, '', { root, sizes: '220px' })}<span>${item[language].name} <i aria-hidden="true">↗</i></span></button>`;
  }).join('')}</div>`;
}

export function collectionBarMarkup(language, root = './') {
  const t = translations[language];
  return `<nav id="otkrij" class="collection-bar" aria-label="${t.collectionLabel}"><a href="${homeHref(root, language)}#mjesta"><strong>${destinations.length}</strong> ${t.placeCount}</a><a href="${homeHref(root, language)}#lokalno"><strong>${localBusinesses.length}</strong> ${t.businessCount}</a><a href="${homeHref(root, language)}#galerija"><strong>${galleryPhotos.length}</strong> ${t.imageCount}</a><a href="${homeHref(root, language)}#bastina">${t.navHeritage} ↗</a><a href="${homeHref(root, language)}#vikend">${t.navWeekend} ↗</a></nav>`;
}

export function itineraryMarkup(language, days = 2, root = './', vibe = 'slow') {
  return itineraryStyles[vibe].slice(0, days).map((day, index) => `<article><span class="itinerary-number">0${index + 1}</span><div><p class="eyebrow">${translations[language].day} ${index + 1}</p><h3>${day[language].title}</h3><p>${day[language].description}</p><div class="itinerary-places">${day.places.map((id) => `<a href="${pageHref(root, language, id)}">${destinations.find((place) => place.id === id)[language].name} ↗</a>`).join('')}</div></div></article>`).join('');
}

export function seasonMarkup(language, selected = 'spring', root = './') {
  const season = seasons[selected];
  const content = season[language];
  const imagePlace = destinations.find((place) => place.image === season.image);
  return `<div class="season-photo">${photo(season.image, imagePlace[language].alt, { root, sizes: '(max-width: 760px) 90vw, 45vw' })}</div><div class="season-copy"><p class="eyebrow">${content.months}</p><h3>${content.title}</h3><p>${content.description}</p><div class="tags">${content.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><div class="season-tip"><span aria-hidden="true">✳</span><div><strong>${translations[language].seasonTip}</strong><p>${content.tip}</p></div></div></div>`;
}

export function faqMarkup(language, opened = []) {
  return faqs.map((faq, index) => `<details ${opened[index] ? 'open' : ''}><summary>${faq[language].question}<span aria-hidden="true"></span></summary><div><p>${faq[language].answer}</p>${faq.url ? `<a class="text-link" href="${escapeHtml(faq.url)}" target="_blank" rel="noopener noreferrer">${faq[language].link} ↗</a>` : ''}</div></details>`).join('');
}

export function heroScenesMarkup(language, root = './') {
  const t = translations[language];
  return `<div class="scene-selector" role="group" aria-label="${t.sceneSelector}">${landscapeScenes.map((scene, index) => `<button type="button" class="scene-button ${index === 0 ? 'active' : ''}" data-scene="${scene.image}" aria-pressed="${index === 0}">${photo(scene.image, '', { root, sizes: '100px' })}<span><small>0${index + 1}</small><strong>${t[scene.label]}</strong></span><span class="scene-indicator" aria-hidden="true">↗</span></button>`).join('')}</div>`;
}

export function regionStageMarkup(language, root = './', index = 0) {
  const region = regions[index];
  const t = translations[language];
  const destination = destinations.find((place) => place.image === region.image);
  return `${photo(region.image, destination[language].alt, { root, className: 'region-scene-image', sizes: '(max-width: 760px) 100vw, 65vw' })}<div class="region-shade"></div><span class="atlas-index" aria-hidden="true">0${index + 1} <i>/ 04</i></span><button type="button" class="photo-expand" data-open-gallery="${region.image}" aria-label="${t.galleryLabel}">⤢</button><div class="region-detail"><p class="eyebrow">${t.regionExplore}</p><h3>${region[language].title}</h3><p>${region[language].text}</p><div class="region-links">${region.places.map((id) => `<a href="${pageHref(root, language, id)}">${destinations.find((place) => place.id === id)[language].name} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>`;
}

export function regionMarkup(language, root = './') {
  const t = translations[language];
  return `<section id="kraj" class="section regional-overview"><div class="section-heading"><div><p class="eyebrow">${t.regionEyebrow}</p><h2>${t.regionTitle}</h2></div><p class="region-description">${t.regionDescription}</p></div><div class="region-atlas"><div id="region-stage" class="region-stage" aria-live="polite">${regionStageMarkup(language, root)}</div><div class="region-grid" role="group" aria-label="${t.regionSelect}">${regions.map((region, index) => `<article class="region-card ${index === 0 ? 'active' : ''}"><div class="region-image">${photo(region.image, '', { root, sizes: '100px' })}</div><div class="region-card-copy"><h3><button type="button" data-region="${index}" aria-pressed="${index === 0}" aria-controls="region-stage"><small>0${index + 1}</small>${region[language].title}<span aria-hidden="true">↗</span></button><span class="region-static-title">${region[language].title}</span></h3><p>${region[language].text}</p><div class="region-links">${region.places.map((id) => `<a href="${pageHref(root, language, id)}">${destinations.find((place) => place.id === id)[language].name} <span aria-hidden="true">↗</span></a>`).join('')}</div></div></article>`).join('')}</div></div></section>`;
}

export function guideMarkup(place, language, root, credit) {
  const text = place[language];
  const t = translations[language];
  const related = place.kind === 'business' ? place.nearby.map((id) => destinations.find((item) => item.id === id)).filter(Boolean).slice(0, 3) : destinations.filter((item) => item.id !== place.id)
    .sort((a, b) => Number(b.area === place.area) - Number(a.area === place.area) || Number(b.categories.some((category) => place.categories.includes(category))) - Number(a.categories.some((category) => place.categories.includes(category))))
    .slice(0, 3);
  return `<main id="main" class="guide-main">
    <nav class="breadcrumbs" aria-label="${t.breadcrumbs}"><a href="${homeHref(root, language)}">${t.home}</a><span aria-hidden="true">/</span><a href="${homeHref(root, language)}#mjesta">${t.navPlaces}</a><span aria-hidden="true">/</span><span aria-current="page">${text.name}</span></nav>
    <div class="guide-visual"><section class="guide-heading section"><div><p class="eyebrow">${text.category}</p><h1>${text.name}</h1><p class="guide-tagline">${text.tagline}</p></div><div class="guide-heading-actions">${savePlaceButton(place, language)}<a class="text-link" href="${mapUrl(place.map)}" target="_blank" rel="noopener noreferrer">${t.map} ↗</a><button type="button" class="guide-gallery-button" data-open-gallery="${place.image}"><span aria-hidden="true">⤢</span> ${t.enterLandscape}</button></div></section>
    <figure class="guide-cover">${photo(place.image, text.alt, { root, className: 'guide-cover-image', eager: true })}<figcaption><span>${place.photoContext?.[language] || text.name}</span><a href="${credit.page}" target="_blank" rel="noopener noreferrer">© ${escapeHtml(credit.artist)} · ${credit.license} ↗</a></figcaption></figure></div>
    <section class="section guide-overview"><div class="guide-article"><p class="eyebrow">${t.guideOverview}</p><h2>${place.kind === 'business' ? t.localDetailsTitle : t.guideInvitation}</h2><p class="guide-description">${text.description}</p><h3>${t.guideIdeas}</h3><ol class="guide-ideas">${text.ideas.map((idea, index) => `<li><span aria-hidden="true">0${index + 1}</span><p>${idea}</p></li>`).join('')}</ol><div class="before-you-go"><h3>${t.beforeYouGo}</h3><p>${text.practical}</p></div><p class="guide-editorial-note">${place.kind === 'business' ? t.businessNote : t.guideEditorial}</p></div><aside class="guide-sidebar" aria-label="${t.guideEssentials}"><p class="eyebrow">${t.guideEssentials}</p><dl><div><dt>${t.visitTime}</dt><dd>${text.time}</dd></div><div><dt>${t.goodFor}</dt><dd>${text.mood}</dd></div></dl><a class="button button-dark" href="${mapUrl(place.map)}" target="_blank" rel="noopener noreferrer"><span>${t.map}</span><span aria-hidden="true">↗</span></a><a class="sidebar-source" href="${place.website || place.source}" target="_blank" rel="noopener noreferrer">${place.kind === 'business' ? (place.website ? t.ownerWebsite : t.listingSource) : t.moreInformation} ↗</a>${place.phone ? `<div class="business-contact"><a href="tel:${place.phone.replace(/\s/g, '')}" class="button button-outline">${t.businessCall} · ${place.phone}</a>${place.email ? `<a href="mailto:${place.email}">${t.businessEmail} ↗</a>` : ''}</div>` : ''}<p class="source-check"><a href="${place.source}" target="_blank" rel="noopener noreferrer">${t.verifiedSource} · ${place.checked || '2026-11-11'} ↗</a></p><p class="small-note">${t.guideSourceNote}</p></aside></section>
    ${place.kind !== 'business' ? nearbyBusinessesMarkup(place, language, root) : ''}
    <section class="section guide-related"><div class="section-heading"><div><p class="eyebrow">${t.relatedEyebrow}</p><h2>${t.relatedTitle}</h2></div><a class="text-link" href="${homeHref(root, language)}#mjesta">${t.allPlaces} ↗</a></div><div class="place-grid">${related.map((item) => destinationCard(item, language, { root, quickLook: false })).join('')}</div></section>
    <section class="trip-banner section"><div><p class="eyebrow">${t.bannerEyebrow}</p><h2>${t.bannerTitle}</h2><p>${t.bannerDescription}</p></div><button type="button" class="button button-light" data-open-plan><span>${t.openTrip}</span><span aria-hidden="true">↗</span></button></section>
  </main>`;
}
