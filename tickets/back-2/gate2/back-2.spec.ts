import { expect, test } from '@playwright/test';
import { adminRow, allProducts, cardOf, listProducts } from '../../../support/app.ts';

const UNSORTED = ['Birthday Card', 'Local Newspaper', 'Matches', 'Phone Charging Cable', 'Reusable Tote Bag', 'Umbrella'];

test.describe('Ticket back-2: products without a category are in the list', () => {
  test('the list has them, with a null category', async ({ request }) => {
    const uncategorized = (await allProducts(request)).filter((product) => product.category === null);

    expect(uncategorized.map((product) => product.name).sort()).toEqual(UNSORTED);
  });

  test('the total counts them', async ({ request }) => {
    expect((await listProducts(request)).total).toBe(60);
    expect(await allProducts(request)).toHaveLength(60);
  });

  test('the search finds them', async ({ request }) => {
    const found = await listProducts(request, { q: 'umbrella' });

    expect(found.total).toBe(1);
    expect(found.items[0]).toMatchObject({ name: 'Umbrella', category: null });
  });

  test('a category filter still shows only that category', async ({ request }) => {
    const bakery = await allProducts(request, { category: 'bakery' });

    expect(bakery).toHaveLength(7);
    expect(bakery.every((product) => product.category?.slug === 'bakery')).toBe(true);
  });

  test('a product created without a category shows up in the list', async ({ request }) => {
    const created = await request.post('/api/products', {
      data: { name: 'QA Loose Item', description: '', priceCents: 300, stock: 1, categoryId: null },
    });
    expect(created.status()).toBe(201);

    expect((await listProducts(request, { q: 'QA Loose Item' })).items.map((item) => item.name)).toEqual(['QA Loose Item']);
  });

  test('the storefront and the owner panel show them', async ({ page }) => {
    await page.goto('/?q=Umbrella');
    await expect(cardOf(page, 'Umbrella')).toBeVisible();

    await page.goto('/admin');
    await expect(adminRow(page, 'Umbrella')).toBeVisible();
  });
});
