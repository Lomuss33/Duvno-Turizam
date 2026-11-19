// Each entry links to its owner, tourism organisation or named directory source.
// Images show the stated area, not an unverified photograph of the business.
const directory = 'https://nodik.dev/places/ba/tomislavgrad/';
const labels = {
  eat: ['RESTORAN', 'FOOD'], drink: ['KAVA I DRUŽENJE', 'COFFEE'], stay: ['SMJEŠTAJ', 'STAY'], made: ['LOKALNI PROIZVODI', 'LOCAL PRODUCE'], active: ['DOŽIVLJAJI', 'EXPERIENCES'],
};

function business(id, name, categories, area, location, image, source, website, summaries, nearby) {
  const content = (lang, index) => ({
    name, category: labels[categories[0]][index], tagline: summaries[index],
    alt: lang === 'hr' ? `Krajolik područja ${location}, nije fotografija objekta` : `Landscape of the ${location} area, not a photograph of the business`,
    time: lang === 'hr' ? 'Prema dogovoru s domaćinom' : 'Arrange with your host',
    mood: categories.map((category) => labels[category][index]).join(' · '), description: summaries[index],
    ideas: lang === 'hr' ? ['Pogledaj ponudu i kontakt na navedenom izvoru.', 'Poveži posjet s obližnjim mjestima iz vodiča.'] : ['Check the listed source for services and contact details.', 'Combine your visit with nearby places in the guide.'],
    practical: lang === 'hr' ? 'Radno vrijeme, rezervacije i dostupnost potvrdi izravno. Fotografija prikazuje navedeno područje, a ne izgled objekta.' : 'Confirm opening hours, reservations and availability directly. The photograph shows the stated area, not the property itself.',
  });
  return { id, kind: 'business', name, categories, area, location, image, source, website, map: `${name} ${location}`, nearby, checked: '2026-11-11',
    photoContext: { hr: `${location} · fotografija područja`, en: `${location} · area photograph` }, hr: content('hr', 0), en: content('en', 1) };
}

