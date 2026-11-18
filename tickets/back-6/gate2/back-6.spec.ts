import { expect, test } from '@playwright/test';
import type { Product } from '../../../support/app.ts';
import { allProducts, cards, listProducts, namesShown } from '../../../support/app.ts';

const lower = (text: string) => text.toLowerCase();
const byName = (a: Product, b: Product) => (lower(a.name) < lower(b.name) ? -1 : lower(a.name) > lower(b.name) ? 1 : a.id - b.id);
const names = (products: Product[]) => products.map((product) => product.name);

test.describe('Ticket back-6: the list sorts and filters by price', () => {
  test('sort=name and no sort give the list by name', async ({ request }) => {
    const byDefault = await allProducts(request);

    expect(names(byDefault)).toEqual(names([...byDefault].sort(byName)));
    expect(names(await allProducts(request, { sort: 'name' }))).toEqual(names(byDefault));
  });

  test('sort=price_asc gives the cheapest first, and equal prices by id', async ({ request }) => {
    const items = await allProducts(request, { sort: 'price_asc' });

    expect(items).toHaveLength(60);
    expect(items[0]).toMatchObject({ name: 'Chewing Gum', priceCents: 95 });
    expect(items.map((item) => item.id)).toEqual([...items].sort((a, b) => a.priceCents - b.priceCents || a.id - b.id).map((item) => item.id));
  });

  test('sort=price_desc gives the most expensive first, and equal prices by id', async ({ request }) => {
    const items = await allProducts(request, { sort: 'price_desc' });

    expect(items[0]).toMatchObject({ name: 'Gift Hamper with Sparkling Wine', priceCents: 12900 });
    expect(items.map((item) => item.id)).toEqual([...items].sort((a, b) => b.priceCents - a.priceCents || a.id - b.id).map((item) => item.id));
  });

  test('sort=newest gives the last product added first', async ({ request }) => {
    const items = await allProducts(request, { sort: 'newest' });

    expect(items[0]!.name).toBe('Umbrella');
    expect(items.map((item) => item.id)).toEqual(
      [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id - b.id).map((item) => item.id),
    );
  });

  test('the order holds across pages', async ({ request }) => {
    const whole = (await allProducts(request, { sort: 'price_asc' })).map((item) => item.id);

    expect((await listProducts(request, { sort: 'price_asc', page: 2 })).items.map((item) => item.id)).toEqual(whole.slice(10, 20));
  });

  test('minPrice and maxPrice keep the products in the range, both ends included', async ({ request }) => {
    const items = await allProducts(request, { minPrice: 450, maxPrice: 499 });

    expect(names(items).sort()).toEqual(
      ['Arborio Rice', 'Fresh Mozzarella', 'Ginger Kombucha', 'Honeycrisp Apples (4)', 'Orange Juice', 'Reusable Tote Bag', 'Sea Salt Flakes', 'Sourdough Loaf'].sort(),
    );
    expect((await listProducts(request, { minPrice: 450, maxPrice: 499 })).total).toBe(8);
  });

  test('only a minimum, or only a maximum', async ({ request }) => {
    expect(names(await allProducts(request, { minPrice: 1890 })).sort()).toEqual(['Gift Hamper with Sparkling Wine', 'Umbrella']);
    expect(names(await allProducts(request, { maxPrice: 120 })).sort()).toEqual(['Chewing Gum', 'Matches']);
  });

  test('the range works with the category, the search and the order together', async ({ request }) => {
    const items = await allProducts(request, { category: 'bakery', minPrice: 300, maxPrice: 600, sort: 'price_desc' });

    expect(names(items)).toEqual(['Seeded Rye Bread', 'Sourdough Loaf', 'Cinnamon Roll', 'Baguette']);
    expect(await allProducts(request, { q: 'bread', maxPrice: 100 })).toEqual([]);
  });

  for (const [query, field] of [
    [{ sort: 'cheapest' }, 'sort'],
    [{ minPrice: -1 }, 'minPrice'],
    [{ minPrice: 'cheap' }, 'minPrice'],
    [{ maxPrice: 4.5 }, 'maxPrice'],
    [{ minPrice: 500, maxPrice: 100 }, 'maxPrice'],
  ] as const) {
    test(`${JSON.stringify(query)} answers 400 and names ${field}`, async ({ request }) => {
      const response = await request.get('/api/products', { params: query });

      expect(response.status()).toBe(400);
      expect(Object.keys((await response.json()).fields ?? {})).toEqual([field]);
    });
  }

  test('the category, the search and the pages still work', async ({ request }) => {
    expect((await listProducts(request, { category: 'bakery' })).total).toBe(7);
    expect(names((await listProducts(request, { q: 'BREAD' })).items)).toEqual(['Seeded Rye Bread']);
    expect((await listProducts(request, { page: 6 })).items).toHaveLength(10);
  });

  test('the storefront sorts by price and filters by a price range', async ({ page }) => {
    await page.goto('/');
    await cards(page);

    await page.getByLabel('Sort by').selectOption({ label: 'Price: low to high' });
    await expect(page.getByTestId('product-card').first().getByTestId('product-name')).toHaveText('Chewing Gum');

    await page.getByLabel('Min price').fill('18.90');
    await expect(page.getByTestId('product-card')).toHaveCount(2);
    expect(await namesShown(page)).toEqual(['Umbrella', 'Gift Hamper with Sparkling Wine']);
  });
});
