import { expect, test } from '@playwright/test';
import { allProducts, cardOf, getProduct, productNamed } from '../../../support/app.ts';

test.describe('Ticket back-4: a product has one price everywhere', () => {
  test('the details of a product give the same whole cents as the list', async ({ request }) => {
    const listed = await allProducts(request);

    for (const product of listed.filter((_, index) => index % 4 === 0)) {
      const details = await getProduct(request, product.id);
      expect(Number.isInteger(details.priceCents), `${product.name}: priceCents must be a whole number of cents`).toBe(true);
      expect(details.priceCents, product.name).toBe(product.priceCents);
    }
  });

  test('the Sourdough Loaf costs 450 cents in the list and in its details', async ({ request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');

    expect(loaf.priceCents).toBe(450);
    expect((await getProduct(request, loaf.id)).priceCents).toBe(450);
  });

  test('a new product comes back with the price that was sent', async ({ request }) => {
    const created = await request.post('/api/products', {
      data: { name: 'QA Price Check', description: '', priceCents: 1999, stock: 1, categoryId: null },
    });
    expect(created.status()).toBe(201);
    const product = await created.json();
    expect(product.priceCents).toBe(1999);

    const changed = await request.patch(`/api/products/${product.id}`, { data: { priceCents: 2050 } });
    expect((await changed.json()).priceCents).toBe(2050);
    expect((await getProduct(request, product.id)).priceCents).toBe(2050);
  });

  test('the product page shows the same price as the storefront card', async ({ page, request }) => {
    const loaf = await productNamed(request, 'Sourdough Loaf');

    await page.goto('/?q=Sourdough Loaf');
    await expect(cardOf(page, 'Sourdough Loaf').getByTestId('product-price')).toHaveText('$4.50');

    await page.goto(`/products/${loaf.id}`);
    await expect(page.getByRole('heading', { level: 1, name: 'Sourdough Loaf' })).toBeVisible();
    await expect(page.getByTestId('product-price')).toHaveText('$4.50');
  });

  test('the product page of the most expensive product shows its full price', async ({ page, request }) => {
    const hamper = await productNamed(request, 'Gift Hamper with Sparkling Wine');

    await page.goto(`/products/${hamper.id}`);

    await expect(page.getByTestId('product-price')).toHaveText('$129.00');
  });
});
