import { destinations, landscapeScenes, translations, galleryPhotos } from './content.js';
import { regionStageMarkup, photo, savePlaceButton } from './render.js';
import { pageHref } from './routes.js';
import { browseText, photographArea, photoShareUrl } from './browse-data.js';

export function mountImmersion({ language, root, openDialog, surprise, getSaved, notify }) {
  const t = translations[language];
  const bt = browseText[language];
  const gallery = document.querySelector('#gallery-dialog');
  const image = document.querySelector('#gallery-image');
  const hero = document.querySelector('.hero');
  let photographs = galleryPhotos;
  let collection = 'all';
  let current = 0;
  let zoomed = false;
  let creditsPromise;
  image.addEventListener('load', () => {
    if (image.naturalHeight) gallery.style.setProperty('--photo-ratio', String(image.naturalWidth / image.naturalHeight));
  });

  function rememberPhotograph() {
    if (!gallery.open) return;
    const url = new URL(location.href);
    url.searchParams.set('photo', photographs[current].image);
    if (collection === 'all') url.searchParams.delete('view'); else url.searchParams.set('view', collection);
    history.replaceState(null, '', url);
  }

  function selectCollection(area, preferred) {
    collection = ['town', 'field', 'busko', 'sujica', 'blidinje'].includes(area) ? area : 'all';
    photographs = galleryPhotos.filter((item) => collection === 'all' || photographArea(item) === collection);
    document.querySelector('#gallery-thumbnails').innerHTML = photographs.map((place) => `<button type="button" data-gallery-photo="${place.image}" aria-label="${place[language].name}" aria-pressed="false">${photo(place.image, '', { root, sizes: '110px' })}</button>`).join('');
    document.querySelectorAll('[data-gallery-area]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.galleryArea === collection)));
    const index = photographs.findIndex((item) => item.image === preferred);
    showPhotograph(index < 0 ? 0 : index);
  }

  function updateCredit() {
    const credit = document.querySelector('#gallery-credit');
    credit.textContent = t.photoCredit + ' ↗';
    credit.href = `${root}image-credits.json`;
    creditsPromise ??= fetch(`${root}image-credits.json`).then((response) => {
      if (!response.ok) throw new Error('Credits unavailable');
      return response.json();
    }).catch(() => []);
    creditsPromise.then((items) => {
      const item = items.find((entry) => entry.local === `images/${photographs[current].image}.webp`);
      if (item) { credit.textContent = `© ${item.artist} · ${item.license} ↗`; credit.href = item.page; }
    });
  }

  function setZoom(value) {
    zoomed = value;
    gallery.classList.toggle('is-zoomed', value);
    document.querySelector('#gallery-zoom').setAttribute('aria-pressed', String(value));
    image.style.transformOrigin = '50% 50%';
  }

  function showPhotograph(index) {
    current = (index + photographs.length) % photographs.length;
    const place = photographs[current];
    image.src = `${root}images/${place.image}.webp`;
    image.alt = place[language].alt;
    document.querySelector('#gallery-name').textContent = place[language].name;
    document.querySelector('#gallery-position').textContent = `${t.photoPosition} ${String(current + 1).padStart(2, '0')} / ${String(photographs.length).padStart(2, '0')}`;
    document.querySelector('#gallery-guide').href = pageHref(root, language, place.id);
    const destination = destinations.find((item) => item.id === place.id);
    document.querySelector('#gallery-save').innerHTML = destination ? savePlaceButton(destination, language, { saved: getSaved().includes(destination.id) }) : '';
    document.querySelector('#photo-share-fallback').hidden = true;
    document.querySelectorAll('[data-gallery-photo]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.galleryPhoto === place.image));
    });
    if (gallery.open) gallery.querySelector('[data-gallery-photo][aria-pressed=true]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    setZoom(false);
    updateCredit();
    rememberPhotograph();
  }

  function openGallery(name, scope = 'all') {
    const item = galleryPhotos.find((entry) => entry.image === name);
    if (!item) return;
    if (scope !== 'all' && photographArea(item) !== scope) scope = 'all';
    selectCollection(scope, name);
    openDialog('gallery-dialog');
    rememberPhotograph();
    gallery.querySelector('[data-gallery-photo][aria-pressed=true]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function setScene(name) {
    const scene = landscapeScenes.find((item) => item.image === name);
    if (!scene || !hero) return;
    const place = destinations.find((item) => item.id === scene.place);
    const background = hero.querySelector('.hero-image');
    background.src = `${root}images/${name}.webp`;
    background.srcset = `${root}images/${name}-640.webp 640w, ${root}images/${name}-960.webp 960w, ${root}images/${name}.webp 1920w`;
    background.alt = place[language].alt;
    hero.querySelector('.hero-location').dataset.place = place.id;
    hero.querySelector('.hero-location').href = pageHref(root, language, place.id);
    hero.querySelector('.hero-location strong').textContent = place[language].name;
    hero.querySelector('[data-open-gallery]').dataset.openGallery = name;
    document.querySelectorAll('[data-scene]').forEach((button) => {
      const active = button.dataset.scene === name;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('active', active);
    });
  }

  document.addEventListener('click', (event) => {
    const scene = event.target.closest('[data-scene]');
    if (scene) { setScene(scene.dataset.scene); return; }
    const opener = event.target.closest('[data-open-gallery]');
    if (opener) {
      const name = opener.dataset.openGallery;
      const item = galleryPhotos.find((entry) => entry.image === name);
      const scope = opener.closest('[data-gallery-scope]')?.dataset.galleryScope || document.body.dataset.area || (document.body.dataset.destination && item ? photographArea(item) : 'all');
      openGallery(name, scope); return;
    }
    const filter = event.target.closest('[data-gallery-area]');
    if (filter) { selectCollection(filter.dataset.galleryArea, photographs[current].image); return; }
    const journalFilter = event.target.closest('[data-journal-area]');
    if (journalFilter) {
      const area = journalFilter.dataset.journalArea;
      const journal = document.querySelector('.journal-grid');
      journal.dataset.galleryScope = area;
      journal.querySelectorAll('[data-open-gallery]').forEach((button) => {
        const item = galleryPhotos.find((entry) => entry.image === button.dataset.openGallery);
        button.hidden = area !== 'all' && photographArea(item) !== area;
      });
      document.querySelectorAll('[data-journal-area]').forEach((button) => button.setAttribute('aria-pressed', String(button === journalFilter)));
      return;
    }
    const thumbnail = event.target.closest('[data-gallery-photo]');
    if (thumbnail) { showPhotograph(photographs.findIndex((place) => place.image === thumbnail.dataset.galleryPhoto)); return; }
    const step = event.target.closest('[data-gallery-step]');
    if (step) { showPhotograph(current + Number(step.dataset.galleryStep)); return; }
    const region = event.target.closest('[data-region]');
    if (region) {
      document.querySelector('#region-stage').innerHTML = regionStageMarkup(language, root, Number(region.dataset.region));
      document.querySelectorAll('[data-region]').forEach((button) => {
        const active = button === region;
        button.setAttribute('aria-pressed', String(active));
        button.closest('.region-card').classList.toggle('active', active);
      });
      return;
    }
    if (event.target.closest('#gallery-zoom')) setZoom(!zoomed);
    if (event.target.closest('#surprise-place')) surprise();
  });

  gallery.addEventListener('keydown', (event) => {
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhotograph(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let pointer;
  const viewport = gallery.querySelector('.gallery-viewport');
  viewport.addEventListener('pointerdown', (event) => {
    if (event.target === image) pointer = { x: event.clientX, y: event.clientY };
  });
  viewport.addEventListener('pointerup', (event) => {
    if (!pointer) return;
    const x = event.clientX - pointer.x;
    const y = event.clientY - pointer.y;
    if (!zoomed && Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) showPhotograph(current + (x < 0 ? 1 : -1));
    pointer = null;
  });
  viewport.addEventListener('pointercancel', () => { pointer = null; });
  viewport.addEventListener('pointerleave', () => { pointer = null; });
  viewport.addEventListener('pointermove', (event) => {
    if (!zoomed || event.pointerType !== 'mouse') return;
    const rect = viewport.getBoundingClientRect();
    image.style.transformOrigin = `${(event.clientX - rect.left) / rect.width * 100}% ${(event.clientY - rect.top) / rect.height * 100}%`;
  });
  gallery.addEventListener('close', () => {
    setZoom(false); pointer = null;
    const url = new URL(location.href); url.searchParams.delete('photo'); url.searchParams.delete('view'); history.replaceState(null, '', url);
  });
  document.querySelector('#share-photo').addEventListener('click', async () => {
    const url = photoShareUrl(root, language, photographs[current].image, collection);
    try { await navigator.clipboard.writeText(url); notify(bt.copied); }
    catch {
      const fallback = document.querySelector('#photo-share-fallback');
      fallback.hidden = false;
      const input = fallback.querySelector('input'); input.value = url; input.focus(); input.select();
    }
  });

  const parameters = new URLSearchParams(location.search);
  if (parameters.has('photo') && !parameters.has('trip') && !parameters.has('place') && !document.querySelector('dialog[open]')) openGallery(parameters.get('photo'), parameters.get('view') || 'all');

  if (hero && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(hover: hover)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty('--scene-x', `${(event.clientX / rect.width - .5) * 8}px`);
      hero.style.setProperty('--scene-y', `${((event.clientY - rect.top) / rect.height - .5) * 6}px`);
    });
    hero.addEventListener('pointerleave', () => { hero.style.setProperty('--scene-x', '0px'); hero.style.setProperty('--scene-y', '0px'); });
  }
}
