import { readFileSync } from 'node:fs';
import { expect } from '@playwright/test';
import type { APIRequestContext, Locator, Page } from '@playwright/test';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  category: Category | null;
  images: string[];
  createdAt: string;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

type Query = Record<string, string | number>;

/** One page of GET /api/products. */
export async function listProducts(request: APIRequestContext, params: Query = {}): Promise<ProductPage> {
  const response = await request.get('/api/products', { params });
  expect(response.status(), `GET /api/products ${JSON.stringify(params)}`).toBe(200);
  return response.json();
}

/** Every product that matches, walking the pages of 50. */
export async function allProducts(request: APIRequestContext, params: Query = {}): Promise<Product[]> {
  const items: Product[] = [];
  for (let page = 1; ; page += 1) {
    const result = await listProducts(request, { ...params, pageSize: 50, page });
    items.push(...result.items);
    if (result.items.length === 0 || items.length >= result.total) {
      return items;
    }
  }
}

/** The one product with this exact name in the sample shop. */
export async function productNamed(request: APIRequestContext, name: string): Promise<Product> {
  const found = (await allProducts(request, { q: name })).filter((product) => product.name === name);
  expect(found, `products named "${name}"`).toHaveLength(1);
  return found[0]!;
}

export async function getProduct(request: APIRequestContext, id: number): Promise<Product> {
  const response = await request.get(`/api/products/${id}`);
  expect(response.status(), `GET /api/products/${id}`).toBe(200);
  return response.json();
}

/** The cards of the storefront, once the list is on screen. */
export async function cards(page: Page): Promise<Locator> {
  const all = page.getByTestId('product-card');
  await expect(all.first()).toBeVisible();
  return all;
}

/** The card of the storefront that shows this product. */
export function cardOf(page: Page, name: string): Locator {
  return page.getByTestId('product-card').filter({ has: page.getByTestId('product-name').getByText(name, { exact: true }) });
}

/** The names of the cards on screen, in order. */
export async function namesShown(page: Page): Promise<string[]> {
  return (await cards(page)).getByTestId('product-name').allTextContents();
}

/** The row of the owner panel that shows this product. */
export function adminRow(page: Page, name: string): Locator {
  return page.getByTestId('admin-product').filter({ has: page.getByTestId('admin-product-name').getByText(name, { exact: true }) });
}

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where an element is on the page; fails when it is not rendered. */
export async function boxOf(locator: Locator, what: string): Promise<Box> {
  const box = await locator.boundingBox();
  expect(box, `${what} must be on the page`).not.toBeNull();
  return box!;
}

/** True when the two boxes share at least one pixel (half a pixel of rounding is forgiven). */
export function overlap(a: Box, b: Box): boolean {
  const slack = 0.5;
  return a.x + a.width > b.x + slack && b.x + b.width > a.x + slack && a.y + a.height > b.y + slack && b.y + b.height > a.y + slack;
}

/** True when `inner` lies inside `outer` (half a pixel of rounding is forgiven). */
export function inside(inner: Box, outer: Box): boolean {
  const slack = 0.5;
  return (
    inner.x >= outer.x - slack &&
    inner.y >= outer.y - slack &&
    inner.x + inner.width <= outer.x + outer.width + slack &&
    inner.y + inner.height <= outer.y + outer.height + slack
  );
}

/** Waits until the browser has rendered at least two more frames. */
export async function settle(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

/** The JSON lines the API wrote to its output so far (other lines, such as the start-up one, are left out). */
export function serverLog(): Record<string, unknown>[] {
  const file = process.env.QA_SERVER_LOG;
  if (!file) {
    throw new Error('QA_SERVER_LOG must be set. Run the suite through `npm run qa`.');
  }
  return readFileSync(file, 'utf8')
    .split('\n')
    .flatMap((line) => {
      try {
        const parsed: unknown = JSON.parse(line);
        return typeof parsed === 'object' && parsed !== null ? [parsed as Record<string, unknown>] : [];
      } catch {
        return [];
      }
    });
}
