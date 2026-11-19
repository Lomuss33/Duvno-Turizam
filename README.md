# Visit Duvno

A Croatian/English tourism guide for Duvno–Tomislavgrad. Built with HTML, CSS and JavaScript, using Vite for development and static production output. No backend, account, API key or runtime framework is required.

## Run locally

Requires Node.js 22.12+ or Node.js 24 LTS and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`. Edits reload automatically. Stop with `Ctrl+C`. Use the development server rather than opening the HTML directly, since the site uses JavaScript modules.

## Features

- Six core portal pages linked across the header, portal overview and pillar switcher:
  1. **Tourism** (`index.html` / `en/index.html`) — destinations, outings, regional map, local businesses and trip planner.
  2. **History** (`pages/history.html` / `en/pages/history.html`) — six chronological eras from Pleistocene fossils and Delminium to the 1925–2025 Jubilee, plus a seven-stage timeline of the town's names.
  3. **Culture & Politics** (`pages/culture.html` / `en/pages/culture.html`) — KIC cultural and visitor centre, Franciscan Museum Fra Jozo Križić, Vinko Zorić Gallery, Town Library, Općina Tomislavgrad and the Kotromanić/medieval assembly heritage.
  4. **Religion** (`pages/religion.html` / `en/pages/religion.html`) — multi-confessional sacred heritage across Catholic (Memorial Basilica, Carmel Sv. Ilije, Franciscan Monastery, St. John the Baptist in Roško Polje), Islamic (Džudža Džafer Mosque) and Orthodox (St. Nicholas the Wonderworker) traditions.
  5. **People of Duvno** (`pages/people.html` / `en/pages/people.html`) — eight historical and contemporary figures (King Tomislav, Mijat Tomić, Fra Mijo Čuić, Virgilije Nevjestić, Dževad Karahasan, Fra Jozo Križić, Ivica Đikić and the Duvno diaspora & mountaineers).
  6. **News & Projekttracker** (`pages/projects.html` / `en/pages/projects.html`) — six tracked municipal, heritage, infrastructure and ecological projects (2024–2026) with status filters (`Active`, `Planned`, `Completed`) and a four-item municipal news digest.
- Compact forest-green layouts with lime accents, photo overlays and landscape-led destination pages.
- Four selectable opening scenes, a regional photo explorer and a large landscape gallery with thumbnails, keyboard navigation, swipe gestures and zoom.
- Full Croatian and English copy, with a remembered language preference.
- Twenty-six destination guides, each with static Croatian and English pages, practical notes, photo credits, local addresses and related places. The newer guides include KIC's culture/visitor information centre, Stržanj Springs, Galečka Ćuprija, Šujica Canyon, Kovači Sinkhole, Hazna, Lib and Seget.
- Twenty-three local businesses and visitor services, including a winery, honey producer and bakery, with category/area/search filters, individual pages, source links and selected published contact details. Recent town additions include Opet 17, STEP, Rubin and Galija.
- A forty-one-photo journal covering landscapes, rivers, churches, tombstones, traditional dress and local architecture. Filter the journal and gallery by area, save a photograph's place directly to a trip and share a link that reopens the same photograph and collection. Archive and regional-context photographs are labelled. Forty-four licensed photographs, each in three local WebP sizes, also include illustrative food imagery.
- A four-story town explorer replaces the old generic heritage cards. Its OpenStreetMap-derived streets and building footprints load locally without third-party map requests. Select landmarks, zoom/drag or pan with the keyboard, reveal cafés and a bakery, open local previews, swap photo details and save places. Chapter URLs work across languages and connect back from relevant guides. Positions describe mapped buildings/venues, not surveyed entrances or a walking route.
- An interactive four-chapter water story connects Stržanj, the Šujica's meanders, Kovači and the Ričina/Buško landscape. Change the photograph, follow an explanatory cross-section, open related guides, save places or add a local stop. Keyboard-accessible tabs and a chapter URL work in both languages; all chapters remain readable without JavaScript. The diagram explains geography and does not define a visitor route.
- A five-area geographic explorer that brings sights and local businesses together. The interactive Leaflet/OpenStreetMap layer loads only when requested; its pins are area anchors, not entrances or trailheads.
- Five complete Croatian/English area guides with photo mosaics, three editorial themes, local offer filters, outings and nearby-area links. Individual place and business pages connect to their area and show more regional photographs.
- Nine ready-made outings with area, time and interest filters, ordered stops, local food/producer pairings, shareable selections and one-click saving.
- Six illustrated history chapters, from Cebari’s fossils and Roman Delminium to the coronation tradition and Austro-Hungarian townscape, with direct local sources.
- An illustrated introduction to local food, linked to producers and restaurants. Food photographs are labelled as illustrative.
- Cross-guide search for every pillar page, area guide, destination and business, accessible from the header or Ctrl/Cmd K, with keyboard result navigation.
- Combined area/category/search filters that accept Croatian names without diacritics, with a dense list or photo-card view. Filters survive a reload and can be shared through the page URL; the preferred display style is remembered locally.
- A persistent comparison of up to three destinations, with photographs, suggested visit lengths, area, interests, practical notes and source links. Add compared places directly to a trip.
- Direct call actions on directory cards where the listing includes a published telephone number.
- One-, two- and three-day trip suggestions with slow, active and culture preferences, seasonal inspiration and practical FAQs.
- A personal trip list with saved places, ordering, removal, text download, driving routes, local-stop suggestions, area summaries and shareable links. A print/PDF layout includes each stop’s practical notes and source. Favourites remain available across pages.
- A personal one-, two- or three-day daybook with a trip name, stop notes, day assignments and day previews. Arrange stops by area with an undo option; reorder within a day and get directions for that day. Food, stay and maker suggestions follow the selected day’s areas.
- A floating saved-trip dock and a surprise discovery button that respects the selected area, category and search.
- Native modal dialogs with keyboard focus containment and Escape support.
- Responsive local WebP photos, lazy loading and photographer/licence credits.
- Static HTML content that remains readable without JavaScript; canonical URLs, language alternatives, social metadata, structured data, a sitemap and a bilingual 404 page.

Favourites, day assignments, trip names and notes are stored only in the visitor's browser. If storage is blocked, the planner still works for the current session and offers a download. Existing favourite lists migrate into Day 1. Shared trips contain known place IDs, day assignments and order; names and personal notes stay out of the URL. Shared trips merge into existing favourites. Printing and text downloads include the visitor’s notes, practical information, published contacts and per-day directions. The planner does not create reservations.

## Build and verify

```sh
npm test
npm run build
npm run test:static
npm run preview
```

`dist/` contains the deployable static website. Each build generates 122 pages: two homepages, ten thematic pillar pages (`pages/`), 52 destination pages, 46 business/service pages, ten area guides and two photography/source pages, plus a 404 page. Relative asset URLs support both a GitHub Pages project path and a custom domain.

`npm run test:static` checks the built HTML for local links, fragments, image renditions, translations, metadata, photo licences and sitemap coverage. Run it after building.

For desktop/mobile browser and accessibility checks:

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

The browser suite starts and stops its own production preview on port 4173, mounted under `/Duvno-Turizam/` to check project hosting. It checks translations, filtering, direct guide requests, cross-page saved trips, invalid storage, sharing, downloads, layout down to 320px, images, no-JavaScript reading, photo credits and automated WCAG accessibility rules. These automated checks do not constitute a full manual accessibility audit.

## Publish to GitHub Pages

1. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Push the site to `main` or run the Pages workflow manually.
3. The workflow installs dependencies, tests trip logic, builds `dist/`, verifies static output and deploys it.

Expected URL after a successful deployment: `https://lomuss33.github.io/Duvno-Turizam/`.

