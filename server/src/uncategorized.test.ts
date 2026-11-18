import { isNull } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { products } from './schema.ts';
import { useApi } from './test/app.ts';
import type { ProductPage } from './types.ts';

const { api, db } = useApi();

const list = async (query: Record<string, string | number> = {}): Promise<ProductPage> =>
  (await api().get('/api/products').query(query)).body;

describe('products without a category', () => {
  it('are in the list, with a null category', async () => {
    const stored = await db().select().from(products).where(isNull(products.categoryId));
    const page = await list({ pageSize: 50 });
    const second = await list({ pageSize: 50, page: 2 });
    const listed = [...page.items, ...second.items].filter((item) => item.category === null);

    expect(stored).toHaveLength(6);
    expect(listed.map((item) => item.name).sort()).toEqual(stored.map((row) => row.name).sort());
  });

  it('count in the total', async () => {
    expect((await list()).total).toBe(60);
  });

  it('are found by the search', async () => {
    const page = await list({ q: 'umbrella' });

    expect(page.total).toBe(1);
    expect(page.items[0]).toMatchObject({ name: 'Umbrella', category: null });
  });

  it('stay out of a category filter', async () => {
    const page = await list({ category: 'bakery', pageSize: 50 });

    expect(page.total).toBe(7);
    expect(page.items.every((item) => item.category?.slug === 'bakery')).toBe(true);
  });
});
