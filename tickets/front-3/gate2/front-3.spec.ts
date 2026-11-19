import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { cardOf, cards } from '../../../support/app.ts';

const LOAF = 'Sourdough Loaf';
const GRANDMA = "Grandma Lucia's Slow-Fermented Whole Wheat Sourdough Country Loaf (Large)";

/** The photo a card shows, and which of its dots is pressed. */
async function expectPhoto(page: Page, name: string, file: RegExp, dot: number): Promise<void> {
  const card = cardOf(page, name);
  await expect(card.getByRole('img', { name })).toHaveAttribute('src', file);
  await expect(card.getByRole('button', { name: `Photo ${dot}`, exact: true })).toHaveAttribute('aria-pressed', 'true');
}

/** The loaf shows its second photo, and the other loaf with two photos still shows its first. */
async function expectOnlyTheLoafMoved(page: Page): Promise<void> {
  await expectPhoto(page, LOAF, /sourdough-loaf-2\.jpg$/, 2);
  if ((await cardOf(page, GRANDMA).count()) > 0) {
    await expectPhoto(page, GRANDMA, /-1\.jpg$/, 1);
  }
}

const firstName = (page: Page) => page.getByTestId('product-card').first().getByTestId('product-name');

test.describe('Ticket front-3: the photo picked on a card stays with its product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?category=bakery');
    await cards(page);
    await cardOf(page, LOAF).getByRole('button', { name: 'Photo 2', exact: true }).click();
    await expectOnlyTheLoafMoved(page);
  });

  test('when the list is sorted by price', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Price: low to high' });
    await expect(firstName(page)).toHaveText('Butter Croissant');
    await expectOnlyTheLoafMoved(page);

    await page.getByLabel('Sort by').selectOption({ label: 'Price: high to low' });
    await expect(firstName(page)).toContainText('Grandma Lucia');
    await expectOnlyTheLoafMoved(page);
  });

  test('when the order goes back to what it was', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Newest' });
    await expect(firstName(page)).toHaveText('Baguette');
    await page.getByLabel('Sort by').selectOption({ label: 'Name' });
    await expect(firstName(page)).toHaveText('Baguette');
    await expect(page.getByTestId('product-card').nth(1).getByTestId('product-name')).toHaveText('Blueberry Muffin');

    await expectOnlyTheLoafMoved(page);
  });

  test('when the list is filtered by a search', async ({ page }) => {
    await page.getByLabel('Search').fill('loaf');
    await expect(page.getByTestId('product-card')).toHaveCount(2);

    await expectOnlyTheLoafMoved(page);
  });

  test('and going back to the first photo changes the same card', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Price: low to high' });
    await expect(firstName(page)).toHaveText('Butter Croissant');

    await cardOf(page, LOAF).getByRole('button', { name: 'Photo 1', exact: true }).click();

    await expectPhoto(page, LOAF, /sourdough-loaf-1\.jpg$/, 1);
    await expect(page.getByRole('button', { name: 'Photo 2', exact: true, pressed: true })).toHaveCount(0);
  });
});
