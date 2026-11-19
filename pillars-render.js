import { destinations, translations, galleryPhotos } from './content.js';
import { localBusinesses } from './local.js';
import { photo, destinationCard, businessCard, savePlaceButton } from './render.js';
import { pageHref, homeHref, pillarHref, escapeHtml } from './routes.js';
import {
  pillarHubs,
  historyEras,
  nameTimeline,
  culturalInstitutions,
  religiousSites,
  peopleProfiles,
  trackedProjects,
  newsDigest,
  pillarsText,
} from './pillars-data.js';

const entries = [...destinations, ...localBusinesses];
const findEntry = (id) => entries.find((item) => item.id === id);
const findGallery = (image) => galleryPhotos.find((item) => item.image === image);

export function pillarNavigationMarkup(currentId = 'tourism', language = 'hr', root = './') {
  const t = pillarsText[language];
  return `<nav class="pillar-navigation" aria-label="${t.sixPages}">${pillarHubs.map((hub, index) => `<a href="${pillarHref(root, language, hub.id)}" ${hub.id === currentId ? 'aria-current="page"' : ''}><span>0${index + 1}</span><strong>${hub[language].nav}</strong><i aria-hidden="true">\u2197</i></a>`).join('')}</nav>`;
}

export function portalOverviewMarkup(language = 'hr', root = './') {
  const t = pillarsText[language];
  return `<section id="portal" class="section portal-overview"><div class="section-heading"><div><p class="eyebrow">${t.portalEyebrow}</p><h2>${t.portalTitle}</h2></div><p class="section-aside">${t.portalIntro}</p></div><div class="portal-grid">${pillarHubs.map((hub, index) => {
    const text = hub[language];
    const isCurrent = hub.id === 'tourism';
    return `<article class="portal-card ${isCurrent ? 'is-current' : ''}" data-pillar-card="${hub.id}"><a class="portal-card-media" href="${pillarHref(root, language, hub.id)}" tabindex="-1" aria-hidden="true">${photo(hub.image, '', { root, sizes: '(max-width: 760px) 48vw, 18vw' })}<span class="portal-index">0${index + 1}</span></a><div class="portal-card-body"><p class="eyebrow">${text.category}</p><h3><a href="${pillarHref(root, language, hub.id)}">${text.name} <span aria-hidden="true">\u2197</span></a></h3><p>${text.tagline}</p><a class="portal-card-link" href="${pillarHref(root, language, hub.id)}">${isCurrent ? t.currentPage : t.openPage} \u2197</a></div></article>`;
  }).join('')}</div></section>`;
}

function photoButton(image, language, root) {
  const item = findGallery(image);
  if (!item) return '';
  return `<button type="button" class="pillar-photo-button" data-open-gallery="${image}" aria-label="${escapeHtml(item[language].name)}">${photo(image, '', { root, sizes: '(max-width: 760px) 48vw, 25vw' })}<span>${item[language].name}</span><i aria-hidden="true">\u2922</i></button>`;
}