## Edit content

| File | Purpose |
| --- | --- |
| `templates/home.html` | Shared page shell and homepage structure |
| `content.js` | Croatian/English text, destination guides, itineraries, seasons, FAQs |
| `landmarks.js` | Source-backed heritage, geographical and natural-place notes |
| `local-landmarks.js` | Additional town, river, karst and nearby-country guides |
| `local.js` | Business/service descriptions, areas, source links and published contact details |
| `local-ui.js` | Business directory search, category and area filters |
| `discovery-data.js` | Five area anchors, nine outings, history chapters, food notes and bilingual labels |
| `discovery-render.js` | Static atlas, outing, food, history and connected-guide markup |
| `discovery.js` | Area selection, outing filters, chapter switching and reading progress |
| `atlas-map.js` | User-requested Leaflet/OpenStreetMap layer |
| `guide-search.js` | Cross-guide search dialog and keyboard navigation |
| `browse-data.js` | Bilingual discovery labels, comparison validation and photo sharing |
| `browse-render.js` | Area/view controls, comparison tables and photo collection filters |
| `comparison.js` | Persistent three-place comparison and trip actions |
| `browse.css` | Dense list, comparison and photographic collection layouts |
| `river-data.js` | Bilingual river chapters and the geography sources |
| `river-render.js` | Photographic chapters, explanatory cross-section and related-guide links |
| `river.js` | Chapter keyboard controls, photo switching, URLs and trip saving |
| `river.css` | Compact water-story and related-guide layouts |
| `town-data.js` | Bilingual town stories and attributed map positions |
| `town-render.js` | Town explorer, photo pairs, map markers and local previews |
| `town.js` | Landmark selection, map zoom/drag/keyboard controls and saving |
| `town.css` | Compact street-map and heritage layouts |
| `scripts/prepare-town-map.js` | Prepare the local street artwork from OpenStreetMap XML |
| `public/town-map.svg` | Attributed, locally served street/building artwork |
| `public/town-sources.json` | Generated map bounds, source/licence and individual position sources |
| `discovery.css` | Connected-discovery layouts and trip print styles |
| `area-data.js` | Bilingual editorial guides for the five areas |
| `area-render.js` | Area pages, photographic place strips and area links |
| `area-ui.js` | Area-guide offer and outing interactions |
| `areas.css` | Compact area-guide and photographic layouts |
| `pillars-data.js` | Bilingual data for the 6 core pages: history, culture/politics, religion, people and news/projekttracker |
| `pillars-render.js` | Portal overview, 6-pillar navigation bar and thematic page rendering |
| `pillars-ui.js` | Pillar page category/status filtering and connected-place trip saving |
| `pillars.css` | Responsive layouts for the portal overview and thematic pillar pages |
| `render.js` | Shared card, guide, itinerary and regional HTML rendering |
| `routes.js` | Public site URL and locale/page paths |
| `scripts/generate-pages.js` | Static pages, metadata, sitemap and fallback page |
| `script.js` | UI, dialogs, persistence, sharing and downloads |
| `immersion.js` | Landscape selection, regional explorer, gallery, swipe and zoom |
| `trip.js` | Search, validation, ordering and export helpers |
| `planner.js` | Daybook migration, assignments, area grouping, sharing and per-day exports |
| `planner-render.js` | Planner controls, day previews, stop notes and local suggestions |
| `planner.css` | Compact responsive daybook and print layout |
| `styles.css` | Design system and responsive layouts |
| `public/images/` | Local photos and 640px/960px responsive renditions |
| `public/image-credits.json` | Photographer, source, licence and modifications for every photo |
| `public/content-sources.json` | Generated source inventory for every destination and business |
| `public/discovery-sources.json` | Generated history, geography and food source inventory |

