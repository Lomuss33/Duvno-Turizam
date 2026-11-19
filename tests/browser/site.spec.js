import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

test('production assets, translations, search and category filters work under the Pages path', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('#place-grid .place-card')).toHaveCount(26);
  await expect(page.locator('.hero-image')).toHaveJSProperty('complete', true);
  expect(await page.locator('.hero-image').evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  await page.locator('[data-language=en]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle(/Less hurry/);
  await page.locator('#place-search').fill('busko');
  await expect(page.locator('#place-grid .place-card')).toHaveCount(2);
  await expect(page.locator('#place-grid .place-card h3').first()).toHaveText('Buško Lake↗');
  await page.locator('#place-search').fill('<script>');
  await expect(page.locator('#empty-results')).toBeVisible();
  await page.locator('#reset-search').click();
  await page.locator('[data-filter=culture]').click();
  await expect(page.locator('#place-grid .place-card')).toHaveCount(12);
  await expect(page.locator('#place-grid .place-card h3').first()).toHaveText('Tomislavgrad↗');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
});

test('destination guide saves a trip, reorders it, persists it and exports it', async ({ page }) => {
  await page.goto('./?lang=en');
  await page.locator('.place-card [data-place=busko]').click();
  const guide = page.locator('#place-dialog');
  await expect(guide).toBeVisible();
  await expect(guide.locator('h2')).toHaveText('Buško Lake');
  await guide.locator('[data-save]').click();
  await expect(guide.locator('[data-save]')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(guide).not.toBeVisible();
  await expect(page).not.toHaveURL(/place=/);
  await page.locator('.place-card [data-save=grad]').click();
  await page.locator('.plan-toggle').click();
  const trip = page.locator('#trip-dialog');
  await expect(trip.locator('.trip-list li')).toHaveCount(2);
  await trip.locator('[data-move=grad][data-offset="-1"]').click();
  await expect(trip.locator('.trip-item-content h3').first()).toHaveText('Tomislavgrad');
  const downloadEvent = page.waitForEvent('download');
  await trip.locator('#download-plan').click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('visit-duvno-en.txt');
  await page.reload();
  await page.locator('.plan-toggle').click();
  await expect(trip.locator('.trip-item-content h3').first()).toHaveText('Tomislavgrad');
  await trip.locator('[data-remove=grad]').click();
  await expect(trip.locator('.trip-list li')).toHaveCount(1);
  await trip.locator('#clear-plan').click();
  await expect(trip.locator('.empty-trip')).toBeVisible();
  await expect(page.locator('.plan-count')).toHaveText('0');
});

test('shared links merge only valid destinations, retain order and open the trip', async ({ page }) => {
  await page.goto('./?lang=en&trip=busko,grad,bad-id,busko');
  const trip = page.locator('#trip-dialog');
  await expect(trip).toBeVisible();
  await expect(trip.locator('.trip-list li')).toHaveCount(2);
  await expect(trip.locator('.trip-item-content h3').first()).toHaveText('Buško Lake');
  await expect(page).not.toHaveURL(/trip=/);
  await page.keyboard.press('Escape');
  await page.goto('./?lang=en&trip=blidinje');
  await expect(trip.locator('.trip-list li')).toHaveCount(3);
});

test('itinerary choices, seasons and practical accordions update correctly', async ({ page }) => {
  await page.goto('./?lang=en');
  await page.locator('[data-days="3"]').click();
  await expect(page.locator('#itinerary article')).toHaveCount(3);
  await page.locator('#save-itinerary').click();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(5);
  await page.keyboard.press('Escape');
  await page.locator('[data-days="1"]').click();
  await expect(page.locator('#itinerary article')).toHaveCount(1);
  await page.locator('[data-season=winter]').click();
  await expect(page.locator('#season-content h3')).toContainText('mountains');
  await expect(page.locator('[data-season=winter]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#faq-list summary').first().click();
  await expect(page.locator('#faq-list details').first()).toHaveAttribute('open', '');
  await page.locator('[data-language=hr]').click();
  await expect(page.locator('#faq-list summary').first()).toHaveText(/Kako doći/);
});

test('photo credits load local attribution and licence links', async ({ page }) => {
  await page.goto('./?lang=en');
  await page.locator('#open-credits').click();
  await expect(page.locator('#credits-dialog')).toBeVisible();
  await expect(page.locator('.credit-item')).toHaveCount(44);
  await expect(page.locator('.credit-item').first()).toContainText('J budissin');
  await expect(page.locator('.credit-item').first().locator('a').last()).toHaveAttribute('href', /creativecommons.org/);
});

test('malformed browser storage and unavailable storage do not break the site', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('duvno-trip', '{broken-json');
    localStorage.setItem('duvno-language', '"invalid"');
    Storage.prototype.setItem = () => { throw new DOMException('Disabled', 'SecurityError'); };
  });
  await page.goto('./');
  await expect(page.locator('#place-grid .place-card')).toHaveCount(26);
  await page.locator('.place-card [data-save=grad]').click();
  await page.locator('.plan-toggle').click();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(1);
  await expect(page.locator('#storage-note')).toBeVisible();
});

test('layout fits the viewport, all content images load and mobile menu closes with Escape', async ({ page }, testInfo) => {
  await page.goto('./?lang=en');
  for (const image of await page.locator('main img').all()) if (await image.isVisible()) await image.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('main img')].filter((image) => image.getClientRects().length).every((image) => image.complete));
  expect(await page.evaluate(() => [...document.querySelectorAll('main img')].filter((image) => image.getClientRects().length && !image.naturalWidth).map((image) => image.src))).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (testInfo.project.name === 'mobile') {
    await page.locator('.menu-toggle').click();
    await expect(page.locator('#navigation')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#navigation')).not.toBeVisible();
    await expect(page.locator('.menu-toggle')).toBeFocused();
  }
  await page.evaluate(() => { document.activeElement.blur(); window.scrollTo(0, 0); });
  await page.screenshot({ path: `test-results/${testInfo.project.name}-full.png`, fullPage: true });
});

test('homepage and open destination guide have no serious accessibility violations', async ({ page }) => {
  await page.goto('./?lang=en');
  await page.addScriptTag({ path: axePath });
  const audit = () => page.evaluate(async () => {
    const results = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } });
    return results.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }));
  });
  expect(await audit()).toEqual([]);
  await page.locator('.place-card [data-place=busko]').click();
  expect(await audit()).toEqual([]);
  await page.keyboard.press('Escape');
  await page.locator('.plan-toggle').click();
  expect(await audit()).toEqual([]);
});
