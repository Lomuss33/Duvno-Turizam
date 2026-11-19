import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

test('full guides retain favourites, switch language, and link back to the correct homepage', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./en/');
  await page.locator('.place-card [data-save=busko]').click();
  await page.locator('[data-guide=busko]').click();
  await expect(page).toHaveURL(/\/en\/places\/busko\.html$/);
  await expect(page.locator('main h1')).toHaveText('Buško Lake');
  await expect(page.locator('.guide-heading [data-save]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-language=hr]').click();
  await expect(page).toHaveURL(/\/places\/busko\.html$/);
  await expect(page.locator('main h1')).toHaveText('Buško jezero');
  await expect(page.locator('.guide-heading [data-save]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('.plan-toggle').click();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(1);
  await expect(page.locator('#trip-route-links a')).toHaveAttribute('href', /google.com\/maps\/dir/);
  await page.keyboard.press('Escape');
  await page.locator('.brand').click();
  await expect(page.locator('#hero-title')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr');
  expect(errors).toEqual([]);
});

test('destination and homepage content are readable with JavaScript disabled', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}en/`);
  await expect(page.locator('#hero-title')).toContainText('Less hurry');
  await expect(page.locator('#place-grid .place-card')).toHaveCount(26);
  await expect(page.locator('.atlas-area-tabs [data-atlas-area]')).toHaveCount(5);
  await expect(page.locator('.quick-look').first()).not.toBeVisible();
  await page.locator('[data-guide=grad]').click();
  await expect(page.locator('main h1')).toHaveText('Tomislavgrad');
  await expect(page.locator('.guide-description')).toContainText('Franciscan museum');
  await page.locator('[data-language=hr]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr');
  await expect(page.locator('.guide-description')).toContainText('franjevački muzej');
  await page.locator('#open-credits').click();
  await expect(page.locator('.credits-page')).toBeVisible();
  await expect(page.locator('main .credit-item')).toHaveCount(44);
  await context.close();
});

test('direct guide requests have correct metadata, loaded assets and accessible layout', async ({ page }, testInfo) => {
  await page.goto('./en/places/blidinje.html');
  await expect(page).toHaveTitle('Blidinje & Vran — Visit Duvno');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://lomuss33.github.io/Duvno-Turizam/en/places/blidinje.html');
  expect(await page.locator('.guide-cover-image').evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })));
  expect(violations).toEqual([]);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-guide.png`, fullPage: true });
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.plan-toggle').click();
  await expect(page.locator('.empty-trip')).toBeVisible();
  await page.locator('[data-explore-places]').click();
  await expect(page).toHaveURL(/\/en\/#mjesta$/);
});

test('quick preview links to its full guide and trip sharing copies a reusable home URL', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text) => { window.copiedTrip = text; } } });
  });
  await page.goto('./en/');
  await page.locator('.place-card [data-place=busko]').click();
  await page.locator('.full-guide-link').click();
  await expect(page).toHaveURL(/\/en\/places\/busko\.html$/);
  await page.locator('.guide-heading [data-save]').click();
  await page.locator('.plan-toggle').click();
  await page.locator('#share-plan').click();
  const copied = await page.evaluate(() => window.copiedTrip);
  const url = new URL(copied);
  expect(url.pathname).toBe('/Duvno-Turizam/en/');
  expect(url.searchParams.get('trip')).toBe('busko');
  await page.goto(copied);
  await expect(page.locator('#trip-dialog')).toBeVisible();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(1);
});
