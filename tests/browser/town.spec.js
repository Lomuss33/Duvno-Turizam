import { test, expect } from '@playwright/test';

async function expectPinsAligned(page) {
  const error = await page.locator('#town-map-content').evaluate(content => {
    const image = content.querySelector('img').getBoundingClientRect();
    return Math.max(...[...content.querySelectorAll('.town-map-marker')].map(marker => {
      const circle = marker.querySelector('span').getBoundingClientRect();
      const expectedX = image.left + parseFloat(marker.style.left) / 100 * image.width;
      const expectedY = image.top + parseFloat(marker.style.top) / 100 * image.height;
      return Math.max(Math.abs(circle.left + circle.width / 2 - expectedX), Math.abs(circle.top + circle.height / 2 - expectedY));
    }));
  });
  expect(error).toBeLessThan(1.5);
}

test('town map keeps pins aligned while zooming and connects culture, local previews and saved trips', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./en/?town=culture#bastina');
  await expect(page.locator('#town-panel h3')).toContainText('Leave an exhibition');
  await expectPinsAligned(page);
  await page.locator('[data-town-zoom=in]').click();
  await page.locator('[data-town-zoom=in]').click();
  await expectPinsAligned(page);
  await page.locator('[data-town-zoom=reset]').click();
  await page.locator('[data-town-local=galija]').click();
  await expect(page.locator('#town-local-preview')).toContainText('Pizzeria Galija');
  await expect(page.locator('#town-local-preview a[href^="tel:"]')).toHaveAttribute('href', 'tel:+38734352538');
  await page.locator('#town-local-preview [data-save=galija]').click();
  await page.locator('[data-town-close-local]').click();
  await page.locator('#town-local-toggle').click();
  await expect(page.locator('#town-local-markers')).toBeHidden();
  await page.locator('#town-panel [data-town-save]').click();
  await expect(page.locator('#trip-dialog .trip-item-content h3')).toHaveText(['Caffe bar · Pizzeria Galija', 'KIC · culture & visitor information']);
  await page.keyboard.press('Escape');
  await page.locator('[data-language=hr]').click();
  await expect(page).toHaveURL(/\?town=culture#bastina$/);
  await expect(page.locator('#town-panel h3')).toContainText('Izađi s izložbe');
  await page.setViewportSize({ width: 320, height: 760 });
  await expectPinsAligned(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('./en/places/kic.html');
  await expect(page.locator('main h1')).toHaveText('KIC · culture & visitor information');
  await expect(page.locator('.guide-cover figcaption')).toContainText('not KIC');
  await expect(page.locator('.town-guide-link')).toHaveAttribute('href', /\/en\/\?town=culture#bastina$/);
  expect(errors).toEqual([]);
});
