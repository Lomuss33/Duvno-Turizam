import { atlasAreas } from './discovery-data.js';

const tz = 'https://tz-tomislavgrad.com/hr/istrazi/';
const details = {
  town: {
    image: 'basilica-front', photos: ['basilica-front', 'monastery-front', 'townhall', 'basilica-east', 'basilica-portal', 'mosque', 'traditional-dress', 'town-street', 'king-tomislav', 'basilica-wide', 'town-water', 'town-walk', 'town-crossroads'],
    start: ['bazilika', 'muzej', 'kic', 'dzamija'],
    source: `${tz}kultura-danas/franjevacki-muzej-tomislavgrad/`,
    hr: { category: 'GRAD I LJUDI', tagline: 'Kamena pročelja. Žive lokalne priče.', description: 'Upoznaj Tomislavgrad kroz baziliku i muzej, čaršiju i gradske vodene priče. Između znamenitosti ostavi vremena za lokalne proizvođače, pekarsku stanku i kavu.', arrival: 'Za prvi susret odaberi gradske znamenitosti. Pristup muzejskim i sakralnim prostorima dogovori prema radu ustanova i vremenu bogoslužja.', rhythm: 'Gradska šetnja i lokalne stanke', takeaway: 'Pitaj za lokalni med, vino, sir ili rukotvorinu.', chapters: [
      { title: 'Kamen koji priča.', text: 'Bazilika, samostan i muzej dobar su početak. Čaršijska džamija dodaje još jedan sloj iste gradske šetnje.', places: ['bazilika', 'muzej', 'dzamija'] },
      { title: 'Voda staroga Županjca.', text: 'Priča o Hazni povezuje izvor, sedam nekadašnjih česmi i gradski život. Na pročeljima potraži i austrougarsku ostavštinu.', places: ['hazna', 'grad'] },
      { title: 'Ono što nastaje ovdje.', text: 'Duvanjska kuća, vinarija uz najavu i mali gradski predasi. Dodaj susret s lokalnom proizvodnjom svom kulturnom danu.', places: ['duvanjska-kuca', 'knebu', 'zrno'] },
    ] },
    en: { category: 'TOWN & PEOPLE', tagline: 'Stone façades. Living local stories.', description: 'Discover Tomislavgrad through the basilica and museum, the old centre and the town’s water stories. Between sights, make time for local makers, a bakery stop and coffee.', arrival: 'Begin with the town’s landmarks. Arrange museum and religious-space visits around institutional hours and services.', rhythm: 'A town walk with local stops', takeaway: 'Ask about local honey, wine, cheese or handmade work.', chapters: [
      { title: 'Stone with a story.', text: 'The basilica, monastery and museum make a good beginning. The Čaršija mosque adds another layer to the same town walk.', places: ['bazilika', 'muzej', 'dzamija'] },
      { title: 'Water in old Županjac.', text: 'Hazna’s story connects a spring, seven former fountains and town life. Look for Austro-Hungarian traces in the façades too.', places: ['hazna', 'grad'] },
      { title: 'What is made here.', text: 'Duvanjska kuća, a winery by appointment and small town stops. Add a local producer to your cultural day.', places: ['duvanjska-kuca', 'knebu', 'zrno'] },
    ] },
  },
  field: {
    image: 'plain', photos: ['plain', 'field-detail', 'bukovica', 'tusnica'], start: ['polje', 'lib', 'ponor-kovaci', 'seget'], source: `${tz}prirodni-fenomeni-i-vanjske-aktivnosti/planinskim-stazama/`,
    hr: { category: 'POLJE I SELA', tagline: 'Pogled ide dalje od glavne ceste.', description: 'Duvanjsko polje povezuje sela, planinske rubove i vodu koja nestaje u kršu. Upoznaj Lib, priču ponora Kovači i ideje za kratak boravak u prirodi, pa dodaj lokalni stol.', arrival: 'Sela i znamenitosti poveži unaprijed isplaniranim prijevozom. Za planinske i krške lokalitete zatraži lokalni savjet o pristupu.', rhythm: 'Sela, vidici i zasebni izleti', takeaway: 'Raspitaj se kod Eko-Vrana za sir i mjesto kupnje.', chapters: [
      { title: 'Nauči čitati polje.', text: 'Široki krajolik vodi prema delmatskoj priči i Libu. Muzej u gradu daje dobar povijesni uvod prije izlaska u kraj.', places: ['polje', 'lib', 'muzej'] },
      { title: 'Kamo odlazi voda?', text: 'Ponor Kovači i špilja Dahna pokazuju dvije strane krša. O stvarnom pristupu razgovaraj s lokalnim stručnjacima.', places: ['ponor-kovaci', 'dahna'] },
      { title: 'Predah ima svoju adresu.', text: 'Pronađi kraći izlazak u prirodu, dogovori ručak u Bukovici i raspitaj se za lokalni sir.', places: ['seget', 'lovre', 'eko-vran'] },
    ] },
    en: { category: 'COUNTRYSIDE & VILLAGES', tagline: 'The view goes beyond the main road.', description: 'Duvanjsko Polje connects villages, mountain edges and water disappearing into karst. Discover Lib, the Kovači sinkhole story and ideas for a short nature break, then add a local table.', arrival: 'Plan transport between villages and sights in advance. Ask locally about access to mountain and karst sites.', rhythm: 'Villages, views and separate outings', takeaway: 'Ask Eko-Vran about cheese and where to buy it.', chapters: [
      { title: 'Learn to read the field.', text: 'Open country leads into the Delmatae story and Lib. The town museum offers useful historical context before heading out.', places: ['polje', 'lib', 'muzej'] },
      { title: 'Where does the water go?', text: 'Kovači sinkhole and Dahna Cave reveal two aspects of karst. Discuss actual access with local experts.', places: ['ponor-kovaci', 'dahna'] },
      { title: 'A break with a local address.', text: 'Find a short nature outing, arrange lunch in Bukovica and ask about local cheese.', places: ['seget', 'lovre', 'eko-vran'] },
    ] },
  },
  busko: {
    image: 'lake', photos: ['lake', 'busko-shore', 'karmel'], start: ['busko', 'karmel', 'samograd'], source: `${tz}prirodni-fenomeni-i-vanjske-aktivnosti/busko-jezero-najvece-umjetno-jezero/`,
    hr: { category: 'JEZERO I BUŠKI KRAJ', tagline: 'Veliko nebo. Voda koja usporava dan.', description: 'Buški kraj upoznaj kroz jezerski horizont, Karmel sv. Ilije i Grabovicu. Za dodatni sloj istraži priču o Samogradu i površinskim oblicima krša.', arrival: 'Pristup obali odaberi prema lokalnim uputama. Karmel i aktivnosti kod domaćina dogovori unaprijed, zajedno s prijevozom između mjesta.', rhythm: 'Jezerski pogledi i dogovoreni posjeti', takeaway: 'Ponesi fotografiju horizonta i preporuku svog domaćina.', chapters: [
      { title: 'Voda zauzima prvi plan.', text: 'Ostavi vremena za pogled na Buško jezero i promjenu svjetla. Biraj javno dostupan, siguran položaj za zaustavljanje.', places: ['busko'] },
      { title: 'Kamen i tišina Karmela.', text: 'Karmel sv. Ilije dio je kulturne i duhovne priče kraja. Dogovoreni posjet daje jezerskom danu drukčiji ritam.', places: ['karmel'] },
      { title: 'Iznad i ispod krajolika.', text: 'Grabovica nudi lokalnu adresu, a Samograd otvara geološku priču. Za pristup krškim oblicima potraži stručni savjet.', places: ['eco-grabovica', 'samograd'] },
    ] },
    en: { category: 'LAKE & BUŠKO COUNTRY', tagline: 'A wide sky. Water that slows the day.', description: 'Discover Buško through a lake horizon, the Carmel of St Elijah and Grabovica. Add another layer with the story of Samograd and surface karst formations.', arrival: 'Choose shore access with local advice. Arrange Karmel and host activities ahead, along with transport between stops.', rhythm: 'Lake views and arranged visits', takeaway: 'Take home a horizon photograph and a host’s recommendation.', chapters: [
      { title: 'Water takes the foreground.', text: 'Leave time for Buško Lake and the changing light. Choose a safe, publicly accessible stopping point.', places: ['busko'] },
      { title: 'The stone and quiet of Karmel.', text: 'The Carmel of St Elijah belongs to the area’s cultural and spiritual story. An arranged visit changes the rhythm of a lake day.', places: ['karmel'] },
      { title: 'Above and below the landscape.', text: 'Grabovica offers a local address, while Samograd opens a geological story. Get expert advice on access to karst formations.', places: ['eco-grabovica', 'samograd'] },
    ] },
  },
  sujica: {
    image: 'galecka', photos: ['galecka', 'strzanj', 'mali-strzanj', 'galecka-detail', 'sujica-canyon', 'sujica-galecic', 'sujica-wide', 'sujica-river', 'river'], start: ['galecka-cuprija', 'strzanj', 'rijeka-sujica', 'kanjon-sujice'], source: `${tz}prirodni-fenomeni-i-vanjske-aktivnosti/sujica-najkrivudavija-rijeka-na-svijetu/`,
    hr: { category: 'RIJEKA I DOLINA', tagline: 'Kameni lukovi. Zeleni zavoji.', description: 'Šujički kraj ima više od jednog kadra: kamene lukove Galečke ćuprije, otvorenu dolinu, riječne zavoje i kanjonski krajolik. Složi mirniji izlet prema provjerenom pristupu.', arrival: 'Za riječna mjesta provjeri javni pristup i sigurno zaustavljanje. Vodič predstavlja krajolik, bez zadane šetnice ili prolaska kanjonom.', rhythm: 'Riječni pogledi i mirnije stanke', takeaway: 'Usporedi isti riječni krajolik u više različitih kadrova.', chapters: [
      { title: 'Most koji povezuje kadar.', text: 'Galečka ćuprija i rijeka kod Galečića dobar su par za upoznavanje arhitekture i vodenog krajolika.', places: ['galecka-cuprija', 'rijeka-sujica'] },
      { title: 'Dolina se mijenja.', text: 'Otvoreni dijelovi doline i kanjon pokazuju različite oblike istog riječnog sustava. Za poglede i pristup pitaj lokalno.', places: ['sujica', 'kanjon-sujice'] },
      { title: 'Ostavi mjesta za predah.', text: 'Pronađi adresu za obrok ili noćenje u Šujici i nastavi dan tempom koji odgovara tvom izletu.', places: ['btg'] },
    ] },
    en: { category: 'RIVER & VALLEY', tagline: 'Stone arches. Green river bends.', description: 'The Šujica area has more than one view: Galečka Ćuprija’s stone arches, the open valley, river bends and canyon country. Build a quieter outing around checked access.', arrival: 'Check public access and safe stopping points for river sites. The guide introduces the landscape without defining a riverside walk or canyon route.', rhythm: 'River views and unhurried stops', takeaway: 'Compare the same river landscape in several different frames.', chapters: [
      { title: 'A bridge that connects the view.', text: 'Galečka Ćuprija and the river near Galečić pair architecture with a water landscape.', places: ['galecka-cuprija', 'rijeka-sujica'] },
      { title: 'The valley changes shape.', text: 'Open valley sections and the canyon reveal different forms of the same river system. Ask locally about views and access.', places: ['sujica', 'kanjon-sujice'] },
      { title: 'Leave room for a break.', text: 'Find an address for a meal or overnight stay in Šujica and continue at the pace of your outing.', places: ['btg'] },
    ] },
  },
  blidinje: {
    image: 'mountains', photos: ['mountains', 'blidinje', 'dugo-polje', 'medieval-stones', 'masna-luka', 'jasle', 'hajducka-vrata', 'vran-ridge'], start: ['blidinje', 'dugo-polje', 'masna-luka', 'jasle'], source: 'https://visit-blidinje.com/',
    hr: { category: 'ŠIRE PODRUČJE BLIDINJA', tagline: 'Jezero, kamen i planine u istom danu.', description: 'Blidinje je zaseban izlet u širem kraju: jezero, stećci Dugo polje, Masna Luka i Jasle. Vran i Hajdučka vrata biraj kao pripremljene planinarske ciljeve.', arrival: 'Odaberi nekoliko međusobno povezanih mjesta za dan. Vrijeme na planini, cestovne uvjete i prikladnost staze provjeri prije polaska.', rhythm: 'Izlet automobilom ili pripremljen planinarski dan', takeaway: 'Lokalni savjet iz posjetiteljskog centra najbolji je početak.', chapters: [
      { title: 'Jezero i srednjovjekovni kamen.', text: 'Blidinjsko jezero i nekropola Dugo polje povezuju prirodu i UNESCO baštinu u izletu bez planinarskog uspona.', places: ['blidinje', 'dugo-polje', 'risovac'] },
      { title: 'Šuma, izvor, Masna Luka.', text: 'Posjetiteljski centar, franjevački kompleks i vrelo Jasle daju drukčiji pogled na Blidinje.', places: ['masna-luka', 'jasle', 'visit-blidinje'] },
      { title: 'Za dan koji pripada planini.', text: 'Vran i Hajdučka vrata traže zaseban plan prema stazi i spremnosti. Posjet domu dogovori unaprijed.', places: ['vran', 'hajducka-vrata', 'dom-blidinje'] },
    ] },
    en: { category: 'THE WIDER BLIDINJE AREA', tagline: 'Lake, stone and mountains in one day.', description: 'Blidinje is a separate outing in the wider region: the lake, Dugo Polje stećci, Masna Luka and Jasle. Choose Vran and Hajdučka Vrata as prepared hiking objectives.', arrival: 'Choose a few connected places for your day. Check mountain weather, road conditions and trail suitability before leaving.', rhythm: 'An outing by car or a prepared hiking day', takeaway: 'Local advice from the visitor centre makes a good start.', chapters: [
      { title: 'A lake and medieval stone.', text: 'Blidinje Lake and the Dugo Polje necropolis connect nature with UNESCO heritage without a mountain ascent.', places: ['blidinje', 'dugo-polje', 'risovac'] },
      { title: 'Forest, spring, Masna Luka.', text: 'The visitor centre, Franciscan complex and Jasle Spring offer another view of Blidinje.', places: ['masna-luka', 'jasle', 'visit-blidinje'] },
      { title: 'For a day that belongs to the mountain.', text: 'Vran and Hajdučka Vrata need a separate plan matched to the trail and your ability. Arrange lodge visits ahead.', places: ['vran', 'hajducka-vrata', 'dom-blidinje'] },
    ] },
  },
};

