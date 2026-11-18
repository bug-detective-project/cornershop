import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from './types.ts';

/** A request the client got wrong: answered with 400 and the message of each bad field. */
export class ValidationError extends Error {
  fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string>) {
    super(message);
    this.fields = fields;
  }
}

export interface ListQuery {
  page: number;
  pageSize: number;
  category?: string;
  q?: string;
}

const text = (value: unknown): string | undefined => (typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined);
const wholeNumber = (value: unknown): number | undefined => (typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : undefined);

/** Reads the query string of the product list. */
export function parseListQuery(query: Record<string, unknown>): ListQuery {
  const fields: Record<string, string> = {};

  let page = 1;
  if (query.page !== undefined) {
    const value = wholeNumber(query.page);
    if (value === undefined || value < 1) {
      fields.page = 'page must be a whole number, 1 or more';
    } else {
      page = value;
    }
  }

  let pageSize = DEFAULT_PAGE_SIZE;
  if (query.pageSize !== undefined) {
    const value = wholeNumber(query.pageSize);
    if (value === undefined || value < 1 || value > MAX_PAGE_SIZE) {
      fields.pageSize = `pageSize must be a whole number from 1 to ${MAX_PAGE_SIZE}`;
    } else {
      pageSize = value;
    }
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError('Invalid query', fields);
  }
  return { page, pageSize, category: text(query.category), q: text(query.q) };
}

export interface ProductInput {
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  categoryId: number | null;
}

/** A PostgreSQL integer holds this much. */
const MAX_INTEGER = 2_147_483_647;
const MAX_NAME = 120;
const MAX_DESCRIPTION = 2000;

const isCount = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= 0 && (value as number) <= MAX_INTEGER;

/**
 * Reads the body of a product. With `partial`, only the fields that were sent are checked and
 * returned (a change); without it, name, price and stock are required (a new product).
 */
export function parseProduct(body: unknown, options: { partial: true }): Partial<ProductInput>;
export function parseProduct(body: unknown, options?: { partial?: false }): ProductInput;
export function parseProduct(body: unknown, options: { partial?: boolean } = {}): Partial<ProductInput> {
  const input = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  const sent = (field: string): boolean => !options.partial || field in input;
  const fields: Record<string, string> = {};
  const product: Partial<ProductInput> = {};

  if (sent('name')) {
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    if (name === '' || name.length > MAX_NAME) {
      fields.name = `name is required, up to ${MAX_NAME} characters`;
    } else {
      product.name = name;
    }
  }

  if (sent('description')) {
    const description = input.description ?? '';
    if (typeof description !== 'string' || description.length > MAX_DESCRIPTION) {
      fields.description = `description must be text, up to ${MAX_DESCRIPTION} characters`;
    } else {
      product.description = description.trim();
    }
  }

  if (sent('priceCents')) {
    if (!isCount(input.priceCents)) {
      fields.priceCents = 'priceCents must be a whole number of cents, 0 or more';
    } else {
      product.priceCents = input.priceCents;
    }
  }

  if (sent('stock')) {
    if (!isCount(input.stock)) {
      fields.stock = 'stock must be a whole number, 0 or more';
    } else {
      product.stock = input.stock;
    }
  }

  if (sent('categoryId')) {
    const categoryId = input.categoryId ?? null;
    if (categoryId !== null && !(Number.isInteger(categoryId) && (categoryId as number) > 0)) {
      fields.categoryId = 'categoryId must be the id of a category, or null';
    } else {
      product.categoryId = categoryId as number | null;
    }
  }

  if (Object.keys(fields).length > 0) {
    throw new ValidationError('Invalid product', fields);
  }
  return product;
}