export const localBusinesses = [
  business('knebu', 'Knebu Winery', ['made', 'active'], 'town', 'Tomislavgrad', 'plain', 'https://www.knebuwinery.com/en', 'https://www.knebuwinery.com/en',
    ['Tomislavgradska vinarija s vinogradima na velikoj nadmorskoj visini. Dolazak i kušanje dogovori unaprijed; posjeti su uz najavu.', 'A Tomislavgrad winery with high-altitude vineyards. Arrange a visit and tasting beforehand; visits are by appointment.'], ['grad', 'polje', 'muzej']),
  business('opg-ljubicic', 'OPG Ljubičić', ['made'], 'town', 'Tomislavgrad', 'plain', 'https://bosnia-and-herzegovina.worldplaces.me/view-place/70181546-opg-ljubicic.html', null,
    ['Lokalni proizvođač meda i proizvoda od meda, naveden na adresi Kralja Tvrtka bb. Za izbor proizvoda i preuzimanje raspitaj se izravno.', 'A local producer of honey and honey-based products, listed at Kralja Tvrtka bb. Ask directly about products and collection.'], ['grad', 'polje']),
  business('zrno', 'Pekarna TG Zrno', ['eat'], 'town', 'Tomislavgrad', 'townhall', 'https://kupci.com/ba/recenzije/pekarna-tg-zrno', 'https://www.facebook.com/p/Pekara-Tg-Zrno-100079312488105/',
    ['Pekarska adresa u Ulici kralja Zvonimira 19. Pronađi nešto za doručak ili pitaj što je dostupno za ponijeti na izlet.', 'A bakery at Kralja Zvonimira 19. Find something for breakfast or ask what is available to take on your outing.'], ['grad', 'bazilika', 'muzej']),
  business('eco-grabovica', 'Eco-selo Grabovica', ['eat', 'stay', 'active'], 'busko', 'Grabovica', 'lake', 'https://ecoselograbovica.com/o-nama/', 'https://ecoselograbovica.com/',
    ['Restoran i smještaj u Grabovici uz buški krajolik, s konjičkim i drugim izletničkim sadržajima u ponudi domaćina.', 'A restaurant and accommodation in Grabovica, with horse-riding and other outings offered by the hosts in the Buško area.'], ['busko', 'karmel', 'samograd']),
  business('lovre', 'Restoran Lovre', ['eat'], 'field', 'Bukovica', 'bukovica', 'https://lovre-tg.com/restoran.html', 'https://lovre-tg.com/restoran.html',
    ['Bukovička adresa za domaće specijalitete, roštilj i jela ispod peke. Ponudu za svoj dolazak provjeri s restoranom.', 'A Bukovica restaurant offering local specialities, grilled dishes and food cooked under the bell. Confirm the menu for your visit.'], ['polje', 'tusnica']),
  business('renome', 'Renome Cake & Resto', ['eat', 'drink'], 'town', 'Tomislavgrad', 'townhall', 'https://www.waze.com/live-map/directions/ba/federacija-bosne-i-hercegovine/tomislavgrad/renome-cake-and-resto?to=place.ChIJkw7UVteAX0cRgax_rl0oRo0', 'https://www.facebook.com/renomeTG',
    ['Restoran i slastičarska stanka u Ulici Mijata Tomića. Ideja za pauzu između gradskih znamenitosti.', 'A restaurant and cake stop on Mijata Tomića Street. An idea for a break between the town’s heritage sights.'], ['grad', 'bazilika', 'muzej']),
  business('papic', 'Motel Papić', ['stay', 'eat'], 'town', 'Tomislavgrad', 'townhall', 'https://papic.ba/', 'https://papic.ba/',
    ['Smještaj i restoran na tomislavgradskoj obilaznici. Izravno provjeri sobe, obroke i uvjete dolaska.', 'Accommodation and a restaurant on Tomislavgrad’s bypass. Check rooms, meals and arrival arrangements directly.'], ['grad', 'polje']),
  business('bakovic', 'Restoran Baković', ['eat'], 'town', 'Tomislavgrad', 'townhall', 'https://hr.cybo.com/BA-biz/restoran-bakovi%C4%87', null,
    ['Restoran na adresi Kralja Tvrtka 4. Uvrsti ga među mogućnosti za ručak tijekom boravka u gradu.', 'A restaurant at Kralja Tvrtka 4. Include it among your lunch options while spending time in town.'], ['grad', 'muzej']),
  business('rustic', 'Hotel Tomislav · Pizzeria Rustić', ['eat', 'stay'], 'town', 'Tomislavgrad', 'townhall', 'https://kupci.com/ba/recenzije/hotel-tomislav-pizzeria-rustic', 'https://www.facebook.com/p/Hotel-Tomislav-Pizzeria-Rustic-100057700478158/',
    ['Gradska adresa za pizzeriju i smještaj. Aktualnu ponudu i dostupnost provjeri na profilu domaćina.', 'A town address for pizza and accommodation. Check the host’s page for the current offer and availability.'], ['grad', 'dzamija']),
  business('gradska-kavana', 'Gradska kavana', ['drink'], 'town', 'Tomislavgrad', 'townhall', directory, null,
    ['Kavana navedena u lokalnom imeniku. Dodaj kavu svom gradskom obilasku.', 'A café listed in the local directory. Add a coffee stop to your town walk.'], ['grad', 'bazilika']),
  business('orijent', 'Aščinica Orijent', ['eat'], 'town', 'Tomislavgrad', 'townhall', directory, null,
    ['Aščinica navedena u gradskom gastroimeniku. Provjeri izravno što je u aktualnoj ponudi.', 'An aščinica listed in the town’s food directory. Ask directly about the current selection.'], ['grad', 'dzamija']),
  business('duvanjska-kuca', 'Duvanjska kuća', ['made'], 'town', 'Tomislavgrad', 'townhall', 'https://kic-tomislavgrad.ba/odjeli/duvanjska-kuca', 'https://kic-tomislavgrad.ba/odjeli/duvanjska-kuca',
    ['Prostor lokalnih proizvođača, obrtnika i kreativaca posvećen tradiciji i domaćoj proizvodnji duvanjskoga kraja.', 'A space for local producers, craftspeople and makers, dedicated to the region’s traditions and locally made products.'], ['grad', 'muzej']),
  business('eko-vran', 'Eko-Vran', ['made'], 'field', 'Tomislavgrad', 'plain', 'https://szfbih.ba/directory-registar_zad/listing/specijalizirana-sirarska-zadruga-eko-vran-p-o-tomislavgrad/', null,
    ['Sirarska zadruga duvanjskoga kraja. Za dostupne proizvode i mjesto kupnje raspitaj se izravno kod proizvođača.', 'A cheese-making cooperative from the Duvno region. Ask the producer directly about available products and where to buy them.'], ['polje', 'tusnica']),
  business('btg', 'Motel BTG', ['stay', 'eat'], 'sujica', 'Šujica', 'sujica-valley', 'https://www.booking.com/hotel/ba/motel-btg.html', null,
    ['Smještaj s restoranom u Šujici, naveden na rezervacijskom portalu. Dostupnost i uvjete rezervacije provjeri prije puta.', 'Accommodation with a restaurant in Šujica, listed on a booking platform. Check availability and reservation terms before travelling.'], ['sujica', 'rijeka-sujica']),
  business('vrleti', 'Hajdučke Vrleti', ['eat', 'stay'], 'blidinje', 'Blidinje', 'vran-ridge', 'https://www.vrleti.com/', 'https://www.vrleti.com/',
    ['Restoran i smještaj na Blidinju, s hercegovačkom kuhinjom i pričom o Hajdučkoj Republici Mijata Tomića.', 'A restaurant and accommodation at Blidinje, with Herzegovinian cooking and the story of the Hajduk Republic of Mijat Tomić.'], ['blidinje', 'dugo-polje', 'vran']),
  business('staza', 'Restoran Staza', ['eat', 'stay'], 'blidinje', 'Blidinje', 'mountains', 'https://visit-blidinje.com/restoran-staza/', null,
    ['Restoran sa smještajnom ponudom u planinskom ambijentu Blidinja. Provjeri dostupnost sezonskih sadržaja s domaćinom.', 'A restaurant with accommodation in Blidinje’s mountain setting. Ask the host about the availability of seasonal activities.'], ['blidinje', 'masna-luka']),
  business('risovac', 'Restoran Risovac', ['eat', 'stay'], 'blidinje', 'Risovac · Blidinje', 'medieval-stones', 'https://www.restoranrisovac.com/', 'https://www.restoranrisovac.com/',
    ['Domaća hercegovačka jela i smještajna ponuda u risovačkom dijelu Blidinja. Jelovnik i rezervacije dostupni su na stranici restorana.', 'Herzegovinian dishes and accommodation in the Risovac part of Blidinje. Find menu and reservation information on the restaurant’s site.'], ['dugo-polje', 'blidinje']),
  business('visit-blidinje', 'Visit Blidinje · Visitor centar', ['active', 'made'], 'blidinje', 'Masna Luka · Blidinje', 'masna-luka', 'https://visit-blidinje.com/', 'https://visit-blidinje.com/',
    ['Informacije, organizirani doživljaji i lokalni proizvodi za istraživanje Blidinja. Usluge dogovori s posjetiteljskim centrom.', 'Visitor information, organised experiences and local products for exploring Blidinje. Arrange services with the visitor centre.'], ['masna-luka', 'jasle', 'hajducka-vrata']),
  business('dom-blidinje', 'Planinarski dom Blidinje', ['stay', 'active'], 'blidinje', 'Blidinje', 'blidinje', 'https://mandino-selo.com/wp/dodi-u-planinarski-dom-na-blidinje/', null,
    ['Planinarski dom kojim upravlja PD Orlova stina iz Tomislavgrada. Dolazak i mogućnost noćenja dogovori unaprijed s društvom.', 'A mountain lodge managed by Tomislavgrad’s Orlova stina hiking society. Arrange arrival and overnight availability with the society in advance.'], ['blidinje', 'vran']),
  business('opet17', 'Caffe & Bistro Opet 17', ['eat', 'drink'], 'town', 'Tomislavgrad', 'townhall', 'https://hr.cybo.com/BA/tomislavgrad/restorani', 'https://www.opet17.com/',
    ['Bistro na adresi Brigade kralja Tomislava 7. Uvrsti ga u gradski dan kao mogućnost za obrok ili predah; jelovnik provjeri izravno.', 'A bistro listed at Brigade kralja Tomislava 7. Consider it for a meal or break during a town day; check the menu directly.'], ['grad', 'muzej', 'bazilika']),
  business('step', 'Caffe bar STEP', ['drink'], 'town', 'Tomislavgrad', 'monastery-front', 'https://hr.cybo.com/BA-biz/caffe-bar-step', null,
    ['Kava u Ulici Mijata Tomića 217. Odvoji vrijeme za gradsku stanku između muzeja, bazilike i upoznavanja središta.', 'A coffee address at Mijata Tomića 217. Leave time for a town break between the museum, basilica and the centre.'], ['grad', 'bazilika', 'muzej']),
  business('rubin', 'Restoran Rubin', ['eat'], 'town', 'Tomislavgrad', 'townhall', 'https://hr.cybo.com/BA-biz/restoran-rubin', null,
    ['Restoran na adresi Kraljice Teute 14. Dodaj ga svom izboru za ručak u Tomislavgradu i pitaj za aktualnu ponudu prije dolaska.', 'A restaurant listed at Kraljice Teute 14. Add it to your lunch options in Tomislavgrad and ask about the current offer before visiting.'], ['grad', 'dzamija', 'muzej']),
  business('galija', 'Caffe bar · Pizzeria Galija', ['eat', 'drink'], 'town', 'Tomislavgrad', 'monastery-front', 'https://hr.cybo.com/BA/tomislavgrad/restorani', null,
    ['Pizzerija i caffe bar navedeni na adresi Mijata Tomića 185. Još jedna lokalna adresa za stanku u gradskom danu.', 'A pizzeria and café listed at Mijata Tomića 185. Another local address for a break during a day in town.'], ['grad', 'bazilika', 'muzej']),
];

