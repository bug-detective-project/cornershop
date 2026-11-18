import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

const row = async (name: string) => (await screen.findAllByTestId('admin-product')).find((item) => within(item).getByTestId('admin-product-name').textContent === name)!;
const stockOf = async (name: string) => within(await row(name)).getByTestId('stock-value').textContent;

describe('the stock buttons of the panel', () => {
  it('are buttons that say what they do, and to which product', async () => {
    mockApi();
    renderApp('/admin');
    const milk = await row('Whole Milk');

    expect(within(milk).getByRole('button', { name: 'Increase stock of Whole Milk' })).toBeEnabled();
    expect(within(milk).getByRole('button', { name: 'Decrease stock of Whole Milk' })).toBeEnabled();
    expect(screen.getAllByRole('button', { name: /^Increase stock of / })).toHaveLength(5);
    expect(screen.getAllByRole('button', { name: /^Decrease stock of / })).toHaveLength(5);
  });

  it('change the stock with a click, and save it', async () => {
    const { requests } = mockApi();
    renderApp('/admin');
    await row('Whole Milk');

    await userEvent.click(screen.getByRole('button', { name: 'Increase stock of Whole Milk' }));

    await waitFor(async () => expect(await stockOf('Whole Milk')).toBe('6'));
    expect(requests.find((request) => request.method === 'PATCH')).toMatchObject({ path: '/api/products/3', body: { stock: 6 } });
  });

  it('are reached with Tab and work with Enter and with Space', async () => {
    mockApi();
    renderApp('/admin');
    await row('Whole Milk');
    const increase = screen.getByRole('button', { name: 'Increase stock of Whole Milk' });
    const decrease = screen.getByRole('button', { name: 'Decrease stock of Whole Milk' });

    // Tab walks the page until it lands on the button: it must be in the tab order.
    for (let presses = 0; presses < 60 && document.activeElement !== decrease; presses += 1) {
      await userEvent.tab();
    }
    expect(decrease).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await waitFor(async () => expect(await stockOf('Whole Milk')).toBe('4'));

    await userEvent.tab();
    expect(increase).toHaveFocus();
    await userEvent.keyboard(' ');
    await waitFor(async () => expect(await stockOf('Whole Milk')).toBe('5'));
  });

  it('cannot take the stock below zero', async () => {
    mockApi();
    renderApp('/admin');
    await row('Aged Cheddar');

    expect(screen.getByRole('button', { name: 'Decrease stock of Aged Cheddar' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Increase stock of Aged Cheddar' })).toBeEnabled();
  });
});
