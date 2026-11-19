import { beforeEach, describe, expect, it } from 'vitest';
import { useApi } from './test/app.ts';

const { api, lines } = useApi();

const entries = () => lines.map((line) => JSON.parse(line) as Record<string, unknown>);

describe('the request log', () => {
  beforeEach(() => {
    lines.length = 0;
  });

  it('writes one JSON line per request, with the method, the path, the status and the duration', async () => {
    await api().get('/api/categories');

    expect(entries()).toHaveLength(1);
    expect(entries()[0]).toMatchObject({ method: 'GET', path: '/api/categories', status: 200 });
    expect(entries()[0]!.durationMs).toEqual(expect.any(Number));
  });

  it('logs the path without the query, and the status of an error', async () => {
    await api().get('/api/products').query({ q: 'bread', page: 0 });
    await api().get('/api/products/999999');

    expect(entries().map((entry) => [entry.path, entry.status])).toEqual([
      ['/api/products', 400],
      ['/api/products/999999', 404],
    ]);
  });

  it('logs a refused host too', async () => {
    await api().get('/api/categories').set('Host', 'example.invalid');

    expect(entries()[0]).toMatchObject({ status: 403 });
  });
});
