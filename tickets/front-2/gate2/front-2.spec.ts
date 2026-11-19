import { expect, test } from '@playwright/test';
import { cards } from '../../../support/app.ts';

test.describe('Ticket front-2: the product grid fits a phone', () => {
  for (const width of [375, 414]) {
    test(`at ${width}px, nothing is cut off and the page does not scroll sideways`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const all = await cards(page);

      const page_ = await page.evaluate(() => ({ content: document.documentElement.scrollWidth, screen: document.documentElement.clientWidth }));
      expect(page_.content, 'the width of the page must not pass the width of the screen').toBeLessThanOrEqual(page_.screen);

      const edges = await all.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()).map((box) => [Math.floor(box.left), Math.ceil(box.right)]));
      for (const [left, right] of edges) {
        expect(left, 'the left edge of a card').toBeGreaterThanOrEqual(0);
        expect(right, 'the right edge of a card').toBeLessThanOrEqual(width);
      }
    });
  }

  test('on a desktop, the grid still has at least three columns', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const all = await cards(page);

    const lefts = await all.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().left)));
    expect(new Set(lefts).size, 'columns of the grid at 1280px').toBeGreaterThanOrEqual(3);
  });

  test('on a tablet, the grid has more than one column', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto('/');
    const all = await cards(page);

    const lefts = await all.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().left)));
    expect(new Set(lefts).size, 'columns of the grid at 768px').toBeGreaterThanOrEqual(2);
  });
});
