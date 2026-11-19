export const townMap = {
  bounds: { west: 17.221, east: 17.2349, south: 43.7147, north: 43.7225 },
  checked: '2026-11-14',
  source: 'https://www.openstreetmap.org/api/0.6/map?bbox=17.221,43.711,17.239,43.723',
  license: 'https://opendatacommons.org/licenses/odbl/1-0/',
};

// Positions are mapped building/venue centres, not surveyed visitor entrances.
export const townStops = [
  {
    id: 'stone', point: [43.72186816, 17.22543516], mapSource: 'https://www.openstreetmap.org/way/167912770',
    image: 'basilica-front', detailImage: 'basilica-portal', places: ['bazilika', 'muzej'], local: ['zrno', 'renome'],
    source: 'https://tz-tomislavgrad.com/hr/istrazi/spomen-bazilika-simbol-tomislavgrada/',
    hr: { short: 'Bazilika', label: 'Kamen i zbirke', title: 'Pogledaj pročelje. <em>Otvori još jednu priču.</em>', text: 'Klesani kamen i okrugla kupola daju bazilici prepoznatljivu siluetu. U istom je kompleksu Franjevački muzej: dodaj zbirke svom arhitektonskom početku dana.', notice: 'Unutarnji obilazak i muzej uskladi s radnim vremenom i bogoslužjem.', photo: 'Bazilika i kameni portal', local: 'Pekarska ili slatka stanka' },
    en: { short: 'Basilica', label: 'Stone & collections', title: 'Look at the façade. <em>Open another story.</em>', text: 'Dressed stone and a round dome give the basilica its distinctive outline. The Franciscan museum shares the complex: add its collections to an architectural start to your day.', notice: 'Arrange interior and museum visits around opening hours and services.', photo: 'The basilica and its stone portal', local: 'A bakery or something sweet' },
  },
  {
    id: 'culture', point: [43.71926747, 17.22542768], mapSource: 'https://www.openstreetmap.org/way/168870541',
    image: 'town-walk', detailImage: 'traditional-dress', places: ['kic'], local: ['duvanjska-kuca', 'renome'],
    source: 'https://kic-tomislavgrad.ba/odjeli',
    hr: { short: 'KIC', label: 'Kultura koja živi', title: 'Izađi s izložbe. <em>Ponesi nešto lokalno.</em>', text: 'KIC na Trgu gange i hajdučke družine povezuje galeriju, kino i posjetiteljske informacije. U Duvanjskoj kući potraži rukotvorinu, med ili drugi proizvod duvanjskoga kraja.', notice: 'Aktualni program i dostupnost sadržaja potvrdi s KIC-om.', photo: 'Gradski kontekst, 2009. i tradicijska nošnja · nisu KIC ni izložba', local: 'Lokalni proizvodi i gradski predah' },
    en: { short: 'KIC', label: 'Culture in everyday life', title: 'Leave an exhibition. <em>Take something local.</em>', text: 'KIC at Trg gange i hajdučke družine brings together a gallery, cinema and visitor information. At Duvanjska kuća, ask about handmade work, honey or another product from the region.', notice: 'Confirm the current programme and availability of services with KIC.', photo: 'Town context, 2009, and traditional dress · not KIC or an exhibition', local: 'Local products and a town break' },
  },
  {
    id: 'old-centre', point: [43.71782239, 17.22515317], mapSource: 'https://www.openstreetmap.org/way/167912773',
    image: 'mosque', detailImage: 'king-tomislav', places: ['dzamija', 'grad'], local: ['renome', 'galija'],
    source: 'https://www.kons.gov.ba/Publication/Read/nacionalni-spomenici-tabela?lang=bs',
    hr: { short: 'Džamija', label: 'Slojevi središta', title: 'Isti grad. <em>Više od jednog nasljeđa.</em>', text: 'Čaršijska džamija dio je gradskoga kulturnog krajolika. Usporedi je s kamenom bazilike, pa nastavi kroz središte i pronađi vlastiti ritam između znamenitosti.', notice: 'Za pristup vjerskim prostorima poštuj domaćine i vrijeme molitve.', photo: 'Čaršijska džamija · spomenik kralju Tomislavu u drugom kadru, 2009.', local: 'Ručak ili kava u gradu' },
    en: { short: 'Mosque', label: 'Layers of the centre', title: 'One town. <em>More than one heritage.</em>', text: 'The Čaršija mosque is part of the town’s cultural landscape. Compare it with the basilica’s stone architecture, then continue through the centre and find your own pace between sights.', notice: 'Respect your hosts and prayer times when visiting religious spaces.', photo: 'Čaršija mosque · King Tomislav monument in the second frame, 2009', local: 'Lunch or coffee in town' },
  },
  {
    id: 'streets', point: [43.71680976, 17.22755129], mapSource: 'https://www.openstreetmap.org/way/167912785',
    image: 'townhall', detailImage: 'town-water', places: ['grad', 'hazna'], local: ['step', 'galija'],
    source: 'https://tz-tomislavgrad.com/hr/istrazi/pra-povijest-i-legende/austrougarska-ostavstina/',
    hr: { short: 'Središte', label: 'Pročelja i gradski život', title: 'Malo povijesti. <em>Još jedna kava.</em>', text: 'Iza pročelja grada nekadašnjega Županjca potraži priče o svakodnevnom životu. Hazna i stare česme dodaju vodeni sloj, a lokalne adrese razlog da ne žuriš dalje.', notice: 'Točka na karti označuje općinsku zgradu; izvor Hazna nije označen na ovoj karti.', photo: 'Općinska zgrada · arhivska gradska voda u drugom kadru, 2009., nije Hazna', local: 'Stanka bez promjene kraja' },
    en: { short: 'Centre', label: 'Façades & everyday life', title: 'A little history. <em>Another coffee.</em>', text: 'Look beyond the façades of the town once called Županjac for stories of everyday life. Hazna and the former fountains add a water story; local addresses give you a reason to linger.', notice: 'The map point marks the municipal building; Hazna Spring is not marked on this map.', photo: 'Municipal building · archive town water in the second frame, 2009, not Hazna', local: 'A break in the same corner of town' },
  },
];