const contacts = {
  opet17: { phone: '+387 63 530 500' },
  step: { phone: '+387 63 343 021', email: 'stepcaffebar@gmail.com' },
  rubin: { phone: '+387 34 354 027' },
  galija: { phone: '+387 34 352 538' },
  knebu: { phone: '+387 63 290 770', email: 'info@knebuwinery.com' },
  'opg-ljubicic': { phone: '+387 63 422 221' },
  'eco-grabovica': { phone: '+387 34 366 851', email: 'info@ecoselograbovica.com' },
  lovre: { phone: '+387 34 316 100', email: 'lovre.cujic65@gmail.com' },
  renome: { phone: '+387 34 354 010' },
  papic: { phone: '+387 34 353 630', email: 'info@papic.ba' },
  'eko-vran': { phone: '+387 63 496 713', email: 'zadrugaekovran@gmail.com' },
  risovac: { phone: '+387 39 718 580', email: 'info@restoranrisovac.com' },
  'visit-blidinje': { phone: '+387 63 428 308', email: 'info@visit-blidinje.com' },
  'dom-blidinje': { phone: '+387 63 449 118', email: 'orlovastina1999@gmail.com' },
};
for (const business of localBusinesses) Object.assign(business, contacts[business.id] || {});
for (const id of ['opet17', 'step', 'rubin', 'galija']) {
  const entry = localBusinesses.find((place) => place.id === id);
  entry.checked = '2026-11-14';
  entry.hr.time = 'Stanka tijekom gradskog dana';
  entry.en.time = 'A break during a town day';
}

