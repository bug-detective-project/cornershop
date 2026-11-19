import { describe, expect, it } from 'vitest';
import { byName, useApi } from './test/app.ts';
import type { ProductPage } from './types.ts';

const { api } = useApi();

/** The first fifty products that match: enough for every case here, in one request. */
const list = async (query: Record<string, string | number>): Promise<ProductPage> => {
  const response = await api()
    .get('/api/products')
    .query({ pageSize: 50, ...query });
  expect(response.status).toBe(200);
  return response.body;
};
const items = async (query: Record<string, string | number>) => (await list(query)).items;
const names = async (query: Record<string, string | number>) => (await items(query)).map((item) => item.name);

describe('sorting the list', () => {
  it('sorts by name when nothing is asked, and with sort=name', async () => {
    const byDefault = await names({});

    expect(byDefault).toEqual([...byDefault].sort(byName));
    expect(await names({ sort: 'name' })).toEqual(byDefault);
  });

  it('sorts by price, cheapest first, and products of the same price by id', async () => {
    const sorted = await items({ sort: 'price_asc' });

    expect(sorted[0]).toMatchObject({ name: 'Chewing Gum', priceCents: 95 });
    expect(sorted).toEqual([...sorted].sort((a, b) => a.priceCents - b.priceCents || a.id - b.id));
    // The sample shop has several products at 450: the tie must have one answer.
    expect(sorted.filter((item) => item.priceCents === 450).length).toBeGreaterThan(2);
  });

  it('sorts by price, most expensive first, and products of the same price by id', async () => {
    const sorted = await items({ sort: 'price_desc' });

    expect(sorted[0]).toMatchObject({ name: 'Gift Hamper with Sparkling Wine', priceCents: 12900 });
    expect(sorted).toEqual([...sorted].sort((a, b) => b.priceCents - a.priceCents || a.id - b.id));
  });

  it('sorts by newest first', async () => {
    const sorted = await items({ sort: 'newest' });

    expect(sorted).toEqual([...sorted].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id - b.id));
    expect((await names({ sort: 'newest', category: 'bakery' }))[0]).toBe('Baguette');
  });

  it('sorts the whole list, not one page of it', async () => {
    const whole = (await items({ sort: 'price_asc' })).map((item) => item.id);
    const second = await api().get('/api/products').query({ sort: 'price_asc', page: 2 });

    expect(second.body.items.map((item: { id: number }) => item.id)).toEqual(whole.slice(10, 20));
  });

  it('refuses an unknown order with 400', async () => {
    const response = await api().get('/api/products').query({ sort: 'cheapest' });

    expect(response.status).toBe(400);
    expect(Object.keys(response.body.fields)).toEqual(['sort']);
  });
});

describe('the price range', () => {
  it('keeps the products from minPrice to maxPrice, both included, in cents', async () => {
    const found = await items({ minPrice: 450, maxPrice: 499 });

    expect(found.every((item) => item.priceCents >= 450 && item.priceCents <= 499)).toBe(true);
    expect(found.map((item) => item.name)).toEqual(
      expect.arrayContaining(['Sourdough Loaf', 'Honeycrisp Apples (4)', 'Sea Salt Flakes', 'Fresh Mozzarella', 'Ginger Kombucha', 'Orange Juice', 'Arborio Rice']),
    );
    expect(await names({ category: 'bakery', minPrice: 450, maxPrice: 450 })).toEqual(['Sourdough Loaf']);
  });

  it('takes only a minimum or only a maximum', async () => {
    expect(await names({ category: 'drinks', minPrice: 1000 })).toEqual(['Gift Hamper with Sparkling Wine']);
    expect(await names({ category: 'snacks', maxPrice: 229 })).toEqual(['Chewing Gum', 'Sea Salt Crisps']);
  });

  it('counts only the products in the range in the total', async () => {
    const whole = await list({ minPrice: 1000 });
    const two = await list({ minPrice: 1000, pageSize: 2 });

    expect(whole.total).toBe(whole.items.length);
    expect(two.total).toBe(whole.total);
    expect(two.items).toHaveLength(2);
  });

  it('works together with the category, the search and the order', async () => {
    expect(await names({ category: 'bakery', minPrice: 300, maxPrice: 600, sort: 'price_desc' })).toEqual([
      'Seeded Rye Bread',
      'Sourdough Loaf',
      'Cinnamon Roll',
      'Baguette',
    ]);
    expect(await names({ q: 'bread', maxPrice: 100 })).toEqual([]);
  });

  it.each([
    [{ minPrice: -1 }, 'minPrice'],
    [{ minPrice: 'cheap' }, 'minPrice'],
    [{ maxPrice: 4.5 }, 'maxPrice'],
    [{ minPrice: 500, maxPrice: 100 }, 'maxPrice'],
  ])('refuses %j with 400', async (query, field) => {
    const response = await api().get('/api/products').query(query);

    expect(response.status).toBe(400);
    expect(Object.keys(response.body.fields)).toEqual([field]);
  });
});
