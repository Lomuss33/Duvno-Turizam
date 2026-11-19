import { destinations, galleryPhotos } from './content.js';
import { localBusinesses } from './local.js';
import { riverChapters, riverSources, riverText } from './river-data.js';
import { photo, savePlaceButton } from './render.js';
import { pageHref, homeHref } from './routes.js';

export function riverDiagramMarkup(language, selected) {
  const t = riverText[language];
  return `<div class="river-diagram" aria-hidden="true"><svg viewBox="0 0 370 96"><path class="river-ground" d="M0 38 33 24 62 36 128 36 156 42 209 37 242 34 270 42 312 39 370 43V96H0Z"/><path class="river-surface" d="M24 24C38 34 44 23 59 34S83 22 99 34 125 25 145 36L157 40M276 42C291 33 300 46 320 42H352"/><path class="river-below" d="M157 40C167 76 250 93 276 42"/>${[[24,24],[105,34],[205,72],[328,42]].map(([x,y],index)=>`<g class="${riverChapters[index].id === selected ? 'is-current' : ''}"><circle cx="${x}" cy="${y}" r="${riverChapters[index].id === selected ? 11 : 8}"/><text x="${x}" y="${y + 3}">${index+1}</text></g>`).join('')}<text class="river-level" x="8" y="12">${t.surface}</text><text class="river-level" x="8" y="89">${t.underground}</text></svg><span>${t.diagram}</span></div>`;
}

export function riverStageMarkup(chapter, language, root = './', saved = [], frame = 0) {
  const t = riverText[language];
  const text = chapter[language];
  const index = riverChapters.indexOf(chapter);
  const image = chapter.images[frame];
  const imageAlt = galleryPhotos.find((item) => item.image === image)?.[language].alt || text.captions[frame];
  return `<div class="river-frame">${photo(image, imageAlt, {root, sizes:'(max-width: 700px) 100vw, 57vw'})}<span class="river-frame-label">${text.captions[frame]}</span><button type="button" class="river-expand" data-open-gallery="${image}" aria-label="${t.gallery}">⤢</button><button type="button" class="river-photo-toggle" data-river-photo aria-label="${t.photo}"><span aria-hidden="true">◧</span> ${frame+1}/${chapter.images.length} <span aria-hidden="true">↔</span></button>${riverDiagramMarkup(language, chapter.id)}</div><div class="river-copy"><p class="eyebrow">0${index+1} / 04 <span>—</span> ${text.detail}</p><h3>${text.title}</h3><p class="river-description">${text.text}</p><div class="river-fact"><span aria-hidden="true">≈</span><p><strong>${text.fact}</strong>${text.factText}</p></div><div class="river-place-links">${chapter.places.map(id=>{const place=destinations.find(item=>item.id===id);return `<a href="${pageHref(root,language,id)}">${place[language].name} ↗</a>`;}).join('')}</div><div class="river-local"><p class="eyebrow">${text.local}</p>${chapter.local.map(id=>{const place=localBusinesses.find(item=>item.id===id);return `<article><a href="${pageHref(root,language,id)}">${photo(place.image,'',{root,sizes:'55px'})}<span><small>${place[language].category}</small><strong>${place[language].name} ↗</strong></span></a>${savePlaceButton(place,language,{compact:true,saved:saved.includes(id)})}</article>`;}).join('')}<p class="river-local-note">${t.localNote}</p></div><div class="river-actions"><button type="button" class="button button-light" data-river-save>${t.save} <span aria-hidden="true">+</span></button><a href="${riverSources[chapter.source].url}" target="_blank" rel="noopener noreferrer">${t.source} ↗</a><div class="river-step-buttons"><button type="button" data-river-step="-1" aria-label="${t.previous}">←</button><button type="button" data-river-step="1" aria-label="${t.next}">→</button></div></div></div>`;
}

export function riverMarkup(language, root = './') {
  const t = riverText[language];
  return `<section id="vodene-price" class="section river-story"><div class="section-heading"><div><p class="eyebrow">${t.eyebrow}</p><h2>${t.title}</h2></div><p class="section-aside">${t.intro}</p></div><div class="river-tabs" role="tablist" aria-label="${t.label}">${riverChapters.map((chapter,index)=>`<button type="button" id="river-tab-${chapter.id}" role="tab" data-river-chapter="${chapter.id}" aria-selected="${index===0}" aria-controls="river-stage" tabindex="${index===0?0:-1}">${photo(chapter.images[0],'',{root,sizes:'85px'})}<span class="river-tab-number">0${index+1}</span><strong>${chapter[language].label}</strong><span class="river-tab-arrow" aria-hidden="true">${index===2?'↘':'→'}</span></button>`).join('')}</div><div id="river-stage" class="river-stage" role="tabpanel" aria-labelledby="river-tab-springs" tabindex="0">${riverStageMarkup(riverChapters[0],language,root)}</div><div class="river-story-footer"><p>${t.note}</p><button type="button" data-river-save-all>${t.saveAll} <span aria-hidden="true">+</span></button></div><noscript><div class="river-static">${riverChapters.slice(1).map(chapter=>`<details><summary>${chapter[language].label}</summary><h3>${chapter[language].title}</h3><p>${chapter[language].text}</p><div>${chapter.places.map(id=>`<a href="${pageHref(root,language,id)}">${destinations.find(place=>place.id===id)[language].name} ↗</a>`).join('')}</div></details>`).join('')}</div></noscript></section>`;
}

export function riverGuideLinkMarkup(place, language, root = './') {
  const chapter = riverChapters.find(item=>item.places.includes(place.id));
  if (!chapter) return '';
  const t=riverText[language];
  return `<a class="river-guide-link" href="${homeHref(root,language)}?river=${chapter.id}#vodene-price"><span aria-hidden="true">≈</span><span><small>${t.link}</small><strong>${t.read} ↗</strong></span></a>`;
}
