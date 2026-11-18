import { expect, test } from '@playwright/test';
import { boxOf, cardOf, inside, overlap } from '../../../support/app.ts';

const LONG_NAME = "Grandma Lucia's Slow-Fermented Whole Wheat Sourdough Country Loaf (Large)";
const SIZES = [
  ['a phone', 375, 800],
  ['a tablet', 768, 1000],
  ['a desktop', 1280, 900],
] as const;

test.describe('Ticket front-1: a long product name stays inside its card', () => {
  for (const [device, width, height] of SIZES) {
    test(`on ${device}, the name does not cover the price and both stay inside the card`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/?q=Grandma');
      const card = cardOf(page, LONG_NAME);
      await expect(card).toBeVisible();

      const cardBox = await boxOf(card, 'the card');
      const nameBox = await boxOf(card.getByTestId('product-name'), 'the name');
      const priceBox = await boxOf(card.getByTestId('product-price'), 'the price');

      expect(overlap(nameBox, priceBox), 'the name must not cover the price').toBe(false);
      expect(inside(nameBox, cardBox), 'the name must stay inside the card').toBe(true);
      expect(inside(priceBox, cardBox), 'the price must stay inside the card').toBe(true);
      await expect(card.getByTestId('product-price')).toHaveText('$8.90');
    });
  }

  test('in the full list, no card is wider than its column', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/?category=bakery');
    const cards = page.getByTestId('product-card');
    await expect(cards.first()).toBeVisible();

    const widths = await cards.evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().width)));
    expect(new Set(widths).size, `card widths: ${widths.join(', ')}`).toBe(1);
  });

  test('a short name is shown whole, next to its price', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/?q=Baguette');
    const card = cardOf(page, 'Baguette');
    await expect(card).toBeVisible();

    await expect(card.getByTestId('product-name')).toHaveText('Baguette');
    await expect(card.getByTestId('product-price')).toHaveText('$3.10');
  });
});
