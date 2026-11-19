import { expect, test } from '@playwright/test';
import { adminRow } from '../../../support/app.ts';

test.describe('Ticket front-9: the price field of the owner panel has the mask of the price filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await expect(adminRow(page, 'Matches')).toBeVisible();
  });

  test('the digits come in from the right, as cents', async ({ page }) => {
    const price = page.getByLabel('Price', { exact: true });

    await price.pressSequentially('4');
    await expect(price).toHaveValue('$0.04');
    await price.pressSequentially('5');
    await expect(price).toHaveValue('$0.45');
    await price.pressSequentially('0');
    await expect(price).toHaveValue('$4.50');
  });

  test('anything but a digit is ignored, and Backspace takes the last digit out', async ({ page }) => {
    const price = page.getByLabel('Price', { exact: true });

    await price.pressSequentially('12a3,4.5', { delay: 20 });
    await expect(price).toHaveValue('$123.45');
    await price.press('Backspace');
    await expect(price).toHaveValue('$12.34');
  });

  test('a phone shows its number keys for the price', async ({ page }) => {
    await expect(page.getByLabel('Price', { exact: true })).toHaveAttribute('inputmode', 'numeric');
  });

  test('the price of the product to edit shows with the mask', async ({ page }) => {
    // Matches is among the newest products, on the first page of the panel.
    await page.getByRole('button', { name: 'Edit Matches', exact: true }).click();

    await expect(page.getByLabel('Price', { exact: true })).toHaveValue('$1.20');
  });

  test('a price typed with the mask is saved in cents', async ({ page }) => {
    await page.getByLabel('Name', { exact: true }).fill('Fig Jam');
    await page.getByLabel('Price', { exact: true }).pressSequentially('450', { delay: 20 });
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByRole('status')).toHaveText('Product created');
    await expect(adminRow(page, 'Fig Jam')).toContainText('$4.50');
  });
});