export const areaGuides = atlasAreas.map((area) => {
  const detail = details[area.id];
  return { ...area, ...detail, kind: 'area', checked: '2026-11-11', hr: { ...area.hr, ...detail.hr, alt: area.hr.name }, en: { ...area.en, ...detail.en, alt: area.en.name } };
});

export const areaText = {
  hr: { areaGuide: 'Vodič kroz kraj', areas: 'Pet krajeva', sights: 'Mjesta za istražiti', addresses: 'Lokalne adrese', outings: 'Ideje za dan', start: 'KRENI OD OVOGA', startTitle: 'Prvi susret <em>s krajem.</em>', chapters: 'TRI NAČINA DA UPOZNAŠ KRAJ', chapterTitle: 'Više od jednog <em>razloga za dolazak.</em>', rhythm: 'TVOJ RITAM', takeaway: 'ZA PONIJETI', before: 'PRIJE DOLASKA', details: 'Otvori vodič', localTitle: 'Podrži lokalno. <em>Ostani malo duže.</em>', allOffers: 'Sve adrese', food: 'Hrana i kava', stay: 'Smještaj', made: 'Proizvodi i doživljaji', localEmpty: 'U ovom izboru još nema adresa.', localNote: 'Fotografije poslovnih adresa prikazuju označeno područje. Ponudu i dostupnost potvrdi izravno.', outingTitle: 'Poveži mjesta. <em>Sačuvaj dobar dan.</em>', photos: 'KRAJ IZ VIŠE KUTOVA', photoTitle: 'Promijeni kadar. <em>Ostani znatiželjan.</em>', moreAreas: 'NASTAVI ISTRAŽIVATI', moreTitle: 'Još jedan kraj. <em>Još jedna priča.</em>', source: 'Lokalni izvor', photoHint: 'Fotografije možeš otvoriti u galeriji.', guideInArea: 'DIO ŠIRE PRIČE', exploreArea: 'Otvori vodič kroz kraj', photosNear: 'Još pogleda na ovaj kraj', photoContext: 'Mjesto i njegov krajolik', noPhotos: 'Za ovaj izbor trenutačno nema adresa.' },
  en: { areaGuide: 'Area guide', areas: 'Five areas', sights: 'Places to explore', addresses: 'Local addresses', outings: 'Ideas for a day', start: 'BEGIN WITH THESE', startTitle: 'A first taste <em>of the area.</em>', chapters: 'THREE WAYS TO GET TO KNOW THE AREA', chapterTitle: 'More than one <em>reason to visit.</em>', rhythm: 'YOUR PACE', takeaway: 'TO TAKE HOME', before: 'BEFORE YOU ARRIVE', details: 'Open the guide', localTitle: 'Go local. <em>Stay a little longer.</em>', allOffers: 'All addresses', food: 'Food & coffee', stay: 'Accommodation', made: 'Makers & experiences', localEmpty: 'There are no addresses in this selection yet.', localNote: 'Business photographs show the labelled area. Confirm the offer and availability directly.', outingTitle: 'Connect the places. <em>Keep a good day.</em>', photos: 'MORE THAN ONE VIEW', photoTitle: 'Change the frame. <em>Stay curious.</em>', moreAreas: 'KEEP EXPLORING', moreTitle: 'Another area. <em>Another story.</em>', source: 'Local source', photoHint: 'Open photographs in the gallery.', guideInArea: 'PART OF A BIGGER STORY', exploreArea: 'Open the area guide', photosNear: 'More views of this area', photoContext: 'The place and its landscape', noPhotos: 'There are no addresses for this selection yet.' },
};
