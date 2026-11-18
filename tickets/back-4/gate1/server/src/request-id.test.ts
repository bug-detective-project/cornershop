import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { handleErrors } from './app.ts';
import { requestLog } from './log.ts';
import { useApi } from './test/app.ts';

const { api, lines } = useApi();

const entries = () => lines.map((line) => JSON.parse(line) as Record<string, unknown>);
const ID = /^[A-Za-z0-9-]{8,64}$/;

describe('the request id', () => {
  beforeEach(() => {
    lines.length = 0;
  });

  it('comes back in the X-Request-Id header of every answer', async () => {
    for (const path of ['/api/categories', '/api/products/999999', '/api/nothing']) {
      expect((await api().get(path)).headers['x-request-id']).toMatch(ID);
    }
    expect((await api().get('/api/categories').set('Host', 'example.invalid')).headers['x-request-id']).toMatch(ID);
  });

  it('is different for each request', async () => {
    const ids = await Promise.all([1, 2, 3].map(async () => (await api().get('/api/categories')).headers['x-request-id']));

    expect(new Set(ids).size).toBe(3);
  });

  it('is in the log line of its request', async () => {
    const first = await api().get('/api/categories');
    const second = await api().get('/api/products');

    expect(entries().map((entry) => [entry.path, entry.requestId])).toEqual([
      ['/api/categories', first.headers['x-request-id']],
      ['/api/products', second.headers['x-request-id']],
    ]);
  });

  it('is the one the caller sent, when it is a plain id', async () => {
    const response = await api().get('/api/categories').set('X-Request-Id', 'checkout-7f3a9c21');

    expect(response.headers['x-request-id']).toBe('checkout-7f3a9c21');
    expect(entries()[0]!.requestId).toBe('checkout-7f3a9c21');
  });

  it.each(['short', 'has spaces in it', 'x'.repeat(65), 'line\tbreak-12345', '<script>alert(1)</script>'])('is a new one when the caller sent %j', async (sent) => {
    const response = await api().get('/api/categories').set('X-Request-Id', sent);

    expect(response.headers['x-request-id']).toMatch(ID);
    expect(response.headers['x-request-id']).not.toBe(sent);
  });

  it('is in the body of a 500 and in the log line of the error', async () => {
    const logged: string[] = [];
    const app = express();
    app.use(requestLog((line) => logged.push(line)));
    app.get('/boom', () => {
      throw new Error('the shelf collapsed');
    });
    app.use(handleErrors((line) => logged.push(line)));

    const response = await request(app).get('/boom');
    const id = response.headers['x-request-id'];

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error', requestId: id });
    const parsed = logged.map((line) => JSON.parse(line) as Record<string, unknown>);
    expect(parsed.find((entry) => entry.level === 'error')).toMatchObject({ requestId: id, message: 'the shelf collapsed' });
    expect(parsed.find((entry) => entry.status === 500)).toMatchObject({ requestId: id, path: '/boom' });
  });
});
