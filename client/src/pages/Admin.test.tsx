import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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

  it('takes the owner up to the form, on the name, when a product is picked to edit', async () => {
    mockApi();
    renderApp('/admin');
    await rows();
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView');

    await userEvent.click(screen.getByRole('button', { name: 'Edit Whole Milk' }));

    const heading = screen.getByRole('heading', { name: 'Edit product' });
    expect(scroll.mock.contexts.some((element) => element instanceof Element && element.contains(heading))).toBe(true);
    expect(screen.getByLabelText('Name')).toHaveFocus();
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

  it('asks before removing a product, and removes it once confirmed', async () => {
    const { requests } = mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Delete Umbrella' }));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete product?' });
    expect(dialog).toHaveTextContent('Umbrella');
    expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(requests.some((request) => request.method === 'DELETE')).toBe(false);

    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete product' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(async () => expect(await rows()).toEqual(['Aged Cheddar', 'Whole Milk', 'Butter Croissant', 'Sourdough Loaf']));
  });

  it.each([
    ['Cancel', () => userEvent.click(screen.getByRole('button', { name: 'Cancel' }))],
    ['Escape', () => userEvent.keyboard('{Escape}')],
  ])('keeps the product when the question is dismissed with %s', async (_way, dismiss) => {
    const { requests } = mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Delete Umbrella' }));
    await dismiss();

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete Umbrella' })).toHaveFocus();
    expect(await rows()).toContain('Umbrella');
    expect(requests.some((request) => request.method === 'DELETE')).toBe(false);
  });

  it('keeps Tab inside the question while it is open', async () => {
    mockApi();
    renderApp('/admin');
    await rows();

    await userEvent.click(screen.getByRole('button', { name: 'Delete Umbrella' }));
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Delete product' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Delete product' })).toHaveFocus();
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
