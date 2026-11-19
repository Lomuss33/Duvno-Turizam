import { townStops, townPosition, townText } from './town-data.js';
import { townPanelMarkup, townLocalPreviewMarkup } from './town-render.js';

export function mountTownExplorer({ language, root, getSaved, addStops }) {
  const section = document.querySelector('.town-explorer');
  if (!section) return;
  const viewport = section.querySelector('#town-map-viewport');
  const content = section.querySelector('#town-map-content');
  const panel = section.querySelector('#town-panel');
  const preview = section.querySelector('#town-local-preview');
  const initial = new URL(location.href).searchParams.get('town');
  let selected = townStops.find(stop => stop.id === initial) || townStops[0];
  let swapped = false;
  let zoom = 1, panX = 0, panY = 0, drag;

  function transform() {
    const maxX = viewport.clientWidth * (zoom - 1) / 2;
    const maxY = viewport.clientHeight * (zoom - 1) / 2;
    panX = Math.max(-maxX, Math.min(maxX, panX));
    panY = Math.max(-maxY, Math.min(maxY, panY));
    content.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
    content.style.setProperty('--town-scale', zoom);
    viewport.classList.toggle('is-zoomed', zoom > 1);
    section.querySelector('[data-town-zoom=out]').disabled = zoom === 1;
    section.querySelector('[data-town-zoom=in]').disabled = zoom === 2.5;
  }
  function centreSelection() {
    const p = townPosition(selected.point);
    panX = (.5 - p.x / 100) * viewport.clientWidth * zoom;
    panY = (.5 - p.y / 100) * viewport.clientHeight * zoom;
    transform();
  }
  function renderPanel() {
    panel.innerHTML = townPanelMarkup(selected, language, root, getSaved(), swapped);
  }
  function select(id, remember = true) {
    const stop = townStops.find(stop => stop.id === id);
    if (!stop) return;
    selected = stop; swapped = false; preview.hidden = true; preview.innerHTML = '';
    section.querySelectorAll('[data-town-stop]').forEach(button => {
      const active = button.dataset.townStop === stop.id;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-current', active);
    });
    section.querySelectorAll('[data-town-local]').forEach(button => button.classList.toggle('is-recommended', stop.local.includes(button.dataset.townLocal)));
    renderPanel();
    if (zoom > 1) centreSelection();
    if (remember) {
      const url = new URL(location.href); url.searchParams.set('town', stop.id); history.replaceState(null, '', url);
    }
  }
  function changeZoom(action) {
    zoom = action === 'reset' ? 1 : Math.max(1, Math.min(2.5, zoom + (action === 'in' ? .5 : -.5)));
    if (zoom === 1) { panX = 0; panY = 0; transform(); }
    else centreSelection();
  }
  section.addEventListener('click', event => {
    const stop = event.target.closest('[data-town-stop]');
    if (stop) { select(stop.dataset.townStop); return; }
    const zoomButton = event.target.closest('[data-town-zoom]');
    if (zoomButton) { changeZoom(zoomButton.dataset.townZoom); return; }
    const local = event.target.closest('[data-town-local]');
    if (local) { preview.innerHTML = townLocalPreviewMarkup(local.dataset.townLocal, language, root, getSaved()); preview.hidden = false; return; }
    if (event.target.closest('[data-town-close-local]')) { preview.hidden = true; return; }
    if (event.target.closest('#town-local-toggle')) {
      const toggle = section.querySelector('#town-local-toggle');
      const visible = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', String(visible));
      section.querySelector('#town-local-markers').hidden = !visible;
      if (!visible) preview.hidden = true;
      return;
    }
    if (event.target.closest('[data-town-swap]')) { swapped = !swapped; renderPanel(); panel.querySelector('[data-town-swap]').focus({ preventScroll: true }); return; }
    if (event.target.closest('[data-town-save]')) addStops(selected.places, townText[language].saved);
    if (event.target.closest('[data-town-save-all]')) addStops([...new Set(townStops.flatMap(stop => stop.places))], townText[language].saved);
  });
  viewport.addEventListener('pointerdown', event => {
    if (zoom === 1 || event.button !== 0 || event.target.closest('button,a')) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX, panY };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    panX = drag.panX + event.clientX - drag.x;
    panY = drag.panY + event.clientY - drag.y;
    transform();
  });
  function endDrag() { drag = null; viewport.classList.remove('is-dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !preview.hidden) { preview.hidden = true; return; }
    if (event.target !== viewport) return;
    if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom('in'); }
    else if (event.key === '-') { event.preventDefault(); changeZoom('out'); }
    else if (zoom > 1 && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'ArrowLeft') panX += 45;
      if (event.key === 'ArrowRight') panX -= 45;
      if (event.key === 'ArrowUp') panY += 45;
      if (event.key === 'ArrowDown') panY -= 45;
      transform();
    }
  });
  if ('ResizeObserver' in window) new ResizeObserver(transform).observe(viewport);
  select(selected.id, false); transform();
}
