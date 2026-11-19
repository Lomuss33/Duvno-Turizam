import { riverChapters, riverText } from './river-data.js';
import { riverStageMarkup } from './river-render.js';

export function mountRiverStory({ language, root, getSaved, addStops }) {
  const section=document.querySelector('#vodene-price');
  if (!section) return;
  const tabs=[...section.querySelectorAll('[data-river-chapter]')];
  const stage=section.querySelector('#river-stage');
  let current=riverChapters.findIndex(chapter=>chapter.id===new URL(location.href).searchParams.get('river'));
  if (current<0) current=0;
  let frame=0;
  function render(remember=false) {
    const chapter=riverChapters[current];
    tabs.forEach((tab,index)=>{tab.setAttribute('aria-selected',String(index===current));tab.tabIndex=index===current?0:-1;});
    stage.setAttribute('aria-labelledby',`river-tab-${chapter.id}`);
    stage.innerHTML=riverStageMarkup(chapter,language,root,getSaved(),frame);
    if (remember) {const url=new URL(location.href);url.searchParams.set('river',chapter.id);history.replaceState(null,'',url);}
  }
  function select(index, focus=false) {
    current=(index+riverChapters.length)%riverChapters.length;frame=0;render(true);
    if (focus) tabs[current].focus({preventScroll:true});
  }
  section.addEventListener('click',event=>{
    const tab=event.target.closest('[data-river-chapter]');
    if(tab) {select(tabs.indexOf(tab));return;}
    const step=event.target.closest('[data-river-step]');
    if(step) {select(current+Number(step.dataset.riverStep),true);return;}
    if(event.target.closest('[data-river-photo]')) {frame=(frame+1)%riverChapters[current].images.length;render();stage.querySelector('[data-river-photo]').focus({preventScroll:true});return;}
    if(event.target.closest('[data-river-save]')) addStops(riverChapters[current].places,riverText[language].saved);
    if(event.target.closest('[data-river-save-all]')) addStops([...new Set(riverChapters.flatMap(chapter=>chapter.places))],riverText[language].saved);
  });
  section.querySelector('.river-tabs').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const index=event.key==='Home'?0:event.key==='End'?riverChapters.length-1:current+(event.key==='ArrowRight'?1:-1);
    select(index,true);
  });
  render();
}
