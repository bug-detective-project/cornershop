import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { count } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { databaseUrl } from './config.ts';
import { resetDatabase } from './db.ts';
import type { Db } from './db.ts';
import { categories, productImages, products } from './schema.ts';
import { TEST_DATABASE, testDatabase } from './test/database.ts';

let db: Db;
let close: () => Promise<void>;

beforeAll(async () => {
  ({ db, close } = await testDatabase());
});

afterAll(async () => {
  await close();
});

const total = async (table: typeof categories | typeof products | typeof productImages) =>
  (await db.select({ value: count() }).from(table))[0]!.value;

describe('the database', () => {
  it('has the sample shop after a reset, and the same one after another', async () => {
    const snapshot = async () => ({
      categories: await total(categories),
      products: await total(products),
      images: await total(productImages),
      first: (await db.select().from(products).orderBy(products.id).limit(3)).map((row) => [row.id, row.name, row.priceCents]),
    });
    const before = await snapshot();
    expect(before.categories).toBe(8);
    expect(before.products).toBe(60);
    expect(before.images).toBeGreaterThan(50);

    await resetDatabase(db);
    expect(await snapshot()).toEqual(before);
  });

  it('keeps the cases the shop needs: no category, no photo, a long name and whole cents', async () => {
    const rows = await db.select().from(products);
    const images = await db.select().from(productImages);
    const withPhoto = new Set(images.map((image) => image.productId));

    expect(rows.filter((row) => row.categoryId === null)).toHaveLength(6);
    expect(rows.filter((row) => !withPhoto.has(row.id))).toHaveLength(8);
    expect(rows.some((row) => row.name.length > 60)).toBe(true);
    expect(rows.every((row) => Number.isInteger(row.priceCents) && row.priceCents >= 95 && row.priceCents <= 12900)).toBe(true);

    const loaf = rows.find((row) => row.name === 'Sourdough Loaf')!;
    expect(loaf.priceCents).toBe(450);
    expect(images.filter((image) => image.productId === loaf.id)).toHaveLength(3);
  });

  it('runs the tests in a database of their own, never in the one the player works with', async () => {
    const [row] = (await db.execute('select current_database() as name')).rows;
    expect(row!.name).toBe(TEST_DATABASE);
    expect(TEST_DATABASE).toBe('cornershop_test');
    expect(new URL(databaseUrl()).pathname).not.toBe(`/${TEST_DATABASE}`);
  });
});

describe('databaseUrl', () => {
  it('says what is missing when DATABASE_URL is not set', () => {
    expect(() => databaseUrl({})).toThrow(/DATABASE_URL is not set/);
    expect(databaseUrl({ DATABASE_URL: 'postgres://u:p@db:5432/shop' })).toBe('postgres://u:p@db:5432/shop');
  });
});

describe('npm run db:reset', () => {
  const reset = (env: Record<string, string>) =>
    spawnSync(process.execPath, [fileURLToPath(new URL('./scripts/reset-db.ts', import.meta.url))], {
      encoding: 'utf8',
      env: { PATH: process.env.PATH, ...env },
    });

  it('says so in one line when the database is not running', () => {
    // Port 9 (discard) has no PostgreSQL behind it.
    const result = reset({ DATABASE_URL: 'postgres://postgres:x@127.0.0.1:9/cornershop' });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/^Could not reset the database: .+\n$/);
  });

  it('says what is missing without DATABASE_URL', () => {
    const result = reset({});
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('DATABASE_URL is not set');
  });
});
