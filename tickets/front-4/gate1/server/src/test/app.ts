import request from 'supertest';
import { afterAll, beforeAll } from 'vitest';
import { createApp } from '../app.ts';
import type { Db } from '../db.ts';
import { testDatabase } from './database.ts';

/**
 * The API over the test database, for one test file. `lines` collects what the server logged;
 * `api()` is a supertest agent of the app.
 */
export function useApi(): { api: () => ReturnType<typeof request>; db: () => Db; lines: string[] } {
  let db: Db;
  let close: () => Promise<void>;
  let app: ReturnType<typeof createApp>;
  const lines: string[] = [];

  beforeAll(async () => {
    ({ db, close } = await testDatabase());
    app = createApp({ db, log: (line) => lines.push(line) });
  });

  afterAll(async () => {
    await close();
  });

  return { api: () => request(app), db: () => db, lines };
}

/** The order of the list by name: letters in lower case, then plain character order. */
export const byName = (a: string, b: string): number => (a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : 0);