export const townLocalPins = [
  { id: 'renome', point: [43.7186671, 17.2258571], source: 'https://www.openstreetmap.org/node/1818897591' },
  { id: 'zrno', point: [43.7196343, 17.2279046], source: 'https://www.openstreetmap.org/node/5602505679' },
  { id: 'step', point: [43.7155817, 17.2290678], source: 'https://www.openstreetmap.org/node/1818897607' },
  { id: 'galija', point: [43.7170701, 17.2279664], source: 'https://www.openstreetmap.org/node/5752469808' },
];

export function townPosition(point) {
  const b = townMap.bounds;
  return { x: (point[1] - b.west) / (b.east - b.west) * 100, y: (b.north - point[0]) / (b.north - b.south) * 100 };
}

export const townText = {
  hr: { eyebrow: 'TOMISLAVGRAD · ČETIRI GRADSKE PRIČE', title: 'Malen grad. <em>Puno slojeva.</em>', intro: 'Dodirni mjesto na karti. Poveži baštinu s galerijom, lokalnim proizvodom ili kavom.', choose: 'Odaberi gradsku priču', map: 'Orijentacijska karta središta Tomislavgrada', zoomIn: 'Povećaj kartu', zoomOut: 'Smanji kartu', reset: 'Cijelo središte', drag: 'Povećaj za pomicanje karte; strelice rade kad je karta u fokusu.', local: 'Kava i pekarnica', localMarkers: 'Lokalne adrese na karti', open: 'Otvori gradski vodič', save: 'Sačuvaj ova mjesta', saveAll: 'Sačuvaj gradski izbor', saved: 'Gradska mjesta dodana su tvom izletu.', source: 'Izvor priče', locations: 'Izvor položaja', photos: 'Otvori fotografiju', swap: 'Zamijeni fotografije', close: 'Zatvori lokalnu adresu', call: 'Nazovi', guide: 'Detalji i kontakt', areaPhoto: 'Fotografija područja, ne objekta.', note: 'Karta za orijentaciju: položaji objekata, ne provjereni ulazi ili pješačka ruta. Pristup i radno vrijeme provjeri izravno.', more: 'Sve gradske adrese', hint: 'Odaberi broj na karti ili jednu od priča.', linked: 'ISTRAŽI GRAD', linkedTitle: 'Poveži ovaj posjet s gradskim pričama' },
  en: { eyebrow: 'TOMISLAVGRAD · FOUR TOWN STORIES', title: 'A small town. <em>Many layers.</em>', intro: 'Choose a place on the map. Connect heritage with a gallery, a local product or coffee.', choose: 'Choose a town story', map: 'Orientation map of central Tomislavgrad', zoomIn: 'Zoom in', zoomOut: 'Zoom out', reset: 'Whole centre', drag: 'Zoom in to drag the map; arrow keys work when the map is focused.', local: 'Coffee & bakery', localMarkers: 'Local addresses on the map', open: 'Open the town guide', save: 'Save these places', saveAll: 'Save the town selection', saved: 'Town places have been added to your trip.', source: 'Story source', locations: 'Position source', photos: 'Open photograph', swap: 'Swap photographs', close: 'Close local address', call: 'Call', guide: 'Details & contact', areaPhoto: 'Area photograph, not the premises.', note: 'An orientation map: mapped venues, not verified entrances or a walking route. Check access and opening hours directly.', more: 'All town addresses', hint: 'Choose a number on the map or one of the stories.', linked: 'EXPLORE THE TOWN', linkedTitle: 'Connect this visit with the town stories' },
};
