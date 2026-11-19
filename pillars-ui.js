import { pillarHubs, pillarsText } from './pillars-data.js';

export function mountPillarPage({ language, addStops }) {
  const main = document.querySelector('[data-pillar-page]');
  if (!main) return;
  const pillarId = main.dataset.pillarPage;
  const pillar = pillarHubs.find((item) => item.id === pillarId);
  const t = pillarsText[language];

  main.addEventListener('click', (event) => {
    const filterButton = event.target.closest('[data-pillar-filter]');
    if (filterButton) {
      const selected = filterButton.dataset.pillarFilter;
      main.querySelectorAll('[data-pillar-filter]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button === filterButton));
      });
      const cards = [...main.querySelectorAll('[data-pillar-item]')];
      let visible = 0;
      for (const card of cards) {
        const show = selected === 'all' || card.dataset.pillarItem === selected;
        card.hidden = !show;
        if (show) visible += 1;
      }
      const count = main.querySelector('#pillar-filter-count');
      if (count) {
        count.textContent = `${visible} ${pillarId === 'projects' ? t.projectCount : t.itemCount}`;
      }
      return;
    }

    const saveButton = event.target.closest('[data-save-pillar]');
    if (saveButton && pillar?.places?.length) {
      addStops(pillar.places, t.savedToast);
    }
  });
}
