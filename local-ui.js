import { localBusinesses } from './local.js';
import { translations } from './content.js';
import { businessCard } from './render.js';
import { normalizeSearch } from './trip.js';

export function findBusinesses({ language = 'hr', category = 'all', area = 'all', search = '' } = {}) {
  const query = normalizeSearch(search);
  return localBusinesses.filter((business) =>
    (category === 'all' || business.categories.includes(category)) &&
    (area === 'all' || business.area === area) &&
    normalizeSearch(`${business.name} ${business.location} ${business[language].description} ${business[language].mood}`).includes(query));
}

export function mountLocalDirectory({ language, root, getSaved }) {
  const section = document.querySelector('#lokalno');
  if (!section) return;
  const state = { language, category: 'all', area: 'all', search: '' };
  const input = section.querySelector('#business-search');
  const select = section.querySelector('#business-area');
  function render() {
    const businesses = findBusinesses(state);
    section.querySelector('#business-grid').innerHTML = businesses.map((business) => businessCard(business, language, { root, saved: getSaved().includes(business.id) })).join('');
    section.querySelector('#business-empty').hidden = businesses.length !== 0;
    section.querySelector('#business-result-count').textContent = `${businesses.length} · ${translations[language].businessCount}`;
    section.querySelectorAll('[data-business-filter]').forEach((button) => {
      const active = button.dataset.businessFilter === state.category;
      button.setAttribute('aria-pressed', String(active)); button.classList.toggle('active', active);
    });
  }
  input.addEventListener('input', () => { state.search = input.value; render(); });
  select.addEventListener('change', () => { state.area = select.value; render(); });
  section.addEventListener('click', (event) => {
    const filter = event.target.closest('[data-business-filter]');
    if (filter) { state.category = filter.dataset.businessFilter; render(); }
    if (event.target.closest('#business-reset')) {
      Object.assign(state, { category: 'all', area: 'all', search: '' });
      input.value = ''; select.value = 'all'; render(); input.focus();
    }
  });
  render();
}
