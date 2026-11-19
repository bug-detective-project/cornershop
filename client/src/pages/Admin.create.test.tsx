import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

const rows = async () => (await screen.findAllByTestId('admin-product')).map((row) => within(row).getByTestId('admin-product-name').textContent);

async function createFigJam() {
  await userEvent.type(screen.getByLabelText('Name'), 'Fig Jam');
  await userEvent.type(screen.getByLabelText('Description'), 'Small batch.');
  await userEvent.type(screen.getByLabelText('Price'), '6.75');
  await userEvent.clear(screen.getByLabelText('Stock'));
  await userEvent.type(screen.getByLabelText('Stock'), '5');
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Product created');
}

describe('a new product', () => {
  it('is sent to the API with its price in cents', async () => {
    const { requests } = mockApi();
    renderApp('/admin');
    await rows();

    await createFigJam();

    expect(requests.find((request) => request.method === 'POST')!.body).toEqual({
      name: 'Fig Jam',
      description: 'Small batch.',
      priceCents: 675,
      stock: 5,
      categoryId: null,
    });
  });

  it('shows up in the list of the panel at once, without a reload', async () => {
    mockApi();
    renderApp('/admin');
    await rows();

    await createFigJam();

    await waitFor(async () => expect((await rows())[0]).toBe('Fig Jam'));
  });

  it('shows up in the storefront when the owner goes there from the panel', async () => {
    mockApi();
    renderApp('/');
    // The storefront was already loaded once: its list is in the cache.
    await screen.findAllByTestId('product-card');
    await userEvent.click(screen.getByRole('link', { name: 'Admin' }));
    await rows();

    await createFigJam();
    await userEvent.click(screen.getByRole('link', { name: 'Shop' }));

    await waitFor(async () => {
      const names = (await screen.findAllByTestId('product-card')).map((card) => within(card).getByTestId('product-name').textContent);
      expect(names).toContain('Fig Jam');
    });
  });
});
