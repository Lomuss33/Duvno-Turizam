import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

test('all 6 core pages connect from the header and portal, filter entries, save stops and pass axe accessibility', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('./en/');
  await expect(page.locator('#navigation a')).toHaveCount(6);
  await expect(page.locator('#portal .portal-card')).toHaveCount(6);
  await expect(page.locator('#navigation a[aria-current="page"]')).toContainText('Tourism');

  // Navigate to Historical page
  await page.locator('#portal [data-pillar-card="history"] .portal-card-link').click();
  await expect(page).toHaveURL(/\/en\/pages\/history\.html$/);
  await expect(page.locator('main h1')).toHaveText('History of the Duvno Region');
  await expect(page.locator('.pillar-navigation a')).toHaveCount(6);
  await expect(page.locator('#pillar-items-grid .pillar-entry-card')).toHaveCount(6);
  await expect(page.locator('#name-evolution .name-timeline-list li')).toHaveCount(7);

  // Filter historical eras
  await page.locator('[data-pillar-filter="delmatae"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(1);
  await page.locator('[data-pillar-filter="all"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(6);

  // Navigate to Cultural & Political page
  await page.locator('.pillar-navigation a[href$="culture.html"]').click();
  await expect(page).toHaveURL(/\/en\/pages\/culture\.html$/);
  await expect(page.locator('main h1')).toHaveText('Cultural & Political Life of Duvno');
  await expect(page.locator('#pillar-items-grid .pillar-entry-card')).toHaveCount(6);
  await page.locator('[data-pillar-filter="civic"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(2);

  // Navigate to Religious page
  await page.locator('.pillar-navigation a[href$="religion.html"]').click();
  await expect(page).toHaveURL(/\/en\/pages\/religion\.html$/);
  await expect(page.locator('main h1')).toHaveText('Religious Heritage & Sacred Spaces');
  await expect(page.locator('#pillar-items-grid .pillar-entry-card')).toHaveCount(5);
  await page.locator('[data-pillar-filter="islamic"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(1);

  // Navigate to People of Duvno page
  await page.locator('.pillar-navigation a[href$="people.html"]').click();
  await expect(page).toHaveURL(/\/en\/pages\/people\.html$/);
  await expect(page.locator('main h1')).toHaveText('People of the Duvno Region');
  await expect(page.locator('#pillar-items-grid .pillar-entry-card')).toHaveCount(8);
  await page.locator('[data-pillar-filter="arts"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(3);

  // Navigate to News & Projekttracker Duvno page
  await page.locator('.pillar-navigation a[href$="projects.html"]').click();
  await expect(page).toHaveURL(/\/en\/pages\/projects\.html$/);
  await expect(page.locator('main h1')).toHaveText('Duvno News & Project Tracker');
  await expect(page.locator('#pillar-items-grid .pillar-entry-card')).toHaveCount(6);
  await expect(page.locator('#municipal-news .news-digest-card')).toHaveCount(4);

  // Filter projects by status
  await page.locator('[data-pillar-filter="active"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(3);
  await page.locator('[data-pillar-filter="completed"]').click();
  await expect(page.locator('#pillar-items-grid .pillar-entry-card:visible')).toHaveCount(2);

  // Save connected stops to trip from pillar hero
  await page.locator('[data-save-pillar]').click();
  await expect(page.locator('#trip-dialog')).toBeVisible();
  await expect(page.locator('#trip-dialog .trip-list li')).toHaveCount(5);
  await page.keyboard.press('Escape');

  // Switch language to Croatian on pillar page
  await page.locator('[data-language="hr"]').click();
  await expect(page).toHaveURL(/\/pages\/projects\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'hr');
  await expect(page.locator('main h1')).toHaveText('Vijesti i praćenje projekata u Duvnu');

  // Accessibility & 320px responsive layout check
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const violations = await page.evaluate(async () => (
    await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })
  ).violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })));
  expect(violations).toEqual([]);

  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
