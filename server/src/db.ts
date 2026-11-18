import { fileURLToPath } from 'node:url';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import * as schema from './schema.ts';
import { seedDatabase } from './seed.ts';

export type Db = NodePgDatabase<typeof schema>;

/** The SQL files written by `npm run db:generate`. */
const MIGRATIONS_FOLDER = fileURLToPath(new URL('../drizzle', import.meta.url));

export function openDatabase(url: string): { db: Db; close: () => Promise<void> } {
  const pool = new pg.Pool({ connectionString: url });
  return { db: drizzle(pool, { schema }), close: () => pool.end() };
}

/** Empties the database, creates the tables from the migrations and inserts the sample shop. */
export async function resetDatabase(db: Db): Promise<void> {
  // `drizzle` is where the migrator records what it applied.
  await db.execute(sql`drop schema if exists public cascade`);
  await db.execute(sql`drop schema if exists drizzle cascade`);
  await db.execute(sql`create schema public`);
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
  await seedDatabase(db);
}
