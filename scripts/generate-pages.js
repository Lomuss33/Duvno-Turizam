import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { destinations, translations } from '../content.js';
import { localBusinesses } from '../local.js';
import { destinationCard, itineraryMarkup, seasonMarkup, faqMarkup, guideMarkup, regionMarkup, heroScenesMarkup, businessSectionMarkup, photoJournalMarkup, heritageMarkup, heroMosaicMarkup, collectionBarMarkup } from '../render.js';
import { pagePath, pageHref, homeHref, siteConfig } from '../routes.js';
import { atlasMarkup, outingsMarkup, historyMarkup, guideConnectionsMarkup, foodMarkup } from '../discovery-render.js';
import { discoveryText, historyChapters, atlasAreas, outings, foodSource } from '../discovery-data.js';
import { searchDialogMarkup } from '../guide-search.js';
import { areaGuides } from '../area-data.js';
import { areaGuideMarkup, guideAreaLinkMarkup, placePhotoStoryMarkup } from '../area-render.js';
import { plannerShellMarkup } from '../planner-render.js';
import { browseToolbarMarkup, compareDialogMarkup, photoFilterMarkup } from '../browse-render.js';
import { browseText } from '../browse-data.js';
import { riverMarkup, riverGuideLinkMarkup } from '../river-render.js';
import { riverSources } from '../river-data.js';
import { townMarkup, townGuideLinkMarkup } from '../town-render.js';
import { townMap, townStops, townLocalPins } from '../town-data.js';
import { pillarHubs } from '../pillars-data.js';
import { pillarPageMarkup, portalOverviewMarkup } from '../pillars-render.js';

const workspace = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(resolve(workspace, 'templates/home.html'), 'utf8');
const credits = JSON.parse(await readFile(resolve(workspace, 'public/image-credits.json'), 'utf8'));
const generated = [];

function metadata(document, language, place, kind) {
  const t = translations[language];
  const title = place ? `${place[language].name} \u2014 Visit Duvno` : kind === 'credits' ? `${t.creditsTitle.replace(/<[^>]+>/g, '')} \u2014 Visit Duvno` : t.pageTitle;
  const description = place ? place[language].description : kind === 'credits' ? t.creditsDescription : t.metaDescription;
  const canonical = new URL(pagePath(language, place?.id, kind), siteConfig.url).href;
  const image = new URL(`images/${place?.image || 'mountains'}.webp`, siteConfig.url).href;
  document.title = title;
  document.querySelector('meta[name="description"]').setAttribute('content', description);
  document.querySelector('meta[property="og:title"]').setAttribute('content', title);
  document.querySelector('meta[property="og:description"]').setAttribute('content', description);
  for (const [property, content] of [['og:url', canonical], ['og:image', image], ['og:image:alt', place ? place[language].alt : t.heroAlt], ['og:locale', language === 'hr' ? 'hr_HR' : 'en_GB'], ['og:site_name', siteConfig.name]]) {
    const meta = document.createElement('meta'); meta.setAttribute('property', property); meta.content = content; document.head.append(meta);
  }
  for (const [name, content] of [['twitter:card', 'summary_large_image'], ['twitter:title', title], ['twitter:description', description], ['twitter:image', image]]) {
    const meta = document.createElement('meta'); meta.name = name; meta.content = content; document.head.append(meta);
  }
  const link = document.createElement('link'); link.rel = 'canonical'; link.href = canonical; document.head.append(link);
  for (const alternate of ['hr', 'en', 'x-default']) {
    const item = document.createElement('link'); item.rel = 'alternate'; item.setAttribute('hreflang', alternate);
    item.href = new URL(pagePath(alternate === 'en' ? 'en' : 'hr', place?.id, kind), siteConfig.url).href; document.head.append(item);
  }
  const schema = document.createElement('script'); schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': place ? (place.kind === 'business' ? 'LocalBusiness' : (kind === 'pillar' || kind === 'area') ? 'WebPage' : 'TouristDestination') : kind === 'credits' ? 'WebPage' : 'WebSite', '@id': canonical, name: place ? place[language].name : title, description, url: canonical, image, inLanguage: language },
      ...(place ? [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: t.home, item: new URL(pagePath(language), siteConfig.url).href }, { '@type': 'ListItem', position: 2, name: place[language].name, item: canonical }] }] : []),
    ],
  }).replace(/</g, '\\u003c');
  document.head.append(schema);
}

