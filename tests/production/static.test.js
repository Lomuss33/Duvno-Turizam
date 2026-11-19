import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseHTML } from 'linkedom';
import { destinations, translations } from '../../content.js';
import { localBusinesses } from '../../local.js';
import { pagePath, siteConfig } from '../../routes.js';
import { areaGuides } from '../../area-data.js';
import { pillarHubs } from '../../pillars-data.js';

const output = resolve('dist');
const paths = ['hr', 'en'].flatMap((language) => [
  pagePath(language),
  pagePath(language, null, 'credits'),
  ...[...destinations, ...localBusinesses].map((place) => pagePath(language, place.id)),
  ...areaGuides.map((area) => pagePath(language, area.id, 'area')),
  ...pillarHubs.filter((item) => item.kind === 'pillar').map((pillar) => pagePath(language, pillar.id, 'pillar')),
]);

test('every locale page has complete static content, unique IDs and matching search metadata', async () => {
  for (const path of paths) {
    const html = await readFile(resolve(output, path), 'utf8');
    const { document } = parseHTML(html);
    const language = path.startsWith('en/') ? 'en' : 'hr';
    assert.equal(document.documentElement.lang, language, path);
    assert.equal(document.querySelectorAll('main h1').length, 1, path);
    assert.ok(document.querySelector('main').textContent.trim().length > 500, path);
    assert.equal(document.querySelector('link[rel=canonical]').href, new URL(path, siteConfig.url).href, path);
    assert.equal(document.querySelectorAll('link[hreflang]').length, 3, path);
    assert.ok(document.querySelector('meta[property="og:image"]').content.startsWith(siteConfig.url), path);
    assert.ok(document.querySelector('meta[name="twitter:card"]'), path);
    const ids = [...document.querySelectorAll('[id]')].map((item) => item.id);
    assert.equal(new Set(ids).size, ids.length, `${path}: duplicate IDs`);
    for (const node of document.querySelectorAll('[data-i18n]')) assert.ok(node.getAttribute('data-i18n') in translations[language], `${path}: missing translation`);
    const schema = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    assert.equal(schema['@graph'][0].url, new URL(path, siteConfig.url).href, path);
    assert.equal(schema['@graph'][0].inLanguage, language, path);
    assert.ok(!html.includes('undefined'), path);
    assert.equal(document.querySelectorAll('#navigation a').length, 6, path);
    if (path.endsWith('index.html')) {
      assert.equal(document.querySelectorAll('.place-card').length, destinations.length, path);
      assert.equal(document.querySelectorAll('#business-grid .business-card').length, localBusinesses.length, path);
      assert.equal(document.querySelectorAll('.atlas-area-tabs [data-atlas-area]').length, 5, path);
      assert.equal(document.querySelectorAll('#portal .portal-card').length, 6, path);
    } else if (path.includes('pages/')) {
      assert.equal(document.querySelectorAll('.pillar-navigation a').length, 6, path);
      assert.ok(document.querySelector('.pillar-entry-card'), path);
    } else if (path.includes('places/')) {
      assert.ok(document.querySelector('.guide-description').textContent.length > 80, path);
      assert.ok(document.querySelector('.guide-cover figcaption a'), path);
    }
  }
});

test('all local links, scripts, styles and responsive images exist in the production output', async () => {
  for (const path of paths) {
    const { document } = parseHTML(await readFile(resolve(output, path), 'utf8'));
    const pageUrl = new URL(path, 'https://local.test/');
    const links = [...document.querySelectorAll('[href], [src]')].flatMap((node) => [node.getAttribute('href'), node.getAttribute('src')]).filter(Boolean);
    for (const image of document.querySelectorAll('[srcset]')) links.push(...image.getAttribute('srcset').split(',').map((part) => part.trim().split(/\s+/)[0]));
    for (const link of links) {
      const target = new URL(link, pageUrl);
      if (target.origin !== pageUrl.origin) continue;
      const relative = decodeURIComponent(target.pathname.slice(1));
      const file = resolve(output, relative + (relative.endsWith('/') || !relative ? 'index.html' : ''));
      assert.ok((await stat(file)).isFile(), `${path}: missing ${link}`);
      if (target.hash && file.endsWith('.html')) {
        const { document: targetDocument } = parseHTML(await readFile(file, 'utf8'));
        assert.ok(targetDocument.getElementById(decodeURIComponent(target.hash.slice(1))), `${path}: missing fragment ${link}`);
      }
    }
  }
});

test('sitemap includes every public locale page and each photograph has a source and licence', async () => {
  const sitemap = await readFile(resolve(output, 'sitemap.xml'), 'utf8');
  for (const path of paths) assert.ok(sitemap.includes(new URL(path, siteConfig.url).href), path);
  assert.equal((sitemap.match(/<url>/g) || []).length, paths.length);
  const credits = JSON.parse(await readFile(resolve(output, 'image-credits.json'), 'utf8'));
  for (const place of [...destinations, ...localBusinesses]) {
    const credit = credits.find((item) => item.local === `images/${place.image}.webp`);
    assert.ok(credit?.artist && credit.license && credit.page && credit.licenseUrl, place.id);
  }
});

test('the fallback page is self-contained and returns visitors to the configured project root', async () => {
  const { document } = parseHTML(await readFile(resolve(output, '404.html'), 'utf8'));
  assert.equal(document.querySelector('meta[name=robots]').content, 'noindex');
  assert.ok(document.querySelector('a[href="' + siteConfig.url + '"]'));
  assert.ok(document.querySelector('a[href="' + new URL('en/', siteConfig.url).href + '"]'));
  assert.equal(document.querySelectorAll('script, img, link[rel=stylesheet]').length, 0);
  assert.equal(document.querySelectorAll('main h1').length, 1);
});
