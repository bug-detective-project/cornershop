import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { adminRow, productNamed } from '../../../support/app.ts';

const increase = (page: Page, name: string) => page.getByRole('button', { name: `Increase stock of ${name}`, exact: true });
const decrease = (page: Page, name: string) => page.getByRole('button', { name: `Decrease stock of ${name}`, exact: true });
const stock = (page: Page, name: string) => adminRow(page, name).getByTestId('stock-value');

/** Presses Tab until the control with this accessible name has the focus. */
async function tabTo(page: Page, label: string): Promise<void> {
  for (let presses = 0; presses < 250; presses += 1) {
    await page.keyboard.press('Tab');
    if ((await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === label) {
      return;
    }
  }
  throw new Error(`Tab never reached "${label}": it must be in the tab order`);
}

test.describe('Ticket front-5: the stock buttons work without a mouse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin');
    await expect(adminRow(page, 'Umbrella')).toBeVisible();
  });

  test('each product has a button to add stock and one to take it out, named after the product', async ({ page }) => {
    const rows = await page.getByTestId('admin-product').count();
    expect(rows).toBeGreaterThan(5);

    await expect(page.getByRole('button', { name: /^Increase stock of / })).toHaveCount(rows);
    await expect(page.getByRole('button', { name: /^Decrease stock of / })).toHaveCount(rows);
    await expect(adminRow(page, 'Umbrella').getByRole('button', { name: 'Increase stock of Umbrella', exact: true })).toBeVisible();
    await expect(adminRow(page, 'Umbrella').getByRole('button', { name: 'Decrease stock of Umbrella', exact: true })).toBeVisible();
  });

  test('Tab reaches them, and Enter and Space change the stock and save it', async ({ page, request }) => {
    const before = (await productNamed(request, 'Umbrella')).stock;

    await tabTo(page, 'Decrease stock of Umbrella');
    await page.keyboard.press('Enter');
    await expect(stock(page, 'Umbrella')).toHaveText(String(before - 1));
    await expect.poll(async () => (await productNamed(request, 'Umbrella')).stock).toBe(before - 1);

    await tabTo(page, 'Increase stock of Umbrella');
    await page.keyboard.press('Space');
    await expect(stock(page, 'Umbrella')).toHaveText(String(before));
    await expect.poll(async () => (await productNamed(request, 'Umbrella')).stock).toBe(before);
  });

  test('they still work with a click', async ({ page }) => {
    const before = Number(await stock(page, 'Matches').textContent());

    await increase(page, 'Matches').click();
    await expect(stock(page, 'Matches')).toHaveText(String(before + 1));
    await decrease(page, 'Matches').click();
    await expect(stock(page, 'Matches')).toHaveText(String(before));
  });

  test('the stock cannot go below zero', async ({ page }) => {
    await expect(stock(page, 'Fish Fingers')).toHaveText('0');

    await expect(decrease(page, 'Fish Fingers')).toBeDisabled();
    await expect(increase(page, 'Fish Fingers')).toBeEnabled();
  });
});