async function generate(language, place = null, kind = 'home') {
  const path = pagePath(language, place?.id, kind);
  const depth = path.split('/').length - 1;
  const root = depth ? '../'.repeat(depth) : './';
  const { document } = parseHTML(template);
  const t = translations[language];
  const dt = discoveryText[language];
  document.documentElement.lang = language;
  document.documentElement.classList.add('no-js');
  document.body.dataset.siteRoot = root;
  document.body.dataset.pageLanguage = language;
  if (place && kind !== 'area' && kind !== 'pillar') document.body.dataset.destination = place.id;
  if (kind === 'area') document.body.dataset.area = place.id;
  if (kind === 'pillar') document.body.dataset.pillar = place.id;
  if (kind !== 'home') document.body.dataset.staticPage = kind;
  document.querySelector('#navigation').innerHTML = [
    ['tourism', 'navTourism', homeHref(root, language)],
    ['history', 'navHistory', pageHref(root, language, 'history', 'pillar')],
    ['culture', 'navCulture', pageHref(root, language, 'culture', 'pillar')],
    ['religion', 'navReligion', pageHref(root, language, 'religion', 'pillar')],
    ['people', 'navPeople', pageHref(root, language, 'people', 'pillar')],
    ['projects', 'navProjects', pageHref(root, language, 'projects', 'pillar')],
  ].map(([id, key, href]) => `<a href="${href}" data-i18n="${key}" ${(kind === 'home' && !place && id === 'tourism') || (kind === 'pillar' && place?.id === id) ? 'aria-current="page"' : ''}>${t[key]}</a>`).join('');
  for (const node of document.querySelectorAll('[data-i18n]')) {
    const key = node.getAttribute('data-i18n');
    if (!(key in t)) throw new Error(`Missing translation ${language}.${key}`);
    node.innerHTML = t[key];
  }
  for (const [attribute, target] of [['data-i18n-aria', 'aria-label'], ['data-i18n-alt', 'alt'], ['data-i18n-placeholder', 'placeholder']]) {
    for (const node of document.querySelectorAll(`[${attribute}]`)) node.setAttribute(target, t[node.getAttribute(attribute)]);
  }
  for (const button of document.querySelectorAll('[data-language]')) {
    const link = document.createElement('a');
    link.dataset.language = button.dataset.language;
    link.href = pageHref(root, button.dataset.language, place?.id, kind);
    link.setAttribute('hreflang', button.dataset.language);
    if (button.dataset.language === language) link.setAttribute('aria-current', 'true');
    link.textContent = button.textContent;
    button.replaceWith(link);
  }
  // Source assets and public files stay relative to the project root at every page depth.
  for (const node of document.querySelectorAll('[src], [href], [srcset]')) {
    for (const attribute of ['src', 'href']) {
      const value = node.getAttribute(attribute);
      if (value?.startsWith('./')) node.setAttribute(attribute, `${root}${value.slice(2)}`);
    }
    const srcset = node.getAttribute('srcset');
    if (srcset) node.setAttribute('srcset', srcset.replaceAll('./images/', `${root}images/`));
  }
  for (const brand of document.querySelectorAll('.brand')) brand.setAttribute('href', homeHref(root, language));
  document.querySelector('.utility-left').insertAdjacentHTML('afterbegin', `<button type="button" class="header-search" data-open-search aria-label="${dt.searchOpen}"><span aria-hidden="true">\u2315</span><span>${dt.searchOpen}</span><kbd>Ctrl K</kbd></button>`);
  document.querySelector('body').insertAdjacentHTML('beforeend', searchDialogMarkup(language));
  document.querySelector('body').insertAdjacentHTML('beforeend', compareDialogMarkup(language, root));
  document.querySelector('.header-search').insertAdjacentHTML('afterend', `<button type="button" id="header-compare" class="header-compare" data-open-compare hidden aria-label="${browseText[language].compare}"><span aria-hidden="true">\u2194</span><small>0</small></button>`);
  document.querySelector('.gallery-header').insertAdjacentHTML('afterend', `<div id="gallery-area-controls">${photoFilterMarkup(language, 'data-gallery-area')}</div>`);
  document.querySelector('#gallery-guide').insertAdjacentHTML('afterend', `<div id="gallery-save"></div><button type="button" id="share-photo">${browseText[language].sharePhoto} \u2197</button><label id="photo-share-fallback" class="photo-share-fallback" hidden><span>${browseText[language].copyLink}</span><input type="text" readonly></label>`);
  document.querySelector('body').insertAdjacentHTML('afterbegin', '<div id="reading-progress" class="reading-progress" aria-hidden="true"></div>');
  if (kind === 'credits') {
    const list = credits.map((credit) => `<article class="credit-item"><img src="${root}${credit.local}" alt="" width="100" height="70" loading="lazy"><div><a href="${credit.page}" target="_blank" rel="noopener noreferrer">${credit.title.replace('File:', '')}</a><p>${credit.artist} \u00b7 <a href="${credit.licenseUrl}" target="_blank" rel="noopener noreferrer">${credit.license}</a></p></div></article>`).join('');
    document.querySelector('main').innerHTML = `<section class="section credits-page"><p class="eyebrow">VISIT DUVNO</p><h1>${t.creditsTitle}</h1><p>${t.creditsDescription}</p>${list}<h2>${t.contentSources}</h2><ul><li><a href="https://tz-tomislavgrad.com/" target="_blank" rel="noopener noreferrer">TZO Tomislavgrad \u2197</a></li><li><a href="${root}content-sources.json">${t.sourcesLabel} \u2197</a></li><li><a href="https://tomislavgrad.gov.ba/turizam/" target="_blank" rel="noopener noreferrer">Op\u0107ina Tomislavgrad \u2197</a></li><li><a href="https://visit-blidinje.com/" target="_blank" rel="noopener noreferrer">Visit Blidinje \u2197</a></li></ul><p class="small-note">${t.sourceNote}</p><a class="text-link" href="${homeHref(root, language)}">${t.home} \u2197</a></section>`;
  } else if (kind === 'area') {
    document.querySelector('main').outerHTML = areaGuideMarkup(place, language, root);
  } else if (kind === 'pillar') {
    document.querySelector('main').outerHTML = pillarPageMarkup(place, language, root);
  } else if (place) {
    const credit = credits.find((item) => item.local === `images/${place.image}.webp`);
    document.querySelector('main').outerHTML = guideMarkup(place, language, root, credit);
    document.querySelector('.guide-overview').insertAdjacentHTML('afterend', guideConnectionsMarkup(place, language, root));
    document.querySelector('.guide-overview').insertAdjacentHTML('afterend', placePhotoStoryMarkup(place, language, root));
    document.querySelector('.guide-sidebar').insertAdjacentHTML('beforeend', guideAreaLinkMarkup(place, language, root));
    document.querySelector('.guide-sidebar').insertAdjacentHTML('beforeend', riverGuideLinkMarkup(place, language, root));
    document.querySelector('.guide-sidebar').insertAdjacentHTML('beforeend', townGuideLinkMarkup(place, language, root));
    if (place.kind !== 'business') document.querySelector('.guide-heading-actions').insertAdjacentHTML('beforeend', `<button type="button" class="guide-compare" data-compare="${place.id}" aria-pressed="false">\u2194 ${browseText[language].compare}</button>`);
  } else {
    document.querySelector('#hero-scenes').innerHTML = heroScenesMarkup(language, root);
    document.querySelector('#hero-mosaic').innerHTML = heroMosaicMarkup(language, root);
    document.querySelector('.discovery-strip').insertAdjacentHTML('afterend', collectionBarMarkup(language, root));
    document.querySelector('#place-grid').innerHTML = destinations.map((item) => destinationCard(item, language, { root })).join('');
    document.querySelector('.explore-toolbar').insertAdjacentHTML('afterend', browseToolbarMarkup(language));
    document.querySelector('#itinerary').innerHTML = itineraryMarkup(language, 2, root);
    document.querySelector('#season-content').innerHTML = seasonMarkup(language, 'spring', root);
    document.querySelector('#faq-list').innerHTML = faqMarkup(language);
    document.querySelector('#otkrij').insertAdjacentHTML('afterend', portalOverviewMarkup(language, root) + `<nav class="topic-nav" aria-label="${t.collectionLabel}"><a href="#portal">${language === 'hr' ? '\u0160est stranica' : 'Six pages'}</a><a href="#kraj">${language === 'hr' ? 'Karta kraja' : 'Explore the area'} <span>\u2197</span></a><a href="#mjesta">${dt.searchSights}</a><a href="#lokalno">${dt.searchLocal}</a><a href="#izleti">${language === 'hr' ? 'Slo\u017ei dan' : 'Find your day'}</a><a href="#povijest">${language === 'hr' ? 'Kroz povijest' : 'Through history'}</a><a href="#galerija">${language === 'hr' ? 'U kadru' : 'In pictures'}</a></nav>` + atlasMarkup(language, root));
    document.querySelector('#mjesta').insertAdjacentHTML('afterend', businessSectionMarkup(language, root) + foodMarkup(language, root));
    document.querySelector('#okusi').insertAdjacentHTML('afterend', riverMarkup(language, root));
    document.querySelector('.topic-nav').insertAdjacentHTML('beforeend', `<a href="#vodene-price">${language === 'hr' ? 'Prati vodu' : 'Follow the water'} \u2248</a>`);
    document.querySelector('#dozivljaji').insertAdjacentHTML('afterend', townMarkup(language, root) + photoJournalMarkup(language, root));
    document.querySelector('#dozivljaji').insertAdjacentHTML('beforebegin', outingsMarkup(language, root));
    document.querySelector('#bastina').insertAdjacentHTML('afterend', historyMarkup(language, root));
    document.querySelector('.journal-grid').insertAdjacentHTML('beforebegin', photoFilterMarkup(language, 'data-journal-area'));
    const entries = [...destinations, ...localBusinesses];
    document.querySelector('#kraj').insertAdjacentHTML('beforeend', `<noscript><div class="atlas-static">${atlasAreas.map((area) => `<details><summary>${area[language].name}</summary><p>${area[language].text}</p><div>${entries.filter((item) => item.area === area.id).map((place) => `<a href="${pageHref(root, language, place.id)}">${place[language].name} \u2197</a>`).join('')}</div></details>`).join('')}</div></noscript>`);
    document.querySelector('#izleti').insertAdjacentHTML('beforeend', `<noscript><div class="outings-static">${outings.slice(1).map((outing) => `<details><summary>${outing[language].title}</summary><p>${outing[language].description}</p><ol>${outing.stops.map((id) => `<li><a href="${pageHref(root, language, id)}">${entries.find((place) => place.id === id)[language].name} \u2197</a></li>`).join('')}</ol><p>${outing[language].note}</p></details>`).join('')}</div></noscript>`);
  }
  const creditsLink = document.createElement('a');
  creditsLink.href = pageHref(root, language, null, 'credits'); creditsLink.id = 'open-credits'; creditsLink.textContent = t.creditsLink;
  document.querySelector('#open-credits').replaceWith(creditsLink);
  document.querySelector('#credits-dialog ul').insertAdjacentHTML('beforeend', `<li><a href="${root}discovery-sources.json">${language === 'hr' ? 'Izvori povijesnih pri\u010da i polo\u017eaja na karti' : 'Sources for history chapters and map positions'} \u2197</a></li>`);
  document.querySelector('#credits-dialog ul').insertAdjacentHTML('beforeend', `<li><a href="${root}town-sources.json">${language === 'hr' ? 'Gradska karta \u00b7 polo\u017eaji, OpenStreetMap i ODbL' : 'Town map \u00b7 positions, OpenStreetMap and ODbL'} \u2197</a></li>`);
  if (kind === 'credits') document.querySelector('.credits-page').insertAdjacentHTML('beforeend', `<p class="small-note"><a href="${root}town-sources.json">${language === 'hr' ? 'Gradska karta: \u00a9 OpenStreetMap suradnici \u00b7 polo\u017eaji i ODbL licenca' : 'Town map: \u00a9 OpenStreetMap contributors \u00b7 positions and ODbL licence'} \u2197</a></p>`);
  if (kind === 'credits') document.querySelector('.credits-page').insertAdjacentHTML('beforeend', `<h2>${language === 'hr' ? 'Pri\u010de iz duvanjskog kraja' : 'Stories from the Duvno region'}</h2><ul>${historyChapters.map((chapter) => `<li><a href="${chapter.source}" target="_blank" rel="noopener noreferrer">${chapter[language].title} \u2197</a></li>`).join('')}<li><a href="${foodSource}" target="_blank" rel="noopener noreferrer">${dt.foodSource} \u2197</a></li></ul><p class="small-note">${language === 'hr' ? 'Interaktivna karta koristi Leaflet i podatke OpenStreetMapa.' : 'The interactive map uses Leaflet and OpenStreetMap data.'} <a href="${root}third-party-notices.txt">Leaflet BSD-2-Clause \u2197</a> \u00b7 <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">\u00a9 OpenStreetMap contributors \u2197</a></p>`);
  document.querySelector('#trip-actions').insertAdjacentHTML('beforeend', `<button type="button" class="button button-outline" id="print-plan">${dt.printPlan} <span aria-hidden="true">\u2197</span></button>`);
  document.querySelector('#trip-items').insertAdjacentHTML('beforebegin', '<div id="trip-summary" class="trip-summary" hidden></div>');
  document.querySelector('#trip-summary').insertAdjacentHTML('beforebegin', plannerShellMarkup(language));
  document.querySelector('#trip-items').insertAdjacentHTML('afterend', '<div id="trip-suggestion" class="trip-suggestion" hidden></div>');
  const country = document.querySelector('.footer-bottom>span:last-child'); country.dataset.i18n = 'country'; country.textContent = t.country;
  metadata(document, language, place, kind);
  const output = resolve(workspace, path);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, '<!doctype html>\n' + document.documentElement.outerHTML + '\n');
  generated.push(path);
}

