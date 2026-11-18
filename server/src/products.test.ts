import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetDatabase } from './db.ts';
import { products } from './schema.ts';
import { byName, useApi } from './test/app.ts';
import type { Product, ProductPage } from './types.ts';

// What each ticket of the game breaks is tested in a file of its own (price-validation,
// uncategorized, pagination, price-cents, request-id, price-range-and-sort): the tests here hold
// for every ticket.

const { api, db } = useApi();

const list = async (query: Record<string, string | number> = {}): Promise<ProductPage> => {
  const response = await api().get('/api/products').query(query);
  expect(response.status).toBe(200);
  return response.body as ProductPage;
};
const names = (page: ProductPage) => page.items.map((item) => item.name);
/** A product without its price. */
const unpriced = ({ priceCents: _priceCents, ...rest }: Product) => rest;
const categoryId = async (slug: string): Promise<number> =>
  (await api().get('/api/categories')).body.find((category: { slug: string }) => category.slug === slug).id;

describe('GET /api/products', () => {
  it('gives the first page of ten, by name, with the total', async () => {
    const page = await list();

    expect(page.total).toBeGreaterThan(50);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(10);
    expect(page.items).toHaveLength(10);
    expect(names(page)).toEqual([...names(page)].sort(byName));
    expect(names(page)[0]).toBe('Aged Cheddar');
  });

  it('gives each product with its category, its photos in order and whole cents', async () => {
    const page = await list({ q: 'sourdough loaf' });

    expect(page.items).toEqual([
      {
        id: expect.any(Number),
        name: 'Sourdough Loaf',
        description: 'Sourdough Loaf. Baked this morning in the back of the shop.',
        priceCents: 450,
        stock: 12,
        category: { id: expect.any(Number), name: 'Bakery', slug: 'bakery' },
        images: ['/images/sourdough-loaf-1.svg', '/images/sourdough-loaf-2.svg', '/images/sourdough-loaf-3.svg'],
        createdAt: expect.any(String),
      },
    ]);
  });

  it('walks the pages of ten without repeating a product', async () => {
    const { total } = await list();
    const seen: number[] = [];
    for (let page = 1; page <= Math.ceil(total / 10); page += 1) {
      seen.push(...(await list({ page })).items.map((item) => item.id));
    }

    expect(seen).toHaveLength(total);
    expect(new Set(seen).size).toBe(total);
    expect((await list({ page: Math.ceil(total / 10) + 1 })).items).toEqual([]);
  });

  it('filters by category', async () => {
    const page = await list({ category: 'bakery', pageSize: 50 });

    expect(page.total).toBe(7);
    expect(page.items.every((item) => item.category?.slug === 'bakery')).toBe(true);
    expect((await list({ category: 'no-such-shelf' })).total).toBe(0);
  });

  it('searches the name, ignoring case and treating % and _ as plain text', async () => {
    expect(names(await list({ q: 'BREAD' }))).toEqual(['Seeded Rye Bread']);
    expect(names(await list({ q: '70%' }))).toEqual(['Dark Chocolate 70%']);
    expect((await list({ q: '_' })).total).toBe(0);
  });

  it('refuses a page or a page size that is not a positive whole number, or a size above 50', async () => {
    for (const query of [{ page: 0 }, { page: 'two' }, { pageSize: 0 }, { pageSize: 51 }, { pageSize: 2.5 }]) {
      const response = await api().get('/api/products').query(query);

      expect(response.status).toBe(400);
      expect(Object.keys(response.body.fields)).toEqual([Object.keys(query)[0]]);
    }
  });
});

describe('GET /api/products/:id', () => {
  it('gives one product, the same as in the list', async () => {
    const [listed] = (await list({ q: 'sourdough loaf' })).items;
    const response = await api().get(`/api/products/${listed!.id}`);

    expect(response.status).toBe(200);
    expect(unpriced(response.body)).toEqual(unpriced(listed!));
  });

  it('answers 404 for a product that does not exist and for an id that is not a number', async () => {
    for (const id of ['999999', 'abc', '1.5']) {
      const response = await api().get(`/api/products/${id}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    }
  });
});

describe('changing products', () => {
  beforeEach(async () => {
    await resetDatabase(db());
  });

  const fields = { name: 'Fig Jam', description: 'Small batch.', priceCents: 675, stock: 5 };

  it('creates a product with 201 and gives it back', async () => {
    const pantry = await categoryId('pantry');
    const response = await api()
      .post('/api/products')
      .send({ ...fields, categoryId: pantry });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Fig Jam',
      description: 'Small batch.',
      stock: 5,
      category: { id: pantry, name: 'Pantry', slug: 'pantry' },
      images: [],
    });
    expect((await list({ q: 'fig jam' })).items.map((item) => item.id)).toEqual([response.body.id]);
  });

  it('creates a product without a category', async () => {
    const response = await api()
      .post('/api/products')
      .send({ ...fields, categoryId: null });

    expect(response.status).toBe(201);
    expect(response.body.category).toBeNull();
    expect((await api().get(`/api/products/${response.body.id}`)).body.name).toBe('Fig Jam');
  });

  it('refuses a product without a name, or with a category that does not exist, naming the field', async () => {
    const before = (await list()).total;
    for (const [body, field] of [
      [{ ...fields, name: '   ' }, 'name'],
      [{ ...fields, name: undefined }, 'name'],
      [{ ...fields, stock: -1 }, 'stock'],
      [{ ...fields, categoryId: 999999 }, 'categoryId'],
      [{ ...fields, description: 5 }, 'description'],
    ] as const) {
      const response = await api().post('/api/products').send(body);

      expect(response.status).toBe(400);
      expect(Object.keys(response.body.fields)).toEqual([field]);
      expect(response.body.error).toBe('Invalid product');
    }
    expect((await list()).total).toBe(before);
  });

  it('changes only the fields that were sent', async () => {
    const [loaf] = (await list({ q: 'sourdough loaf' })).items;
    const response = await api().patch(`/api/products/${loaf!.id}`).send({ stock: 11 });

    expect(response.status).toBe(200);
    expect(unpriced(response.body)).toEqual(unpriced({ ...loaf!, stock: 11 }));
  });

  it('refuses a change with a bad field and changes nothing', async () => {
    const [loaf] = (await list({ q: 'sourdough loaf' })).items;
    const response = await api().patch(`/api/products/${loaf!.id}`).send({ stock: 1.5, name: 'Loaf' });

    expect(response.status).toBe(400);
    expect(Object.keys(response.body.fields)).toEqual(['stock']);
    expect(unpriced((await api().get(`/api/products/${loaf!.id}`)).body)).toEqual(unpriced(loaf!));
  });

  it('removes a product, with its photos', async () => {
    const [loaf] = (await list({ q: 'sourdough loaf' })).items;

    expect((await api().delete(`/api/products/${loaf!.id}`)).status).toBe(204);
    expect((await api().get(`/api/products/${loaf!.id}`)).status).toBe(404);
    expect(await db().select().from(products).where(eq(products.id, loaf!.id))).toEqual([]);
    expect((await api().delete(`/api/products/${loaf!.id}`)).status).toBe(404);
    expect((await api().patch('/api/products/999999').send({ stock: 1 })).status).toBe(404);
  });
});
