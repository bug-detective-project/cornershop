import { vi } from 'vitest';
import type { Category, Product } from '../api/types.ts';

export const testCategories: Category[] = [
  { id: 1, name: 'Bakery', slug: 'bakery' },
  { id: 2, name: 'Dairy', slug: 'dairy' },
];

function product(id: number, name: string, priceCents: number, categoryId: number | null, overrides: Partial<Product> = {}): Product {
  return {
    id,
    name,
    description: `About ${name}.`,
    priceCents,
    stock: 5,
    category: testCategories.find((category) => category.id === categoryId) ?? null,
    images: [`/images/product-${id}-1.svg`],
    createdAt: new Date(Date.UTC(2026, 0, 5, 9, id)).toISOString(),
    ...overrides,
  };
}

export function createTestProducts(): Product[] {
  return [
    product(1, 'Sourdough Loaf', 450, 1, { images: ['/images/loaf-1.svg', '/images/loaf-2.svg', '/images/loaf-3.svg'] }),
    product(2, 'Butter Croissant', 275, 1),
    product(3, 'Whole Milk', 189, 2),
    product(4, 'Aged Cheddar', 725, 2, { stock: 0 }),
    product(5, 'Umbrella', 1890, null, { images: [] }),
  ];
}

export interface MockRequest {
  method: string;
  path: string;
  search: URLSearchParams;
  body: unknown;
}

export interface MockApiOptions {
  products?: Product[];
  /** Return a response to override the default handling of a request. */
  respond?: (request: MockRequest) => Response | undefined | Promise<Response | undefined>;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

const SORTS: Record<string, (a: Product, b: Product) => number> = {
  name: (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) || a.id - b.id,
  price_asc: (a, b) => a.priceCents - b.priceCents || a.id - b.id,
  price_desc: (a, b) => b.priceCents - a.priceCents || a.id - b.id,
  newest: (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt) || a.id - b.id,
};

/**
 * Replaces fetch with a small in-memory copy of the API: the list filters, sorts and pages like
 * the real one. `requests` records every call the client made.
 */
export function mockApi(options: MockApiOptions = {}) {
  const products = options.products ?? createTestProducts();
  const requests: MockRequest[] = [];

  const handle = (request: MockRequest): Response => {
    const { method, path, search } = request;
    if (method === 'GET' && path === '/api/categories') {
      return json(testCategories);
    }
    if (method === 'GET' && path === '/api/products') {
      const q = (search.get('q') ?? '').toLowerCase();
      const category = search.get('category');
      const min = search.get('minPrice');
      const max = search.get('maxPrice');
      const matching = products
        .filter((item) => item.name.toLowerCase().includes(q))
        .filter((item) => !category || item.category?.slug === category)
        .filter((item) => min === null || item.priceCents >= Number(min))
        .filter((item) => max === null || item.priceCents <= Number(max))
        .sort(SORTS[search.get('sort') ?? 'name']);
      const page = Number(search.get('page') ?? 1);
      const pageSize = Number(search.get('pageSize') ?? 10);
      return json({ items: matching.slice((page - 1) * pageSize, page * pageSize), total: matching.length, page, pageSize });
    }
    const id = Number(/^\/api\/products\/(\d+)$/.exec(path)?.[1]);
    const index = products.findIndex((item) => item.id === id);
    if (method === 'POST' && path === '/api/products') {
      const body = request.body as Partial<Product> & { categoryId?: number | null };
      const created = product(Math.max(0, ...products.map((item) => item.id)) + 1, body.name ?? '', body.priceCents ?? 0, body.categoryId ?? null, {
        description: body.description ?? '',
        stock: body.stock ?? 0,
        images: [],
      });
      products.push(created);
      return json(created, 201);
    }
    if (Number.isNaN(id) || index === -1) {
      return json({ error: path.startsWith('/api/products/') ? 'Product not found' : 'Not found' }, 404);
    }
    if (method === 'GET') {
      return json(products[index]);
    }
    if (method === 'PATCH') {
      const { categoryId, ...changes } = request.body as Partial<Product> & { categoryId?: number | null };
      products[index] = {
        ...products[index]!,
        ...changes,
        ...(categoryId !== undefined && { category: testCategories.find((category) => category.id === categoryId) ?? null }),
      };
      return json(products[index]);
    }
    if (method === 'DELETE') {
      products.splice(index, 1);
      return new Response(null, { status: 204 });
    }
    return json({ error: 'Not found' }, 404);
  };

  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = new URL(String(input), 'http://localhost');
      const request: MockRequest = {
        method: init?.method ?? 'GET',
        path: url.pathname,
        search: url.searchParams,
        body: typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
      };
      requests.push(request);
      return (await options.respond?.(request)) ?? handle(request);
    }),
  );

  return { products, requests };
}
