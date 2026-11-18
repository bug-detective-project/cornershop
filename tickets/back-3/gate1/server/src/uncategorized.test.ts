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
    expect(stored).toHaveLength(6);

    for (const product of stored) {
      const found = (await list({ q: product.name })).items.filter((item) => item.id === product.id);

      expect(found, product.name).toHaveLength(1);
      expect(found[0]!.category).toBeNull();
    }
  });

  it('count in the total', async () => {
    const stored = await db().select().from(products);

    expect((await list()).total).toBe(stored.length);
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
