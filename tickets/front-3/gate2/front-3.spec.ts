import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { cardOf, cards } from '../../../support/app.ts';

/** The details that are open belong to this product, and to no other card. */
async function expectOnlyOpen(page: Page, name: string): Promise<void> {
  await expect(page.getByTestId('product-description')).toHaveCount(1);
  await expect(cardOf(page, name).getByTestId('product-description')).toContainText(`${name}.`);
}

const firstName = (page: Page) => page.getByTestId('product-card').first().getByTestId('product-name');

test.describe('Ticket front-3: open details stay with their product', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?category=bakery');
    await cards(page);
    await cardOf(page, 'Sourdough Loaf').getByRole('button', { name: 'Details' }).click();
    await expectOnlyOpen(page, 'Sourdough Loaf');
  });

  test('when the list is sorted by price', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Price: low to high' });
    await expect(firstName(page)).toHaveText('Butter Croissant');
    await expectOnlyOpen(page, 'Sourdough Loaf');

    await page.getByLabel('Sort by').selectOption({ label: 'Price: high to low' });
    await expect(firstName(page)).toContainText('Grandma Lucia');
    await expectOnlyOpen(page, 'Sourdough Loaf');
  });

  test('when the order goes back to what it was', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Newest' });
    await expect(firstName(page)).toHaveText('Baguette');
    await page.getByLabel('Sort by').selectOption({ label: 'Name' });
    await expect(firstName(page)).toHaveText('Baguette');
    await expect(page.getByTestId('product-card').nth(1).getByTestId('product-name')).toHaveText('Blueberry Muffin');

    await expectOnlyOpen(page, 'Sourdough Loaf');
  });

  test('when the list is filtered by a search', async ({ page }) => {
    await page.getByLabel('Search').fill('loaf');
    await expect(page.getByTestId('product-card')).toHaveCount(2);

    await expectOnlyOpen(page, 'Sourdough Loaf');
  });

  test('and close on the same card', async ({ page }) => {
    await page.getByLabel('Sort by').selectOption({ label: 'Price: low to high' });
    await expect(firstName(page)).toHaveText('Butter Croissant');

    await cardOf(page, 'Sourdough Loaf').getByRole('button', { name: 'Details' }).click();

    await expect(page.getByTestId('product-description')).toHaveCount(0);
  });
});
