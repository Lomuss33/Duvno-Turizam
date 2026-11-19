import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

test('local directory combines business type, region and diacritic-insensitive search', async ({ page }) => {
  await page.goto('./en/');
  await expect(page.locator('#business-grid .business-card')).toHaveCount(23);
  await page.locator('[data-business-filter=made]').click();
  await expect(page.locator('#business-grid .business-card')).toHaveCount(5);
  await page.locator('#business-area').selectOption('town');
  await expect(page.locator('#business-grid .business-card')).toHaveCount(3);
  await expect(page.locator('#business-grid h3')).toHaveText(['Knebu Winery', 'OPG Ljubičić', 'Duvanjska kuća']);
  await page.locator('#business-search').fill('not-a-place');
  await expect(page.locator('#business-empty')).toBeVisible();
  await page.locator('#business-reset').click();
  await expect(page.locator('#business-grid .business-card')).toHaveCount(23);
  await page.locator('#business-search').fill('papic');
  await expect(page.locator('#business-grid h3')).toHaveText('Motel Papić');
  await page.locator('#business-search').fill('<script>');
  await expect(page.locator('#business-empty')).toBeVisible();
});

test('businesses save alongside places, retain their own source and get local page URLs', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./en/');
  await page.locator('#business-grid [data-save=lovre]').click();
  await page.locator('#business-grid [data-business-id=lovre] h3 a').click();
  await expect(page).toHaveURL(/\/en\/local\/lovre.html$/);
  await expect(page.locator('main h1')).toHaveText('Restoran Lovre');
  await expect(page.locator('.guide-heading [data-save=lovre]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.sidebar-source')).toHaveAttribute('href', 'https://lovre-tg.com/restoran.html');
  await expect(page.locator('.guide-cover figcaption')).toContainText('area photograph');
  await page.locator('.plan-toggle').click();
  await expect(page.locator('#trip-dialog .trip-item-content h3')).toHaveText('Restoran Lovre');
  await expect(page.locator('#trip-route-links a')).toHaveAttribute('href', /Lovre/);
  await page.keyboard.press('Escape');
  await page.locator('[data-language=hr]').click();
  await expect(page).toHaveURL(/\/local\/lovre.html$/);
  await expect(page.locator('.guide-heading [data-save=lovre]')).toHaveAttribute('aria-pressed', 'true');
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })));
  expect(violations).toEqual([]);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-business.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('heritage pages explain cave access, show source links and offer local addresses', async ({ page }) => {
  await page.goto('./en/places/dahna.html');
  await expect(page.locator('.before-you-go')).toContainText('only in the company of speleologists');
  await expect(page.locator('.guide-cover figcaption')).toContainText('not the cave interior');
  await expect(page.locator('.guide-sidebar .source-check a')).toHaveAttribute('href', /tz-tomislavgrad.com/);
  await expect(page.locator('.local-nearby .business-card')).toHaveCount(2);
  await page.goto('./en/places/dugo-polje.html');
  await expect(page.locator('.guide-description')).toContainText('UNESCO');
  await expect(page.locator('.local-nearby .business-card')).toHaveCount(4);
});

test('photo journal provides distinct regional views and layouts remain compact at 320 pixels', async ({ page }, testInfo) => {
  await page.goto('./en/');
  await expect(page.locator('.journal-grid button')).toHaveCount(41);
  await page.locator('.journal-grid [data-open-gallery=hajducka-vrata]').click();
  await expect(page.locator('#gallery-name')).toHaveText('Hajdučka Vrata');
  await expect(page.locator('#gallery-position')).toContainText('/ 41');
  await page.keyboard.press('Escape');
  if (testInfo.project.name === 'desktop') {
    const columns = await page.locator('#place-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(6);
  }
  const height = await page.locator('.hero').evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(400);
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('#business-search').fill('grabovica');
  await expect(page.locator('#business-grid .business-card')).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