for (const language of ['hr', 'en']) {
  await generate(language);
  await generate(language, null, 'credits');
  for (const place of [...destinations, ...localBusinesses]) await generate(language, place);
  for (const area of areaGuides) await generate(language, area, 'area');
  for (const pillar of pillarHubs.filter((item) => item.kind === 'pillar')) await generate(language, pillar, 'pillar');
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${generated.map((path) => `<url><loc>${new URL(path, siteConfig.url).href}</loc></url>`).join('')}</urlset>\n`;
await writeFile(resolve(workspace, 'public/town-sources.json'), JSON.stringify({ ...townMap, attribution: '\u00a9 OpenStreetMap contributors', stops: townStops.map(stop => ({ id: stop.id, point: stop.point, positionSource: stop.mapSource, storySource: stop.source })), local: townLocalPins }, null, 2) + '\n');
await writeFile(resolve(workspace, 'public/sitemap.xml'), sitemap);
await writeFile(resolve(workspace, 'public/content-sources.json'), JSON.stringify([...destinations, ...localBusinesses].map((place) => ({
  id: place.id, name: place.hr.name, type: place.kind || 'destination', area: place.area,
  source: place.source, website: place.website || null, checked: place.checked || '2026-11-11',
})), null, 2) + '\n');
await writeFile(resolve(workspace, 'public/discovery-sources.json'), JSON.stringify({
  river: riverSources,
  checked: '2026-11-15',
  pillars: pillarHubs.filter((item) => item.kind === 'pillar').map((pillar) => ({ id: pillar.id, name: pillar.hr.name, source: pillar.source, path: pagePath('hr', pillar.id, 'pillar') })),
  history: historyChapters.map((chapter) => ({ id: chapter.id, title: chapter.hr.title, source: chapter.source })),
  geography: atlasAreas.map((area) => ({ id: area.id, name: area.hr.name, orientationPoint: area.point, source: area.source })),
  areaGuides: areaGuides.map((area) => ({ id: area.id, name: area.hr.name, source: area.source, path: pagePath('hr', area.id, 'area') })),
  food: { source: foodSource },
  note: 'Outings are editorial combinations. Region points are approximate orientation anchors, not entrances, trailheads or business addresses.',
}, null, 2) + '\n');
const errorPage = `<!doctype html>
<html lang="hr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="theme-color" content="#233e35"><title>404 \u2014 Visit Duvno</title><style>
*{box-sizing:border-box}body{margin:0;background:#14211c;color:#f1f0df;font-family:Arial,sans-serif;line-height:1.8}main{max-width:850px;margin:8vh auto;padding:35px 25px}.brand{font-weight:700;font-size:25px;text-decoration:none;color:inherit}.number{font-size:12px;letter-spacing:4px;margin:70px 0 25px}h1{font:500 clamp(45px,8vw,78px)/1.15 Georgia,serif;letter-spacing:-2px;margin:0 0 25px}p{max-width:560px;font-size:15px;color:#b5c1ae}section[lang=en]{border-top:1px solid #35463a;margin-top:40px;padding-top:30px}h2{font:italic 500 28px/1.3 Georgia,serif}.button{display:inline-block;background:#dbef85;color:#14211c;padding:12px 22px;text-decoration:none;font-size:13px;margin:15px 15px 0 0}a:focus-visible{outline:3px solid #a77c26;outline-offset:5px}
</style></head><body><main><a class="brand" href="${siteConfig.url}">\u25b3 visit duvno</a><p class="number">404 / VISIT DUVNO</p><h1>${translations.hr.notFoundTitle}</h1><p>${translations.hr.notFoundText}</p><a class="button" href="${siteConfig.url}">${translations.hr.home} \u2197</a><section lang="en"><h2>${translations.en.notFoundTitle}</h2><p>${translations.en.notFoundText}</p><a class="button" href="${new URL('en/', siteConfig.url).href}">${translations.en.home} \u2197</a></section></main></body></html>`;
await writeFile(resolve(workspace, 'public/404.html'), errorPage);
console.log(`Generated ${generated.length} static pages, sitemap and 404 page.`);
