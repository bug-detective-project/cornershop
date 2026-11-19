import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { adminRow, cardOf, cards } from '../../../support/app.ts';

/** Fills the form of the owner panel and saves. */
async function create(page: Page, name: string): Promise<void> {
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Price', { exact: true }).fill('6.75');
  await page.getByLabel('Stock', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.getByRole('status')).toHaveText('Product created');
}

/** Leaves a mark on the page that a reload would erase. */
async function forbidReload(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { qaMark?: boolean }).qaMark = true;
  });
}

/** The new product must show up in the page that was already open. */
async function expectNoReload(page: Page): Promise<void> {
  expect(await page.evaluate(() => (window as unknown as { qaMark?: boolean }).qaMark), 'the page must not be reloaded').toBe(true);
}

test.describe('Ticket front-6: a new product shows up without a reload', () => {
  test('in the list of the owner panel', async ({ page }) => {
    await page.goto('/admin');
    await expect(adminRow(page, 'Umbrella')).toBeVisible();
    await forbidReload(page);

    await create(page, 'A Fig Jam, panel');

    await expect(adminRow(page, 'A Fig Jam, panel')).toBeVisible();
    // Newest first: it is the first row.
    await expect(page.getByTestId('admin-product').first().getByTestId('admin-product-name')).toHaveText('A Fig Jam, panel');
    await expectNoReload(page);
  });

  test('in the storefront, when the owner goes there from the panel', async ({ page }) => {
    // The storefront is loaded first, so its list is already in the client's cache.
    await page.goto('/');
    await cards(page);
    await forbidReload(page);
    await page.getByRole('link', { name: 'Admin', exact: true }).click();
    await expect(adminRow(page, 'Umbrella')).toBeVisible();

    await create(page, 'A Fig Jam, storefront');
    await page.getByRole('link', { name: 'Shop', exact: true }).click();

    // By name, it belongs at the top of the first page.
    await expect(cardOf(page, 'A Fig Jam, storefront')).toBeVisible();
    await expect(cardOf(page, 'A Fig Jam, storefront').getByTestId('product-price')).toHaveText('$6.75');
    await expectNoReload(page);
  });

  test('editing and deleting still update the list at once', async ({ page }) => {
    await page.goto('/admin');
    await expect(adminRow(page, 'Matches')).toBeVisible();
    await forbidReload(page);

    await page.getByRole('button', { name: 'Edit Matches', exact: true }).click();
    await page.getByLabel('Name', { exact: true }).fill('Safety Matches');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(adminRow(page, 'Safety Matches')).toBeVisible();

    await page.getByRole('button', { name: 'Delete Safety Matches', exact: true }).click();
    await page.getByRole('alertdialog', { name: 'Delete product?' }).getByRole('button', { name: 'Delete product', exact: true }).click();
    await expect(adminRow(page, 'Safety Matches')).toHaveCount(0);
    await expectNoReload(page);
  });
});
