import { describe, expect, it } from 'vitest';
import { byName, useApi } from './test/app.ts';
import type { ProductPage } from './types.ts';

const { api } = useApi();

const list = async (query: Record<string, string | number>): Promise<ProductPage> => {
  const response = await api().get('/api/products').query(query);
  expect(response.status).toBe(200);
  return response.body;
};
/** Every product that matches, walking the pages. */
const all = async (query: Record<string, string | number>) => {
  const first = await list({ ...query, pageSize: 50 });
  const second = first.total > 50 ? (await list({ ...query, pageSize: 50, page: 2 })).items : [];
  return [...first.items, ...second];
};

describe('sorting the list', () => {
  it('sorts by name when nothing is asked, and with sort=name', async () => {
    const byDefault = (await all({})).map((item) => item.name);

    expect(byDefault).toEqual([...byDefault].sort(byName));
    expect((await all({ sort: 'name' })).map((item) => item.name)).toEqual(byDefault);
  });

  it('sorts by price, cheapest first, and products of the same price by id', async () => {
    const items = await all({ sort: 'price_asc' });

    expect(items[0]).toMatchObject({ name: 'Chewing Gum', priceCents: 95 });
    expect(items.at(-1)).toMatchObject({ name: 'Gift Hamper with Sparkling Wine', priceCents: 12900 });
    expect(items).toEqual([...items].sort((a, b) => a.priceCents - b.priceCents || a.id - b.id));
    // The sample shop has several products at 450: the tie must have one answer.
    expect(items.filter((item) => item.priceCents === 450).length).toBeGreaterThan(2);
  });

  it('sorts by price, most expensive first, and products of the same price by id', async () => {
    const items = await all({ sort: 'price_desc' });

    expect(items[0]!.priceCents).toBe(12900);
    expect(items).toEqual([...items].sort((a, b) => b.priceCents - a.priceCents || a.id - b.id));
  });

  it('sorts by newest first', async () => {
    const items = await all({ sort: 'newest' });

    expect(items[0]!.name).toBe('Umbrella');
    expect(items).toEqual([...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id - b.id));
  });

  it('keeps the order across pages', async () => {
    const whole = (await all({ sort: 'price_asc' })).map((item) => item.id);
    const second = (await list({ sort: 'price_asc', page: 2 })).items.map((item) => item.id);

    expect(second).toEqual(whole.slice(10, 20));
  });

  it('refuses an unknown order with 400', async () => {
    const response = await api().get('/api/products').query({ sort: 'cheapest' });

    expect(response.status).toBe(400);
    expect(Object.keys(response.body.fields)).toEqual(['sort']);
  });
});

describe('the price range', () => {
  it('keeps the products from minPrice to maxPrice, both included, in cents', async () => {
    const items = await all({ minPrice: 450, maxPrice: 499 });

    expect(items.length).toBeGreaterThan(3);
    expect(items.every((item) => item.priceCents >= 450 && item.priceCents <= 499)).toBe(true);
    expect(items.some((item) => item.priceCents === 450)).toBe(true);
    expect(items.some((item) => item.priceCents === 499)).toBe(true);
  });

  it('takes only a minimum or only a maximum', async () => {
    expect((await all({ minPrice: 1890 })).map((item) => item.name).sort()).toEqual(['Gift Hamper with Sparkling Wine', 'Umbrella']);
    expect((await all({ maxPrice: 120 })).map((item) => item.name).sort()).toEqual(['Chewing Gum', 'Matches']);
  });

  it('counts only the products in the range in the total', async () => {
    const page = await list({ minPrice: 1000, pageSize: 2 });

    expect(page.total).toBe((await all({ minPrice: 1000 })).length);
    expect(page.items).toHaveLength(2);
  });

  it('works together with the category, the search and the order', async () => {
    const items = await all({ category: 'bakery', minPrice: 300, maxPrice: 600, sort: 'price_desc' });

    expect(items.map((item) => item.name)).toEqual(['Seeded Rye Bread', 'Sourdough Loaf', 'Cinnamon Roll', 'Baguette']);
    expect((await all({ q: 'bread', maxPrice: 100 })).length).toBe(0);
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
