import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

const cards = () => screen.findAllByTestId('product-card');
const nameOf = (card: HTMLElement) => within(card).getByTestId('product-name').textContent;
const cardOf = async (name: string) => (await cards()).find((card) => nameOf(card) === name)!;

/** Picks the third photo of the loaf, the only product of the test shop with more than one. */
async function pickThirdPhotoOfTheLoaf() {
  const loaf = await cardOf('Sourdough Loaf');
  await userEvent.click(within(loaf).getByRole('button', { name: 'Photo 3' }));
  expect(within(loaf).getByRole('img', { name: 'Sourdough Loaf' })).toHaveAttribute('src', '/images/loaf-3.svg');
}

async function expectTheLoafOnItsThirdPhoto() {
  const loaf = await cardOf('Sourdough Loaf');
  expect(within(loaf).getByRole('img', { name: 'Sourdough Loaf' })).toHaveAttribute('src', '/images/loaf-3.svg');
  expect(within(loaf).getByRole('button', { name: 'Photo 3' })).toHaveAttribute('aria-pressed', 'true');
}

describe('the photo picked on a card', () => {
  it('stays with its product when the order of the list changes', async () => {
    mockApi();
    renderApp('/');
    await pickThirdPhotoOfTheLoaf();

    await userEvent.selectOptions(screen.getByLabelText('Sort by'), 'Newest');

    await waitFor(async () => expect(nameOf((await cards())[0]!)).toBe('Umbrella'));
    await expectTheLoafOnItsThirdPhoto();
  });

  it('stays with its product when the list is filtered', async () => {
    mockApi();
    renderApp('/');
    await pickThirdPhotoOfTheLoaf();

    await userEvent.type(screen.getByLabelText('Search'), 'o');

    await waitFor(async () => expect(await cards()).toHaveLength(3));
    await expectTheLoafOnItsThirdPhoto();
  });
});
