import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

/** The select, once the categories arrived. */
const categorySelect = async () => {
  await screen.findByRole('option', { name: 'Bakery' });
  return screen.getByLabelText('Category');
};
const namesShown = async () => (await screen.findAllByTestId('product-card')).map((card) => within(card).getByTestId('product-name').textContent);

describe('the category filter', () => {
  it('puts the chosen category in the URL', async () => {
    mockApi();
    renderApp('/');
    await namesShown();

    await userEvent.selectOptions(await categorySelect(), 'Bakery');

    await waitFor(async () => expect(await namesShown()).toEqual(['Butter Croissant', 'Sourdough Loaf']));
    expect(screen.getByTestId('location')).toHaveTextContent('/?category=bakery');
  });

  it('reads the category from the URL: a shared link and a reload show the same shelf', async () => {
    mockApi();
    renderApp('/?category=dairy');

    expect(await namesShown()).toEqual(['Aged Cheddar', 'Whole Milk']);
    await waitFor(() => expect(screen.getByLabelText('Category')).toHaveValue('dairy'));
  });

  it('keeps the search and goes back to the first page', async () => {
    mockApi();
    renderApp('/?q=o&page=2');

    await userEvent.selectOptions(await categorySelect(), 'Bakery');

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('/?q=o&category=bakery'));
  });

  it('leaves the URL clean when every category is chosen again', async () => {
    mockApi();
    renderApp('/?category=dairy');

    await userEvent.selectOptions(await categorySelect(), 'All categories');

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/));
    expect(await namesShown()).toHaveLength(5);
  });
});
