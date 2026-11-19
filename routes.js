export const siteConfig = {
  name: 'Visit Duvno',
  url: 'https://lomuss33.github.io/Duvno-Turizam/',
};

export function pagePath(language = 'hr', placeId = null, kind = 'home') {
  const prefix = language === 'en' ? 'en/' : '';
  if (kind === 'area') return `${prefix}areas/${encodeURIComponent(placeId)}.html`;
  if (kind === 'pillar') return `${prefix}pages/${encodeURIComponent(placeId)}.html`;
  return placeId ? `${prefix}${businessIds.has(placeId) ? 'local' : 'places'}/${encodeURIComponent(placeId)}.html` : `${prefix}${kind === 'credits' ? 'credits.html' : 'index.html'}`;
}

export function areaHref(root, language, id) {
  return pageHref(root, language, id, 'area');
}

export function pillarHref(root, language, id) {
  return id === 'tourism' ? homeHref(root, language) : pageHref(root, language, id, 'pillar');
}

export function pageHref(root, language, placeId = null, kind = 'home') {
  return `${root}${pagePath(language, placeId, kind)}`;
}

export function homeHref(root, language) {
  return `${root}${language === 'en' ? 'en/' : ''}`;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
import { localBusinesses } from './local.js';
const businessIds = new Set(localBusinesses.map((business) => business.id));

