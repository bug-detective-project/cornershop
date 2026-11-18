import { describe, expect, it } from 'vitest';
import { useApi } from './test/app.ts';
import type { ProductPage } from './types.ts';

const { api } = useApi();

const list = async (query: Record<string, string | number>): Promise<ProductPage> =>
  (await api().get('/api/products').query(query)).body;

describe('pages of a size other than the default', () => {
  it.each([12, 5, 25, 50])('with %i per page, every product comes exactly once', async (pageSize) => {
    const { total } = await list({ pageSize });
    const seen: number[] = [];
    for (let page = 1; page <= Math.ceil(total / pageSize); page += 1) {
      const result = await list({ pageSize, page });
      expect(result.pageSize).toBe(pageSize);
      expect(result.total).toBe(total);
      seen.push(...result.items.map((item) => item.id));
    }

    expect(seen).toHaveLength(total);
    expect(new Set(seen).size).toBe(total);
  });

  it('page 2 of twelve starts where page 1 ended', async () => {
    const all = (await list({ pageSize: 24 })).items.map((item) => item.name);
    const first = (await list({ pageSize: 12 })).items.map((item) => item.name);
    const second = (await list({ pageSize: 12, page: 2 })).items.map((item) => item.name);

    expect(first).toEqual(all.slice(0, 12));
    expect(second).toEqual(all.slice(12, 24));
  });

  it('pages inside a category filter too', async () => {
    const first = await list({ category: 'bakery', pageSize: 3 });
    const third = await list({ category: 'bakery', pageSize: 3, page: 3 });

    expect(first.items).toHaveLength(3);
    expect(third.items).toHaveLength(1);
  });
});
