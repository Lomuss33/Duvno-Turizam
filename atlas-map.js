import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { atlasAreas, discoveryText } from './discovery-data.js';

// Standard OSM raster layer. Loaded only after a visitor asks to open the map;
// native browser caching is preserved and no offline/prefetch tile feature is used.
const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export function createAtlasMap({ language, area, onSelect }) {
  const t = discoveryText[language];
  const map = L.map('atlas-map', { scrollWheelZoom: false, minZoom: 8, maxZoom: 14, zoomControl: false });
  L.control.zoom({ zoomInTitle: language === 'hr' ? 'Približi' : 'Zoom in', zoomOutTitle: language === 'hr' ? 'Udalji' : 'Zoom out' }).addTo(map);
  const tiles = L.tileLayer(tileUrl, { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors' }).addTo(map);
  const status = document.querySelector('#atlas-map-status');
  let loaded = 0;
  tiles.on('tileload', () => { loaded++; if (status.textContent === t.mapOffline) { status.textContent = ''; status.classList.add('sr-only'); } });
  tiles.on('tileerror', () => { if (!loaded) { status.textContent = t.mapOffline; status.classList.remove('sr-only'); } });
  const markers = new Map();
  atlasAreas.forEach((item, index) => {
    const marker = L.marker(item.point, { keyboard: true, title: item[language].name, alt: item[language].name, icon: L.divIcon({ className: 'atlas-map-marker', html: `<span>0${index + 1}</span><strong>${item[language].short}</strong>`, iconSize: [36, 36], iconAnchor: [18, 18] }) }).addTo(map);
    marker.on('click', () => onSelect(item.id)); markers.set(item.id, marker);
  });
  const bounds = L.latLngBounds(atlasAreas.map((item) => item.point));
  const overview = () => map.fitBounds(bounds, { padding: [45, 65], maxZoom: 10, animate: false });
  overview();
  function select(id) {
    const selected = atlasAreas.find((item) => item.id === id);
    markers.forEach((marker, key) => {
      marker.getElement()?.classList.toggle('is-active', key === id);
      marker.getElement()?.setAttribute('aria-pressed', String(key === id));
      marker.setZIndexOffset(key === id ? 1000 : 0);
    });
    if (selected && !map.getBounds().pad(-.1).contains(selected.point)) map.panTo(selected.point, { animate: false });
  }
  select(area);
  const resize = new ResizeObserver(() => map.invalidateSize({ pan: false })); resize.observe(document.querySelector('#atlas-map'));
  return { select, overview, focus: () => document.querySelector('#atlas-map .leaflet-control-zoom-in')?.focus({ preventScroll: true }) };
}
