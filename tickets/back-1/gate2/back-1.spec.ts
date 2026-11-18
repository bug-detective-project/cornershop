import { expect, test } from '@playwright/test';
import { allProducts, cardOf, cards, productNamed } from '../../../support/app.ts';

const product = { name: 'QA Fig Jam', description: 'Small batch.', priceCents: 675, stock: 5, categoryId: null };

test.describe('Ticket back-1: a product needs a valid price', () => {
  for (const priceCents of [-500, -1, 4.5, '675']) {
    test(`creating a product with the price ${JSON.stringify(priceCents)} answers 400 and stores nothing`, async ({ request }) => {
      const response = await request.post('/api/products', { data: { ...product, priceCents } });

      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(Object.keys(body.fields ?? {}), 'the answer must name the field that is wrong').toEqual(['priceCents']);
      expect(await allProducts(request, { q: 'QA Fig Jam' })).toEqual([]);
    });
  }

  for (const priceCents of [-500, 4.5]) {
    test(`changing a price to ${priceCents} answers 400 and keeps the old price`, async ({ request }) => {
      const loaf = await productNamed(request, 'Sourdough Loaf');

      const response = await request.patch(`/api/products/${loaf.id}`, { data: { priceCents } });

      expect(response.status()).toBe(400);
      expect(Object.keys((await response.json()).fields ?? {})).toEqual(['priceCents']);
      expect((await productNamed(request, 'Sourdough Loaf')).priceCents).toBe(450);
    });
  }

  test('a valid product is still created with 201, and a price of zero is allowed', async ({ request }) => {
    const created = await request.post('/api/products', { data: { ...product, name: 'QA Free Sample', priceCents: 0 } });
    expect(created.status()).toBe(201);
    expect((await created.json()).priceCents).toBe(0);

    const paid = await request.post('/api/products', { data: { ...product, name: 'QA Paid Sample' } });
    expect(paid.status()).toBe(201);
    expect((await paid.json()).priceCents).toBe(675);
  });

  test('the other fields are still checked', async ({ request }) => {
    const response = await request.post('/api/products', { data: { ...product, name: '', stock: -1 } });

    expect(response.status()).toBe(400);
    expect(Object.keys((await response.json()).fields).sort()).toEqual(['name', 'stock']);
  });

  test('no product in the shop has a negative price', async ({ page, request }) => {
    await request.post('/api/products', { data: { ...product, name: 'A QA Negative', priceCents: -500 } });

    await page.goto('/');
    await cards(page);

    await expect(cardOf(page, 'A QA Negative')).toHaveCount(0);
    expect((await allProducts(request)).filter((item) => item.priceCents < 0)).toEqual([]);
  });
});
