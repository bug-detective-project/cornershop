import { and, asc, count, desc, eq, gte, ilike, inArray, lte, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import type { Db } from './db.ts';
import { categories, productImages, products } from './schema.ts';
import type { Category, Product, ProductPage, Sort } from './types.ts';
import type { ListQuery, ProductInput } from './validation.ts';

type ProductRow = typeof products.$inferSelect;
type CategoryRow = typeof categories.$inferSelect;

export async function listCategories(db: Db): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.name));
}

export async function categoryExists(db: Db, id: number): Promise<boolean> {
  return (await db.select({ id: categories.id }).from(categories).where(eq(categories.id, id))).length > 0;
}

/** A product as the list shows it. */
function toListItem(product: ProductRow, category: CategoryRow | null, images: string[]): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    stock: product.stock,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    images,
    createdAt: product.createdAt.toISOString(),
  };
}

/** A product as its own page shows it. */
function toDetail(product: ProductRow, category: CategoryRow | null, images: string[]): Product {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    stock: product.stock,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    images,
    createdAt: product.createdAt.toISOString(),
  };
}

/** The photos of each product, in order. */
async function imagesOf(db: Db, ids: number[]): Promise<Map<number, string[]>> {
  const byProduct = new Map<number, string[]>();
  if (ids.length === 0) {
    return byProduct;
  }
  const rows = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(asc(productImages.position), asc(productImages.id));
  for (const row of rows) {
    byProduct.set(row.productId, [...(byProduct.get(row.productId) ?? []), row.path]);
  }
  return byProduct;
}

/** Letters in lower case, then plain character order: the same on every machine. */
const byName = sql`lower(${products.name}) collate "C"`;

/** Products that tie in the chosen order always come by id, so a page never depends on luck. */
const ORDERS: Record<Sort, SQL[]> = {
  name: [asc(byName), asc(products.id)],
  price_asc: [asc(products.priceCents), asc(products.id)],
  price_desc: [desc(products.priceCents), asc(products.id)],
  newest: [desc(products.createdAt), asc(products.id)],
};

/** In a LIKE pattern, % and _ mean "anything": what the shopper typed is plain text. */
const escapeLike = (text: string): string => text.replace(/[\\%_]/g, (character) => `\\${character}`);

export async function listProducts(db: Db, query: ListQuery): Promise<ProductPage> {
  const { page, pageSize } = query;
  const filters: SQL[] = [];
  if (query.category) {
    filters.push(eq(categories.slug, query.category));
  }
  if (query.q) {
    filters.push(ilike(products.name, `%${escapeLike(query.q)}%`));
  }
  if (query.minPrice !== undefined) {
    filters.push(gte(products.priceCents, query.minPrice));
  }
  if (query.maxPrice !== undefined) {
    filters.push(lte(products.priceCents, query.maxPrice));
  }
  const where = and(...filters);

  const [counted] = await db
    .select({ total: count() })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(where);

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(where)
    .orderBy(...ORDERS[query.sort])
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const images = await imagesOf(
    db,
    rows.map((row) => row.product.id),
  );
  return {
    items: rows.map((row) => toListItem(row.product, row.category, images.get(row.product.id) ?? [])),
    total: counted!.total,
    page,
    pageSize,
  };
}

export async function findProduct(db: Db, id: number): Promise<Product | undefined> {
  const [row] = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id));
  if (!row) {
    return undefined;
  }
  const images = await imagesOf(db, [id]);
  return toDetail(row.product, row.category, images.get(id) ?? []);
}

export async function createProduct(db: Db, input: ProductInput): Promise<Product> {
  const [created] = await db.insert(products).values(input).returning({ id: products.id });
  return (await findProduct(db, created!.id))!;
}

export async function updateProduct(db: Db, id: number, changes: Partial<ProductInput>): Promise<Product | undefined> {
  if (Object.keys(changes).length > 0) {
    await db.update(products).set(changes).where(eq(products.id, id));
  }
  return findProduct(db, id);
}

export async function deleteProduct(db: Db, id: number): Promise<boolean> {
  return (await db.delete(products).where(eq(products.id, id)).returning({ id: products.id })).length > 0;
}