const winery = localBusinesses.find((place) => place.id === 'knebu');
winery.hr.name = 'Vinarija Knebu';
winery.hr.category = 'VINO I KUŠANJE';
winery.en.category = 'WINE & TASTING';
winery.hr.ideas = ['Dogovori termin posjeta vinariji u Tomislavgradu.', 'Poveži vinsku priču s pogledom na Duvanjsko polje.'];
winery.en.ideas = ['Arrange an appointment at the Tomislavgrad winery.', 'Pair the wine story with a view across Duvanjsko Polje.'];
winery.hr.practical = 'Posjeti su isključivo uz najavu. Adresa vinarije u Tomislavgradu razlikuje se od trgovine u Zagrebu; termin i dolazak dogovori na navedenom kontaktu.';
winery.en.practical = 'Visits are by appointment only. The Tomislavgrad winery is a different address from the Zagreb shop; arrange your appointment and arrival using the listed contact.';
const honeyMaker = localBusinesses.find((place) => place.id === 'opg-ljubicic');
honeyMaker.hr.category = 'MED I PČELINJI PROIZVODI';
honeyMaker.en.category = 'HONEY & BEE PRODUCTS';
const bakery = localBusinesses.find((place) => place.id === 'zrno');
bakery.hr.category = 'PEKARNICA';
bakery.en.category = 'BAKERY';
bakery.hr.time = 'Kratka gradska stanka';
bakery.en.time = 'A short stop in town';
const cheeseMaker = localBusinesses.find((place) => place.id === 'eko-vran');
cheeseMaker.map = 'Eko Vran Tomislavgrad';
