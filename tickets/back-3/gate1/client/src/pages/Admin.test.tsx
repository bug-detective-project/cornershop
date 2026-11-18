import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

// What each ticket of the game breaks is tested in a file of its own (Admin.create, Admin.stock):
// the tests here hold for every ticket.

const rows = async () => (await screen.findAllByTestId('admin-product')).map((row) => within(row).getByTestId('admin-product-name').textContent);

describe('the owner panel', () => {
  it('lists the products, newest first, with their price', async () => {
    mockApi();
    renderApp('/admin');

    expect(await rows()).toEqual(['Umbrella', 'Aged Cheddar', 'Whole Milk', 'Butter Croissant', 'Sourdough Loaf']);
    expect(within((await screen.findAllByTestId('admin-product'))[0]!).getByText('$18.90')).toBeInTheDocument();
  });

  it('fills the form with the product to edit, and saves the change', async () => {
    const { requests } = mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Whole Milk' }));
    expect(screen.getByLabelText('Name')).toHaveValue('Whole Milk');
    expect(screen.getByLabelText('Price')).toHaveValue('1.89');
    expect(screen.getByLabelText('Stock')).toHaveValue(5);
    expect(screen.getByLabelText('Category', { selector: 'select' })).toHaveValue('2');

    await userEvent.clear(screen.getByLabelText('Name'));
    await userEvent.type(screen.getByLabelText('Name'), 'Whole Milk 1 L');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Product saved');
    await waitFor(async () => expect(await rows()).toContain('Whole Milk 1 L'));
    expect(requests.find((request) => request.method === 'PATCH')).toMatchObject({ path: '/api/products/3', body: { name: 'Whole Milk 1 L', categoryId: 2 } });
    // After saving, the form is ready for a new product.
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('leaves the edit with Cancel', async () => {
    mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Whole Milk' }));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('removes a product from the list', async () => {
    mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Delete Umbrella' }));

    await waitFor(async () => expect(await rows()).toEqual(['Aged Cheddar', 'Whole Milk', 'Butter Croissant', 'Sourdough Loaf']));
  });

  it('refuses a price that is not a price, before calling the API', async () => {
    const { requests } = mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.type(screen.getByLabelText('Name'), 'Fig Jam');
    await userEvent.type(screen.getByLabelText('Price'), 'cheap');
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Enter a price like 4.50')).toBeInTheDocument();
    expect(requests.some((request) => request.method === 'POST')).toBe(false);
  });

  it('shows next to each field what the API refused', async () => {
    mockApi({
      respond: (request) =>
        request.method === 'PATCH'
          ? new Response(JSON.stringify({ error: 'Invalid product', fields: { name: 'name is required, up to 120 characters' } }), { status: 400 })
          : undefined,
    });
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Edit Whole Milk' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('name is required, up to 120 characters')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
