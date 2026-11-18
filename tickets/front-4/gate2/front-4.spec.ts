import { expect, test } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';
import { allProducts, namesShown } from '../../../support/app.ts';

const category = (page: Page) => page.getByLabel('Category');

/** Chooses a category once the options arrived from the API. */
async function choose(page: Page, label: string): Promise<void> {
  await expect(category(page).getByRole('option', { name: 'Bakery' })).toBeAttached();
  await category(page).selectOption({ label });
}

const shelf = async (request: APIRequestContext, slug: string) => (await allProducts(request, { category: slug })).map((product) => product.name).sort();
const shown = async (page: Page) => (await namesShown(page)).sort();

test.describe('Ticket front-4: the category filter lives in the URL', () => {
  test('choosing a category puts it in the address', async ({ page, request }) => {
    await page.goto('/');
    await choose(page, 'Bakery');

    await expect(page).toHaveURL(/[?&]category=bakery(&|$)/);
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'bakery'));
  });

  test('a reload keeps the category', async ({ page, request }) => {
    await page.goto('/');
    await choose(page, 'Bakery');
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'bakery'));

    await page.reload();

    await expect(category(page)).toHaveValue('bakery');
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'bakery'));
  });

  test('a shared link opens on its category', async ({ page, request }) => {
    await page.goto('/?category=dairy');

    await expect(category(page)).toHaveValue('dairy');
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'dairy'));
  });

  test('Back returns to the category before', async ({ page, request }) => {
    await page.goto('/');
    await choose(page, 'Bakery');
    await expect(page).toHaveURL(/category=bakery/);
    await choose(page, 'Dairy');
    await expect(page).toHaveURL(/category=dairy/);
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'dairy'));

    await page.goBack();

    await expect(page).toHaveURL(/category=bakery/);
    await expect(category(page)).toHaveValue('bakery');
    await expect.poll(() => shown(page)).toEqual(await shelf(request, 'bakery'));
  });

  test('choosing a category keeps the search and goes back to the first page', async ({ page }) => {
    await page.goto('/?q=o&page=2');
    await choose(page, 'Bakery');

    await expect(page).toHaveURL(/[?&]q=o(&|$)/);
    await expect(page).toHaveURL(/[?&]category=bakery(&|$)/);
    await expect(page).not.toHaveURL(/[?&]page=/);
    await expect(page.getByLabel('Search')).toHaveValue('o');
  });

  test('"All categories" shows every shelf again', async ({ page }) => {
    await page.goto('/?category=dairy');
    await expect(category(page)).toHaveValue('dairy');
    await choose(page, 'All categories');

    await expect(page).not.toHaveURL(/category=/);
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });
});
