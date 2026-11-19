// Rebuild the committed orientation artwork from an OpenStreetMap XML download.
// Usage: node scripts/prepare-town-map.js path/to/town.osm
// Source URL and licence remain embedded in the resulting SVG.
import { readFile, writeFile } from 'node:fs/promises';
import { DOMParser } from 'linkedom';

const input = process.argv[2];
if (!input) throw new Error('Pass an OpenStreetMap .osm XML file. See README.md for the source bounding box.');
const document = new DOMParser().parseFromString(await readFile(input, 'utf8'), 'text/xml');
const bounds = { west: 17.221, east: 17.2349, south: 43.7147, north: 43.7225 };
const size = { width: 900, height: 700 };
const tags = element => Object.fromEntries([...element.querySelectorAll('tag')].map(tag => [tag.getAttribute('k'), tag.getAttribute('v')]));
const nodes = new Map([...document.querySelectorAll('node')].map(node => [node.id, [+node.getAttribute('lat'), +node.getAttribute('lon')]]));
const project = ([lat, lon]) => [(lon - bounds.west) / (bounds.east - bounds.west) * size.width, (bounds.north - lat) / (bounds.north - bounds.south) * size.height];
const inside = ([lat, lon]) => lat >= bounds.south && lat <= bounds.north && lon >= bounds.west && lon <= bounds.east;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
const buildings = [], roads = [], waterways = [], green = [], labels = [];
const named = new Set();
for (const way of document.querySelectorAll('way')) {
  const metadata = tags(way);
  const points = [...way.querySelectorAll('nd')].map(node => nodes.get(node.getAttribute('ref'))).filter(Boolean);
  if (points.length < 2 || !points.some(inside)) continue;
  const coordinates = points.map(project);
  const path = coordinates.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join('');
  if (metadata.building) buildings.push(`<path d="${path}Z"/>`);
  else if (['park', 'garden', 'pitch'].includes(metadata.leisure) || ['forest', 'grass', 'meadow', 'cemetery'].includes(metadata.landuse)) green.push(`<path d="${path}Z"/>`);
  else if (metadata.waterway) waterways.push(`<path d="${path}"/>`);
  else if (metadata.highway && !['steps', 'path', 'footway', 'cycleway'].includes(metadata.highway)) {
    const major = ['primary', 'secondary', 'tertiary'].includes(metadata.highway);
    roads.push(`<path class="${major ? 'major' : 'minor'}" d="${path}"/>`);
    if (metadata.name && !named.has(metadata.name) && ['Mijata Tomića', 'Kralja Zvonimira', 'Kralja Tvrtka'].includes(metadata.name)) {
      const index = Math.floor(coordinates.length / 2);
      const [x, y] = coordinates[index];
      const [previousX, previousY] = coordinates[Math.max(0, index - 1)];
      let angle = Math.atan2(y - previousY, x - previousX) * 180 / Math.PI;
      if (angle > 90 || angle < -90) angle += 180;
      if (x > 45 && x < 850 && y > 50 && y < 650) {
        labels.push(`<text x="${x.toFixed(1)}" y="${(y - 9).toFixed(1)}" transform="rotate(${angle.toFixed(1)} ${x.toFixed(1)} ${(y - 9).toFixed(1)})">${escape(metadata.name)}</text>`);
        named.add(metadata.name);
      }
    }
  }
}
const source = 'https://www.openstreetmap.org/api/0.6/map?bbox=17.221,43.711,17.239,43.723';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700" width="900" height="700"><title>Tomislavgrad street orientation</title><desc>Derived from OpenStreetMap data retrieved 2026-11-14. © OpenStreetMap contributors, ODbL 1.0. ${escape(source)}. Simplified orientation artwork, not a surveyed access or navigation map.</desc><metadata>${escape(JSON.stringify({ source, bounds, license: 'https://opendatacommons.org/licenses/odbl/1-0/', attribution: '© OpenStreetMap contributors', retrieved: '2026-11-14' }))}</metadata><style>.green{fill:#355341;opacity:.6}.buildings{fill:#60725c;stroke:#8b9c7a;stroke-width:.6;opacity:.7}.roads{fill:none;stroke-linecap:round;stroke-linejoin:round}.minor{stroke:#789078;stroke-width:3}.major{stroke:#c0c6a0;stroke-width:7}.water{fill:none;stroke:#83c2b5;stroke-width:3}.labels{fill:#dce1be;font:15px sans-serif;paint-order:stroke;stroke:#1b3329;stroke-width:5px;stroke-linejoin:round}</style><rect width="900" height="700" fill="#1b3329"/><g class="green">${green.join('')}</g><g class="buildings">${buildings.join('')}</g><g class="water">${waterways.join('')}</g><g class="roads">${roads.join('')}</g><g class="labels">${labels.join('')}</g></svg>\n`;
await writeFile('public/town-map.svg', svg);
console.log(`Prepared town-map.svg: ${buildings.length} building shapes, ${roads.length} roads, ${waterways.length} waterways; ${(svg.length / 1024).toFixed(1)} kB.`);
