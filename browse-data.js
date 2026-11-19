import { destinations } from './content.js';

export const browseText = {
  hr: {
    area: 'Odaberi područje', allAreas: 'Cijeli kraj', view: 'Način prikaza', cards: 'Fotografije', list: 'Kompaktno', compare: 'Usporedi', compareHint: 'Dodirni ↔ uz do tri mjesta i usporedi ih.', selected: 'odabrano', compareTitle: 'Koji je tvoj <em>sljedeći pravac?</em>', compareEyebrow: 'USPOREDI MJESTA, ODABERI SVOJ RITAM', compareLimit: 'Usporediti možeš najviše tri mjesta. Najprije ukloni jedno iz odabira.', removeCompare: 'Ukloni iz usporedbe', clearCompare: 'Očisti odabir', compareArea: 'Kraj', compareVisit: 'Predloženi boravak', compareMood: 'Za tvoj ritam', comparePractical: 'Prije dolaska', compareSource: 'Lokalni izvor', chooseMore: 'Dodaj još jedno mjesto', compareEmpty: 'Odaberi dva ili tri mjesta pomoću simbola ↔ na karticama.', compareScroll: 'Pomakni tablicu ustranu da vidiš sva mjesta.', openGuide: 'Otvori vodič', photoAreas: 'Fotografije po krajevima', allPhotos: 'Sve fotografije', sharePhoto: 'Podijeli kadar', copied: 'Poveznica na fotografiju je kopirana.', copyLink: 'Kopiraj ovu poveznicu', collection: 'Zbirka', photoSaved: 'Dodaj mjesto u izlet', reset: 'Poništi filtre', shown: 'prikazano',
  },
  en: {
    area: 'Choose an area', allAreas: 'Whole region', view: 'Display style', cards: 'Photo cards', list: 'Compact list', compare: 'Compare', compareHint: 'Tap ↔ on up to three places to compare them.', selected: 'selected', compareTitle: 'Which way <em>will you go?</em>', compareEyebrow: 'COMPARE PLACES, FIND YOUR OWN PACE', compareLimit: 'You can compare up to three places. Remove one from your selection first.', removeCompare: 'Remove from comparison', clearCompare: 'Clear selection', compareArea: 'Area', compareVisit: 'Suggested visit', compareMood: 'Your kind of day', comparePractical: 'Before you visit', compareSource: 'Local source', chooseMore: 'Choose another place', compareEmpty: 'Choose two or three places using ↔ on the cards.', compareScroll: 'Scroll sideways to see every place.', openGuide: 'Open the guide', photoAreas: 'Photographs by area', allPhotos: 'All photographs', sharePhoto: 'Share this view', copied: 'The photograph link has been copied.', copyLink: 'Copy this link', collection: 'Collection', photoSaved: 'Save the place to your trip', reset: 'Clear filters', shown: 'shown',
  },
};

export function validComparison(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id) => destinations.some((place) => place.id === id)))].slice(0, 3);
}

export function photographArea(photo) {
  return destinations.find((place) => place.id === photo.id)?.area;
}

export function photoShareUrl(root, language, image, area = 'all') {
  const url = new URL(language === 'en' ? 'en/' : './', root);
  url.searchParams.set('photo', image);
  if (['town', 'field', 'busko', 'sujica', 'blidinje'].includes(area)) url.searchParams.set('view', area);
  return url.href;
}