Edit `templates/home.html`, `content.js`, `landmarks.js`, `local.js`, `local-landmarks.js`, `discovery-data.js` and `area-data.js`, rather than generated `index.html`, `en/`, `places/`, `local/`, `areas/` or `credits.html`. Vite generates pages at startup/build and regenerates when the template changes; content and route changes restart the server. You can also run `npm run generate` directly. New entries need a stable unique ID, translations, a public source and licensed photography. Keep image credits when replacing assets.

Update `siteConfig.url` in `routes.js` if the public domain or repository path changes. It controls canonical and alternate links, social images, structured data, the sitemap and 404 navigation; it does not affect local browsing.

The town explorer's street artwork is a committed local SVG. To refresh it, download OpenStreetMap XML from `https://www.openstreetmap.org/api/0.6/map?bbox=17.221,43.711,17.239,43.723`, then run `node scripts/prepare-town-map.js path/to/download.osm` and rebuild. Keep the ODbL attribution and review the selected positions in `town-data.js` against their individual source links. The SVG embeds its bounds, retrieval date, licence and source URL; `town-sources.json` is regenerated during builds. Runtime use of this town map does not contact OpenStreetMap or a tile service.

Driving links follow the visitor's chosen order, not an optimised route. Longer lists are split into linked legs with a shared endpoint to respect mobile waypoint limits. Directions do not imply that road access or conditions have been verified.

## Sources and editorial boundaries

Destination facts are based on [TZO Tomislavgrad](https://tz-tomislavgrad.com/), [Općina Tomislavgrad](https://tomislavgrad.gov.ba/turizam/), [Visit Blidinje](https://visit-blidinje.com/) and the national monuments register, checked in November 2026. Each guide links to its specific source. Suggested visit lengths and itineraries are editorial ideas, not trail timings or organised tours.

Business entries use owner websites, tourism/association pages and named directory or booking listings. The source inventory records the source checked for each entry; this is not a claim that availability or opening hours were confirmed with the business. Published call/email links are provided for selected entries. The wider Blidinje area is explicitly distinguished from Tomislavgrad town and the Duvno, Buško and Šujica areas. No ratings, prices or live open/closed states are invented.

Photographs are from Wikimedia Commons; attribution and individual Creative Commons licences are listed in `public/image-credits.json` and the site's photography dialog. Images were resized/converted and are cropped for display. Food images illustrate the dish, cooking method or ingredient; they are not photographs from the listed restaurants or makers. Image licences do not automatically apply to the website's code. Google Fonts has system font fallbacks. OpenStreetMap tiles are requested only when a visitor opens the interactive map, with visible attribution and normal browser caching.

Business-card images show their labelled geographical area, not the premises. Cave/sinkhole guides that use regional context photography label it explicitly. Replace these only with correctly identified photographs that you have permission to use.

The site is an independent guide in development. It does not present itself as an official tourist board, promise opening hours, or take bookings. Visitors can save businesses and destinations together, get driving links, download their list and follow the host/source links. Confirmed local events and additional owner-supplied property photography remain future editorial work.

## Interaction and motion

Landscape changes are visitor-controlled; there is no autoplay or audio. The gallery supports arrow buttons, left/right keyboard arrows, thumbnails and horizontal swipes. Zoom can be toggled with its button; mouse movement changes the zoom's focal point. Escape closes the gallery and restores focus. Reduced-motion preferences disable transitions and the subtle desktop landscape movement.

The regional explorer has an initial orientation diagram and an optional geographic basemap. Both use five area anchors; they do not mark exact access points or define hiking routes. Guides and the initial selection remain readable without JavaScript. The history section provides the remaining chapters in a no-JavaScript fallback.
