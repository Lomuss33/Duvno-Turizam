import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

test('landscape selection changes the hero and opens an accessible keyboard-controlled gallery', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('./en/');
  await page.locator('[data-scene=lake]').click();
  await expect(page.locator('[data-scene=lake]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.hero-location strong')).toHaveText('Buško Lake');
  await expect.poll(() => page.locator('.hero-image').evaluate((image) => image.complete && image.naturalWidth > 0 && image.currentSrc.includes('/lake'))).toBe(true);
  await page.locator('.hero-gallery-link').click();
  await expect(page.locator('#gallery-dialog')).toBeVisible();
  await expect(page.locator('#gallery-name')).toHaveText('Buško Lake');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#gallery-name')).toHaveText('Blidinje & Vran');
  await page.locator('[data-gallery-photo=town]').click();
  await expect(page.locator('#gallery-name')).toHaveText('Tomislavgrad');
  await page.locator('#gallery-zoom').click();
  await expect(page.locator('#gallery-zoom')).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#gallery-zoom')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#gallery-credit')).toHaveAttribute('href', /commons.wikimedia.org/);
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })));
  expect(violations).toEqual([]);
  await page.screenshot({ path: `test-results/${testInfo.project.name}-gallery.png` });
  await page.keyboard.press('Escape');
  await expect(page.locator('#gallery-dialog')).not.toBeVisible();
  await expect(page.locator('.hero-gallery-link')).toBeFocused();
  expect(errors).toEqual([]);
});

test('regional selectors change the scene, guide links and gallery subject', async ({ page }) => {
  await page.goto('./en/');
  await page.locator('.atlas-area-tabs [data-atlas-area=sujica]').click();
  await expect(page.locator('.atlas-area-tabs [data-atlas-area=sujica]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#atlas-cover h3')).toHaveText('Follow the river. Find another pace.');
  await expect(page.locator('#atlas-places a[href$="/en/places/sujica.html"]')).toHaveCount(1);
  await page.locator('#atlas-cover [data-open-gallery]').click();
  await expect(page.locator('#gallery-name')).toHaveText('Šujica River');
  await page.keyboard.press('Escape');
  await page.locator('.atlas-area-tabs [data-atlas-area=blidinje]').click();
  await expect(page.locator('#atlas-places .atlas-place')).toHaveCount(11);
  await expect(page.locator('#atlas-places a[href$="/en/places/blidinje.html"]')).toHaveCount(1);
});

test('itinerary preferences change the saved suggestions and the journey dock stays in sync', async ({ page }) => {
  await page.goto('./en/');
  await page.locator('[data-vibe=active]').click();
  await page.locator('[data-days="1"]').click();
  await expect(page.locator('#itinerary h3')).toHaveText('Make it a mountain day.');
  await page.locator('#save-itinerary').click();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(2);
  await expect(page.locator('#trip-dialog .trip-item-content h3').first()).toHaveText('Blidinje & Vran');
  await page.keyboard.press('Escape');
  await expect(page.locator('#journey-dock')).toBeVisible();
  await expect(page.locator('#dock-count')).toContainText('2');
  await page.locator('#journey-dock [data-open-plan]').click();
  await page.locator('#clear-plan').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('#journey-dock')).not.toBeVisible();
  await page.locator('[data-vibe=culture]').click();
  await expect(page.locator('#itinerary h3')).toHaveText('Begin with the local stories.');
});

test('surprise discovery respects filters and compact layouts keep the hero controls apart', async ({ page }, testInfo) => {
  await page.goto('./en/');
  await page.locator('[data-filter=culture]').click();
  await page.locator('#surprise-place').click();
  await expect(page.locator('#place-dialog .eyebrow')).toHaveText(/CULTURE|HERITAGE|COLLECTIONS|MONUMENT|KARST|PREHISTORY|FOREST|SPIRITUALITY|STONE|HISTORY|WATER/);
  await page.keyboard.press('Escape');
  await page.evaluate(() => { document.activeElement.blur(); scrollTo(0, 0); });
  await page.screenshot({ path: `test-results/${testInfo.project.name}-hero.png` });
  const galleryLink = await page.locator('.hero-gallery-link').boundingBox();
  const sceneSelector = await page.locator('.scene-selector').boundingBox();
  expect(galleryLink.y + galleryLink.height).toBeLessThan(sceneSelector.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (testInfo.project.name === 'mobile') {
    const heading = await page.locator('#hero-title').boundingBox();
    expect(heading.height).toBeLessThan(150);
  }
});
