import { expect, test } from '@playwright/test';
import { serverLog } from '../../../support/app.ts';

const ID = /^[A-Za-z0-9-]{8,64}$/;
/** An id no other request of this run uses. */
const newId = (label: string) => `qa-${label}-${Date.now().toString(36)}`;
/** The log line of the request that carried this id. */
const lineOf = (id: string) => serverLog().find((line) => line.requestId === id && 'status' in line);

test.describe('Ticket back-5: every request has an id, in the answer and in the log', () => {
  test('every answer carries an X-Request-Id header', async ({ request }) => {
    for (const path of ['/api/categories', '/api/products', '/api/products/999999', '/api/products?page=0', '/api/nothing']) {
      const response = await request.get(path);
      expect(response.headers()['x-request-id'], `X-Request-Id of GET ${path} (${response.status()})`).toMatch(ID);
    }
  });

  test('two requests get two different ids', async ({ request }) => {
    const ids = await Promise.all([1, 2, 3, 4].map(async () => (await request.get('/api/categories')).headers()['x-request-id']));

    expect(new Set(ids).size).toBe(4);
  });

  test('an id sent by the caller is used, in the answer and in the log', async ({ request }) => {
    const id = newId('sent');

    const response = await request.get('/api/categories', { headers: { 'X-Request-Id': id } });

    expect(response.headers()['x-request-id']).toBe(id);
    await expect.poll(() => lineOf(id), 'the log line of the request').toMatchObject({ requestId: id, method: 'GET', path: '/api/categories', status: 200 });
  });

  for (const sent of ['short', 'has spaces in it', 'x'.repeat(65), 'semi;colon-12345']) {
    test(`an id that is not plain (${JSON.stringify(sent.slice(0, 20))}) is replaced by a new one`, async ({ request }) => {
      const response = await request.get('/api/categories', { headers: { 'X-Request-Id': sent } });

      expect(response.headers()['x-request-id']).toMatch(ID);
      expect(response.headers()['x-request-id']).not.toBe(sent);
    });
  }

  test('the id in the log is the id of the answer, also for a request that fails', async ({ request }) => {
    const ok = await request.get('/api/products?pageSize=3');
    const notFound = await request.get('/api/products/999999');
    const bad = await request.post('/api/products', { data: { name: '' } });

    for (const [response, path, status] of [
      [ok, '/api/products', 200],
      [notFound, '/api/products/999999', 404],
      [bad, '/api/products', 400],
    ] as const) {
      const id = response.headers()['x-request-id']!;
      expect(id).toMatch(ID);
      await expect.poll(() => lineOf(id), `the log line of ${path} (${status})`).toMatchObject({ requestId: id, path, status });
    }
  });

  test('every request line of the log has an id', async ({ request }) => {
    const id = newId('last');
    await request.get('/api/categories', { headers: { 'X-Request-Id': id } });
    await expect.poll(() => lineOf(id)).toBeTruthy();

    const requests = serverLog().filter((line) => 'method' in line && 'status' in line);
    expect(requests.length).toBeGreaterThan(0);
    for (const line of requests) {
      expect(String(line.requestId), `log line ${JSON.stringify(line)}`).toMatch(ID);
    }
  });

  test('the log line keeps what it already had', async ({ request }) => {
    const id = newId('shape');
    await request.get('/api/products?q=bread', { headers: { 'X-Request-Id': id } });

    await expect.poll(() => lineOf(id)).toBeTruthy();
    const line = lineOf(id)!;
    expect(line).toMatchObject({ method: 'GET', path: '/api/products', status: 200 });
    expect(typeof line.durationMs).toBe('number');
  });
});
