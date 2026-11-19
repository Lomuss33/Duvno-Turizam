import { destinations } from './content.js';
import { validComparison, browseText } from './browse-data.js';
import { comparisonMarkup } from './browse-render.js';
import { photo } from './render.js';
import { homeHref, escapeHtml } from './routes.js';

export function mountComparison({ language, root, read, write, getSaved, openDialog, notify }) {
  let selected = validComparison(read());
  const dialog = document.querySelector('#compare-dialog');
  const t = browseText[language];
  const content = dialog.querySelector('#compare-content');
  function syncButtons() {
    document.querySelectorAll('[data-compare]').forEach((button) => {
      const active = selected.includes(button.dataset.compare);
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-compared', active);
    });
  }
  function render() {
    syncButtons();
    const header = document.querySelector('#header-compare');
    header.hidden = selected.length < 2;
    header.querySelector('small').textContent = selected.length;
    const tray = document.querySelector('#compare-tray');
    if (tray) {
      tray.querySelector('p').hidden = selected.length > 0;
      tray.querySelector('[data-open-compare]').disabled = selected.length < 2;
      tray.querySelector('#compare-count').textContent = `${selected.length}/3`;
      tray.querySelector('#compare-thumbnails').innerHTML = selected.map((id) => {
        const place = destinations.find((item) => item.id === id);
        return `<button type="button" data-compare="${id}" aria-label="${escapeHtml(`${t.removeCompare}: ${place[language].name}`)}">${photo(place.image, '', { root, sizes: '70px' })}<span>${place[language].name}</span><i aria-hidden="true">×</i></button>`;
      }).join('');
      syncButtons();
    }
    if (dialog.open) content.innerHTML = comparisonMarkup(selected, language, root, getSaved());
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-compare]');
    if (button && destinations.some((place) => place.id === button.dataset.compare)) {
      const id = button.dataset.compare;
      if (selected.includes(id)) selected = selected.filter((item) => item !== id);
      else if (selected.length < 3) selected.push(id);
      else { notify(t.compareLimit); return; }
      write(selected); render();
      if (dialog.open && !selected.length) { dialog.close(); document.querySelector('[data-open-search]')?.focus(); }
      else if (dialog.open) content.querySelector('[data-compare]')?.focus({ preventScroll: true });
    }
    if (event.target.closest('[data-open-compare]') && selected.length >= 2) {
      content.innerHTML = comparisonMarkup(selected, language, root, getSaved()); openDialog('compare-dialog');
    }
    if (event.target.closest('#compare-clear')) {
      selected = []; write(selected); render(); dialog.close(); document.querySelector('[data-open-search]')?.focus();
    }
    if (event.target.closest('#compare-more')) {
      event.preventDefault(); dialog.close();
      const target = document.querySelector('#mjesta');
      if (target) { target.scrollIntoView(); document.querySelector('#place-search').focus({ preventScroll: true }); }
      else location.assign(`${homeHref(root, language)}#mjesta`);
    }
  });
  render();
  return { syncButtons };
}
