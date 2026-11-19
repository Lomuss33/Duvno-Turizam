import { destinations } from './content.js';
import { localBusinesses } from './local.js';
import { atlasAreas, outings, historyChapters, discoveryText } from './discovery-data.js';
import { atlasCard, atlasSelectionMarkup, outingStageMarkup, outingOptionsMarkup, historyStageMarkup } from './discovery-render.js';

export function mountDiscovery({ language, root, getSaved, addStops }) {
  const t = discoveryText[language];
  const allPlaces = [...destinations, ...localBusinesses];
  const parameters = new URLSearchParams(location.search);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mapController;
  let area = atlasAreas.some((item) => item.id === parameters.get('area')) ? parameters.get('area') : 'town';
  let kind = 'all';
  let selectedOuting = outings.find((outing) => outing.id === parameters.get('outing'))?.id || outings[0].id;
  const filters = { area: 'all', length: 'all', interest: 'all' };
  const section = document.querySelector('#kraj');

  function selectArea(id, remember = false) {
    if (!section || !atlasAreas.some((item) => item.id === id)) return;
    area = id;
    const current = atlasAreas.find((item) => item.id === id);
    section.querySelector('#atlas-cover').innerHTML = atlasSelectionMarkup(language, root, id);
    section.querySelector('#atlas-area-name').textContent = current[language].name;
    section.querySelectorAll('[data-atlas-area]').forEach((button) => {
      const active = button.dataset.atlasArea === id;
      button.setAttribute('aria-pressed', String(active)); button.classList.toggle('active', active);
    });
    const matches = allPlaces.filter((place) => place.area === id && (kind === 'all' || (kind === 'local') === (place.kind === 'business')));
    section.querySelector('#atlas-places').innerHTML = matches.map((place) => atlasCard(place, language, root, getSaved())).join('');
    section.querySelector('#atlas-places').style.setProperty('--atlas-columns', String(Math.max(1, Math.min(6, matches.length))));
    section.querySelector('#atlas-count').textContent = String(matches.length).padStart(2, '0');
    section.querySelectorAll('[data-atlas-kind]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.atlasKind === kind)));
    mapController?.select(id);
    if (remember) {
      const url = new URL(location.href); url.searchParams.set('area', id); history.replaceState(null, '', url);
    }
  }

  if (section) {
    selectArea(area);
    section.addEventListener('click', (event) => {
      const button = event.target.closest('[data-atlas-area]');
      if (button) selectArea(button.dataset.atlasArea, true);
      const filter = event.target.closest('[data-atlas-kind]');
      if (filter) { kind = filter.dataset.atlasKind; selectArea(area); }
    });
    section.addEventListener('keydown', (event) => {
      const button = event.target.closest('g[data-atlas-area]');
      if (button && ['Enter', ' '].includes(event.key)) { event.preventDefault(); selectArea(button.dataset.atlasArea, true); }
    });
    const loadButton = section.querySelector('#load-atlas-map');
    loadButton.addEventListener('click', async () => {
      loadButton.disabled = true; loadButton.textContent = t.mapLoading;
      try {
        const { createAtlasMap } = await import('./atlas-map.js');
        section.querySelector('#atlas-map').hidden = false;
        section.querySelector('#atlas-orientation').hidden = true;
        mapController = createAtlasMap({ language, area, onSelect: (id) => selectArea(id, true) });
        section.querySelector('#atlas-map-reset').hidden = false;
        loadButton.hidden = true;
        mapController.focus();
      } catch {
        section.querySelector('#atlas-map').hidden = true;
        section.querySelector('#atlas-orientation').hidden = false;
        const status = section.querySelector('#atlas-map-status');
        status.textContent = t.mapOffline; status.classList.remove('sr-only');
        loadButton.textContent = t.mapRetry; loadButton.disabled = false;
      }
    });
    section.querySelector('#atlas-map-reset').addEventListener('click', () => mapController?.overview());
  }

  const outingsSection = document.querySelector('#izleti');
  function renderOutings(writeUrl = false) {
    if (!outingsSection) return;
    const matches = outings.filter((outing) => (filters.area === 'all' || outing.area === filters.area) && (filters.length === 'all' || outing.length === filters.length) && (filters.interest === 'all' || outing.interests.includes(filters.interest)));
    if (!matches.some((outing) => outing.id === selectedOuting)) selectedOuting = matches[0]?.id;
    const selected = matches.find((outing) => outing.id === selectedOuting);
    outingsSection.querySelector('#outing-options').innerHTML = outingOptionsMarkup(matches, language, root, selectedOuting);
    outingsSection.querySelector('#outing-count').textContent = `${matches.length} ${t.outingCount}`;
    outingsSection.querySelector('#outing-stage').innerHTML = selected ? outingStageMarkup(selected, language, root, getSaved()) : `<div class="outing-no-results"><span aria-hidden="true">↝</span><p>${t.noOuting}</p><button type="button" class="button button-outline" data-reset-outings>${t.reset} ↗</button></div>`;
    if (writeUrl) {
      const url = new URL(location.href);
      if (selected) url.searchParams.set('outing', selected.id); else url.searchParams.delete('outing');
      history.replaceState(null, '', url);
    }
  }
  if (outingsSection) {
    renderOutings();
    for (const filter of ['area', 'length', 'interest']) outingsSection.querySelector(`#outing-${filter}`).addEventListener('change', (event) => { filters[filter] = event.target.value; renderOutings(true); });
    outingsSection.addEventListener('click', (event) => {
      const button = event.target.closest('[data-outing]');
      if (button) {
        const restoreFocus = document.activeElement === button;
        selectedOuting = button.dataset.outing; renderOutings(true);
        if (restoreFocus) outingsSection.querySelector(`[data-outing="${selectedOuting}"]`)?.focus({ preventScroll: true });
      }
      if (event.target.closest('[data-reset-outings]')) {
        for (const filter of ['area', 'length', 'interest']) { filters[filter] = 'all'; outingsSection.querySelector(`#outing-${filter}`).value = 'all'; }
        renderOutings(true);
      }
    });
  }

  document.addEventListener('click', (event) => {
    const add = event.target.closest('[data-add-outing]');
    if (add) {
      const outing = outings.find((item) => item.id === add.dataset.addOuting);
      if (outing) addStops(outing.stops, t.addedOuting);
    }
    const chapterButton = event.target.closest('[data-history]');
    if (chapterButton) {
      const chapter = historyChapters.find((item) => item.id === chapterButton.dataset.history);
      if (!chapter) return;
      document.querySelector('#history-stage').innerHTML = historyStageMarkup(chapter, language, root);
      document.querySelectorAll('[data-history]').forEach((button) => {
        const active = button === chapterButton; button.setAttribute('aria-pressed', String(active)); button.querySelector('i').textContent = active ? '●' : '○';
      });
    }
    // Outing links stay shareable HTML links, with a smoother in-page selection when possible.
    const link = event.target.closest('.atlas-outing-link');
    if (link && outingsSection && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      selectedOuting = new URL(link.href).searchParams.get('outing');
      for (const filter of ['area', 'length', 'interest']) { filters[filter] = 'all'; outingsSection.querySelector(`#outing-${filter}`).value = 'all'; }
      renderOutings(true); outingsSection.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
    }
  });

  const progress = document.querySelector('#reading-progress');
  if (progress) {
    let scheduled = false;
    const update = () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`; scheduled = false;
    };
    addEventListener('scroll', () => { if (!scheduled) { requestAnimationFrame(update); scheduled = true; } }, { passive: true }); update();
  }
  const topicLinks = [...document.querySelectorAll('.topic-nav a')];
  if (topicLinks.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((items) => {
      for (const item of items) if (item.isIntersecting) topicLinks.forEach((link) => {
        const active = link.hash === `#${item.target.id}`; link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-12% 0px -60% 0px' });
    topicLinks.forEach((link) => { const target = document.querySelector(link.hash); if (target) observer.observe(target); });
  }
}
