import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

const cards = () => screen.findAllByTestId('product-card');
const nameOf = (card: HTMLElement) => within(card).getByTestId('product-name').textContent;
/** The names of the cards whose details are open. */
const open = async () => (await cards()).filter((card) => within(card).queryByTestId('product-description')).map(nameOf);

describe('the details of a card', () => {
  it('open and close on the card that was clicked', async () => {
    mockApi();
    renderApp('/');
    const loaf = (await cards()).find((card) => nameOf(card) === 'Sourdough Loaf')!;

    await userEvent.click(within(loaf).getByRole('button', { name: 'Details' }));
    expect(within(loaf).getByTestId('product-description')).toHaveTextContent('About Sourdough Loaf.');
    expect(await open()).toEqual(['Sourdough Loaf']);

    await userEvent.click(within(loaf).getByRole('button', { name: 'Details' }));
    expect(await open()).toEqual([]);
  });

  it('stay with their product when the order of the list changes', async () => {
    mockApi();
    renderApp('/');
    const loaf = (await cards()).find((card) => nameOf(card) === 'Sourdough Loaf')!;
    await userEvent.click(within(loaf).getByRole('button', { name: 'Details' }));

    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'Price: low to high');
    await waitFor(async () => expect(nameOf((await cards())[0]!)).toBe('Whole Milk'));
    expect(await open()).toEqual(['Sourdough Loaf']);

    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'Price: high to low');
    await waitFor(async () => expect(nameOf((await cards())[0]!)).toBe('Umbrella'));
    expect(await open()).toEqual(['Sourdough Loaf']);
  });

  it('stay with their product when the list is filtered', async () => {
    mockApi();
    renderApp('/');
    const loaf = (await cards()).find((card) => nameOf(card) === 'Sourdough Loaf')!;
    await userEvent.click(within(loaf).getByRole('button', { name: 'Details' }));

    await userEvent.type(screen.getByLabelText('Search'), 'o');

    await waitFor(async () => expect(await cards()).toHaveLength(3));
    expect(await open()).toEqual(['Sourdough Loaf']);
  });
});