function historyBodyMarkup(language, root) {
  const t = pillarsText[language];
  return `
    <section id="history-eras" class="section pillar-section">
      <div class="section-heading"><div><p class="eyebrow">${pillarHubs.find((h) => h.id === 'history')[language].category}</p><h2>${t.historyTimelineTitle}</h2></div></div>
      <div class="pillar-filter-bar" role="group" aria-label="${t.sixPages}">
        <button type="button" data-pillar-filter="all" aria-pressed="true">${t.filterAll}</button>
        ${historyEras.map((era, index) => `<button type="button" data-pillar-filter="${era.id}" aria-pressed="false">0${index + 1} \u00b7 ${era.period[language].split(' \u00b7 ')[0]}</button>`).join('')}
        <span id="pillar-filter-count" role="status">${historyEras.length} ${t.itemCount}</span>
      </div>
      <div id="pillar-items-grid" class="pillar-cards-grid history-eras-grid">
        ${historyEras.map((era, index) => {
          const text = era[language];
          return `<article class="pillar-entry-card" data-pillar-item="${era.id}">
            <div class="pillar-entry-media">${photo(era.image, '', { root, sizes: '(max-width: 760px) 100vw, 32vw' })}<span>0${index + 1}</span></div>
            <div class="pillar-entry-copy">
              <p class="eyebrow">${era.period[language]}</p>
              <h3>${text.title}</h3>
              <p>${text.summary}</p>
              <p class="pillar-entry-detail">${text.detail}</p>
              <div class="pillar-entry-meta"><strong>${text.landmark}</strong></div>
              <div class="pillar-entry-links">
                ${era.places.map((id) => { const p = findEntry(id); return p ? `<a href="${pageHref(root, language, id)}">${p[language].name} \u2197</a>` : ''; }).join('')}
                <a class="pillar-source-link" href="${era.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>
    <section id="name-evolution" class="section pillar-names-section">
      <div class="section-heading"><div><p class="eyebrow">${t.historyNamesEyebrow}</p><h2>${t.historyNamesTitle}</h2></div></div>
      <ol class="name-timeline-list">
        ${nameTimeline.map((item, index) => `<li><span class="name-step">0${index + 1}</span><div><small>${item.year}</small><h3>${item.name}</h3><p>${item[language]}</p></div></li>`).join('')}
      </ol>
    </section>`;
}

function cultureBodyMarkup(language, root) {
  const t = pillarsText[language];
  const filters = [
    ['all', t.cultureFilterAll],
    ['culture', t.cultureFilterCulture],
    ['heritage', t.cultureFilterHeritage],
    ['civic', t.cultureFilterCivic],
  ];
  return `
    <section id="culture-institutions" class="section pillar-section">
      <div class="section-heading"><div><p class="eyebrow">${pillarHubs.find((h) => h.id === 'culture')[language].category}</p><h2>${t.cultureSectionTitle}</h2></div></div>
      <div class="pillar-filter-bar" role="group" aria-label="${t.cultureFilterAll}">
        ${filters.map(([key, label], index) => `<button type="button" data-pillar-filter="${key}" aria-pressed="${index === 0}">${label}</button>`).join('')}
        <span id="pillar-filter-count" role="status">${culturalInstitutions.length} ${t.itemCount}</span>
      </div>
      <div id="pillar-items-grid" class="pillar-cards-grid">
        ${culturalInstitutions.map((inst) => {
          const text = inst[language];
          const linked = findEntry(inst.placeId);
          return `<article class="pillar-entry-card" data-pillar-item="${inst.kind}">
            <div class="pillar-entry-media">${photo(inst.image, '', { root, sizes: '(max-width: 760px) 100vw, 30vw' })}</div>
            <div class="pillar-entry-copy">
              <p class="eyebrow">${text.category}</p>
              <h3>${text.name}</h3>
              <p class="pillar-role">${text.role}</p>
              <p>${text.summary}</p>
              <ul class="pillar-facts-list">${text.facts.map((f) => `<li>${f}</li>`).join('')}</ul>
              <div class="pillar-entry-links">
                ${linked ? `<a href="${pageHref(root, language, linked.id)}">${linked[language].name} \u2197</a>` : ''}
                <a class="pillar-source-link" href="${inst.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
}

function religionBodyMarkup(language, root) {
  const t = pillarsText[language];
  const filters = [
    ['all', t.religionFilterAll],
    ['catholic', t.religionFilterCatholic],
    ['islamic', t.religionFilterIslamic],
    ['orthodox', t.religionFilterOrthodox],
  ];
  return `
    <section id="sacred-sites" class="section pillar-section">
      <div class="section-heading"><div><p class="eyebrow">${pillarHubs.find((h) => h.id === 'religion')[language].category}</p><h2>${t.religionSectionTitle}</h2></div></div>
      <div class="pillar-filter-bar" role="group" aria-label="${t.religionFilterAll}">
        ${filters.map(([key, label], index) => `<button type="button" data-pillar-filter="${key}" aria-pressed="${index === 0}">${label}</button>`).join('')}
        <span id="pillar-filter-count" role="status">${religiousSites.length} ${t.itemCount}</span>
      </div>
      <div id="pillar-items-grid" class="pillar-cards-grid">
        ${religiousSites.map((site) => {
          const text = site[language];
          const linked = findEntry(site.placeId);
          return `<article class="pillar-entry-card" data-pillar-item="${site.tradition}">
            <div class="pillar-entry-media">${photo(site.image, '', { root, sizes: '(max-width: 760px) 100vw, 30vw' })}${linked ? savePlaceButton(linked, language, { compact: true }) : ''}</div>
            <div class="pillar-entry-copy">
              <p class="eyebrow">${text.traditionLabel}</p>
              <h3>${text.name}</h3>
              <p class="pillar-role">${text.period}</p>
              <p>${text.summary}</p>
              <ul class="pillar-facts-list">${text.highlights.map((h) => `<li>${h}</li>`).join('')}</ul>
              <p class="pillar-etiquette">${text.etiquette}</p>
              <div class="pillar-entry-links">
                ${linked ? `<a href="${pageHref(root, language, linked.id)}">${linked[language].name} \u2197</a>` : ''}
                <a class="pillar-source-link" href="${site.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
}

function peopleBodyMarkup(language, root) {
  const t = pillarsText[language];
  const filters = [
    ['all', t.peopleFilterAll],
    ['history', t.peopleFilterHistory],
    ['arts', t.peopleFilterArts],
    ['science', t.peopleFilterScience],
    ['sports', t.peopleFilterSports],
    ['community', t.peopleFilterCommunity],
  ];
  return `
    <section id="notable-people" class="section pillar-section">
      <div class="section-heading"><div><p class="eyebrow">${pillarHubs.find((h) => h.id === 'people')[language].category}</p><h2>${t.peopleSectionTitle}</h2></div></div>
      <div class="pillar-filter-bar" role="group" aria-label="${t.peopleFilterAll}">
        ${filters.map(([key, label], index) => `<button type="button" data-pillar-filter="${key}" aria-pressed="${index === 0}">${label}</button>`).join('')}
        <span id="pillar-filter-count" role="status">${peopleProfiles.length} ${t.itemCount}</span>
      </div>
      <div id="pillar-items-grid" class="pillar-cards-grid people-grid">
        ${peopleProfiles.map((person) => {
          const text = person[language];
          const linked = findEntry(person.placeId);
          return `<article class="pillar-entry-card" data-pillar-item="${person.field}">
            <div class="pillar-entry-media">${photo(person.image, '', { root, sizes: '(max-width: 760px) 100vw, 26vw' })}</div>
            <div class="pillar-entry-copy">
              <p class="eyebrow">${text.fieldLabel}</p>
              <h3>${text.name}</h3>
              <p class="pillar-role">${text.years} \u00b7 ${text.role}</p>
              <p>${text.summary}</p>
              <p class="pillar-entry-detail">${text.connection}</p>
              <div class="pillar-entry-links">
                ${linked ? `<a href="${pageHref(root, language, linked.id)}">${linked[language].name} \u2197</a>` : ''}
                <a class="pillar-source-link" href="${person.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
}

function projectsBodyMarkup(language, root) {
  const t = pillarsText[language];
  const statuses = [
    ['all', t.projectsStatusAll],
    ['active', t.projectsStatusActive],
    ['planned', t.projectsStatusPlanned],
    ['completed', t.projectsStatusCompleted],
  ];
  return `
    <section id="project-tracker" class="section pillar-section">
      <div class="section-heading"><div><p class="eyebrow">${pillarHubs.find((h) => h.id === 'projects')[language].category}</p><h2>${t.projectsSectionTitle}</h2></div></div>
      <div class="pillar-filter-bar" role="group" aria-label="${t.projectsFilterAll}">
        ${statuses.map(([key, label], index) => `<button type="button" data-pillar-filter="${key}" aria-pressed="${index === 0}">${label}</button>`).join('')}
        <span id="pillar-filter-count" role="status">${trackedProjects.length} ${t.projectCount}</span>
      </div>
      <div id="pillar-items-grid" class="pillar-cards-grid projects-grid">
        ${trackedProjects.map((project) => {
          const text = project[language];
          const linked = findEntry(project.placeId);
          return `<article class="pillar-entry-card project-card status-${project.status}" data-pillar-item="${project.status}">
            <div class="project-card-top">
              <span class="project-status-badge status-${project.status}">${text.statusLabel}</span>
              <span class="project-track" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="project-period">${project.period}</span>
            </div>
            <div class="pillar-entry-copy">
              <p class="eyebrow">${text.categoryLabel} \u00b7 ${text.location}</p>
              <h3>${text.title}</h3>
              <p>${text.summary}</p>
              <p class="pillar-entry-detail">${text.milestone}</p>
              <div class="pillar-entry-links">
                ${linked ? `<a href="${pageHref(root, language, linked.id)}">${linked[language].name} \u2197</a>` : ''}
                <a class="pillar-source-link" href="${project.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>
    <section id="municipal-news" class="section pillar-news-section">
      <div class="section-heading"><div><p class="eyebrow">${t.newsEyebrow}</p><h2>${t.newsTitle}</h2></div></div>
      <div class="news-digest-grid">
        ${newsDigest.map((item) => {
          const text = item[language];
          return `<article class="news-digest-card">
            <div class="news-meta"><span>${text.tag}</span><time>${item.date}</time></div>
            <h3>${text.title}</h3>
            <p>${text.text}</p>
            <a class="text-link" href="${item.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
          </article>`;
        }).join('')}
      </div>
    </section>`;
}

export function pillarPageMarkup(pillar, language = 'hr', root = './') {
  const t = pillarsText[language];
  const tr = translations[language];
  const text = pillar[language];
  const connected = pillar.places.map((id) => findEntry(id)).filter(Boolean);
  const sights = connected.filter((item) => item.kind !== 'business');
  const businesses = connected.filter((item) => item.kind === 'business');
  const photos = (pillar.photos || []).filter((img) => findGallery(img));

  const bodySection =
    pillar.id === 'history' ? historyBodyMarkup(language, root) :
    pillar.id === 'culture' ? cultureBodyMarkup(language, root) :
    pillar.id === 'religion' ? religionBodyMarkup(language, root) :
    pillar.id === 'people' ? peopleBodyMarkup(language, root) :
    projectsBodyMarkup(language, root);

  return `<main id="main" class="pillar-main pillar-${pillar.id}" data-pillar-page="${pillar.id}">
    <nav class="breadcrumbs" aria-label="${tr.breadcrumbs}">
      <a href="${homeHref(root, language)}">${tr.home}</a>
      <span aria-hidden="true">/</span>
      <a href="${homeHref(root, language)}#portal">${t.sixPages}</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">${text.name}</span>
    </nav>
    ${pillarNavigationMarkup(pillar.id, language, root)}
    <section class="area-hero pillar-hero">
      <div class="area-hero-cover">
        ${photo(pillar.image, text.alt, { root, eager: true, sizes: '(max-width: 760px) 100vw, 65vw' })}
        <div class="area-hero-shade"></div>
        <div class="area-hero-copy">
          <p class="eyebrow">${text.category}</p>
          <h1>${text.name}</h1>
          <p>${text.tagline}</p>
        </div>
      </div>
      <div class="area-hero-details">
        ${photos.slice(1, 3).map((img) => photoButton(img, language, root)).join('')}
      </div>
    </section>
    <section class="section pillar-intro">
      <div>
        <p class="eyebrow">${text.category}</p>
        <p class="area-lead">${text.lead}</p>
        <p class="small-note">${text.note}</p>
      </div>
      <div class="pillar-intro-actions">
        <button type="button" class="button button-light" data-save-pillar="${pillar.id}"><span>${t.saveSelection}</span><span aria-hidden="true">+</span></button>
        <a class="text-link" href="${pillar.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} \u2197</a>
      </div>
    </section>
    <section class="pillar-profile-strip" aria-label="${t.sixPages}">
      <div><span class="profile-kicker">${text.category}</span><strong>${pillar.id === 'projects' ? trackedProjects.length : pillar.id === 'history' ? historyEras.length : pillar.id === 'people' ? peopleProfiles.length : pillar.id === 'religion' ? religiousSites.length : culturalInstitutions.length} <small>${pillar.id === 'projects' ? t.projectCount : t.itemCount}</small></strong></div>
      <div><span class="profile-kicker">FORMAT</span><strong>${pillar.id === 'history' ? (language === 'hr' ? 'Vremenska crta' : 'Timeline') : pillar.id === 'projects' ? (language === 'hr' ? 'Statusni pregled' : 'Status board') : pillar.id === 'people' ? (language === 'hr' ? 'Profili' : 'Profiles') : (language === 'hr' ? 'Tematski atlas' : 'Editorial atlas')}</strong></div>
      <div><span class="profile-kicker">${language === 'hr' ? 'IZVOR PROVJEREN' : 'SOURCE CHECKED'}</span><strong>${pillar.checked || '2026-11-15'}</strong></div>
      <a href="${pillar.source}" target="_blank" rel="noopener noreferrer">${t.officialSource} <span aria-hidden="true">↗</span></a>
    </section>
    ${bodySection}
    <section id="pillar-places" class="section area-places-section">
      <div class="section-heading">
        <div><p class="eyebrow">${t.connectedPlaces}</p><h2>${t.connectedTitle}</h2></div>
        <a class="text-link" href="${homeHref(root, language)}#mjesta">${tr.allPlaces} \u2197</a>
      </div>
      <div class="place-grid area-place-grid">${sights.map((place) => destinationCard(place, language, { root, quickLook: false })).join('')}</div>
      ${businesses.length ? `<div class="business-grid pillar-business-grid">${businesses.map((place) => businessCard(place, language, { root })).join('')}</div>` : ''}
    </section>
    <section class="section other-areas">
      <div class="section-heading"><div><p class="eyebrow">${t.sixPages}</p><h2>${t.allPages}</h2></div></div>
      <div>${pillarHubs.filter((item) => item.id !== pillar.id).slice(0, 4).map((item) => `<a href="${pillarHref(root, language, item.id)}">${photo(item.image, '', { root, sizes: '(max-width: 760px) 45vw, 24vw' })}<span><small>${item[language].category}</small><strong>${item[language].name} \u2197</strong></span></a>`).join('')}</div>
    </section>
  </main>`;
}
