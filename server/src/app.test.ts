import { describe, expect, it } from 'vitest';
import { useApi } from './test/app.ts';

const { api } = useApi();

describe('Host header', () => {
  it.each(['localhost:3001', '127.0.0.1:3001', '[::1]:3001', 'localhost', 'LOCALHOST:3001'])('answers %s', async (host) => {
    const response = await api().get('/api/categories').set('Host', host);

    expect(response.status).toBe(200);
  });

  it.each(['example.invalid', 'example.invalid:3001', 'localhost.evil.test', '10.0.0.5:3001', ''])('refuses %j with 403', async (host) => {
    const response = await api().get('/api/categories').set('Host', host);

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: 'Forbidden host' });
  });
});

describe('GET /api/categories', () => {
  it('lists the categories by name', async () => {
    const response = await api().get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.body.map((category: { name: string }) => category.name)).toEqual([
      'Bakery',
      'Dairy',
      'Drinks',
      'Frozen',
      'Household',
      'Pantry',
      'Produce',
      'Snacks',
    ]);
    expect(response.body[0]).toEqual({ id: expect.any(Number), name: 'Bakery', slug: 'bakery' });
  });
});

describe('errors', () => {
  it('answers 404 in JSON for an unknown API path', async () => {
    const response = await api().get('/api/nothing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Not found' });
  });

  it('answers 400 for a body that is not JSON', async () => {
    const response = await api().post('/api/products').set('Content-Type', 'application/json').send('{');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Request body must be valid JSON');
  });
});
