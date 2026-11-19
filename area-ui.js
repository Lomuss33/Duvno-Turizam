import { localBusinesses } from './local.js';
import { outings } from './discovery-data.js';
import { outingStageMarkup } from './discovery-render.js';

export function mountAreaGuide({ language, root, getSaved }) {
  const main = document.querySelector('.area-main');
  if (!main) return;
  main.addEventListener('click', (event) => {
    const offer = event.target.closest('[data-area-offer]');
    if (offer) {
      const kind = offer.dataset.areaOffer;
      let count = 0;
      main.querySelectorAll('#area-business-grid [data-business-id]').forEach((card) => {
        const business = localBusinesses.find((item) => item.id === card.dataset.businessId);
        const visible = kind === 'all' || (kind === 'food' ? business.categories.some((category) => ['eat', 'drink'].includes(category)) : kind === 'made' ? business.categories.some((category) => ['made', 'active'].includes(category)) : business.categories.includes(kind));
        card.hidden = !visible; if (visible) count++;
      });
      main.querySelectorAll('[data-area-offer]').forEach((button) => button.setAttribute('aria-pressed', String(button === offer)));
      main.querySelector('#area-local-count').textContent = String(count);
      main.querySelector('#area-local-empty').hidden = count > 0;
    }
    const button = event.target.closest('[data-area-outing]');
    if (button) {
      const outing = outings.find((item) => item.id === button.dataset.areaOuting);
      if (!outing || outing.area !== document.body.dataset.area) return;
      main.querySelector('#area-outing-stage').innerHTML = outingStageMarkup(outing, language, root, getSaved());
      main.querySelectorAll('[data-area-outing]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      const url = new URL(location.href); url.searchParams.set('outing', outing.id); history.replaceState(null, '', url);
    }
  });
  const initial = new URL(location.href).searchParams.get('outing');
  const initialButton = [...main.querySelectorAll('[data-area-outing]')].find((button) => button.dataset.areaOuting === initial);
  if (initialButton) initialButton.click();
}
