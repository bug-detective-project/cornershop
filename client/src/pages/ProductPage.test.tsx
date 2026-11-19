import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { mockApi } from '../test/mockApi.ts';
import { renderApp } from '../test/renderApp.tsx';

describe('the product page', () => {
  it('shows the name, the price, the category, the stock and the description', async () => {
    mockApi();
    renderApp('/products/1');

    expect(await screen.findByRole('heading', { level: 1, name: 'Sourdough Loaf' })).toBeInTheDocument();
    expect(screen.getByTestId('product-price')).toHaveTextContent('$4.50');
    expect(screen.getByText('Bakery')).toBeInTheDocument();
    expect(screen.getByText('In stock')).toBeInTheDocument();
    expect(screen.getByText('About Sourdough Loaf.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the shop' })).toHaveAttribute('href', '/');
  });

  it('says when a product is out of stock, and when it has no category', async () => {
    mockApi();
    renderApp('/products/4');
    expect(await screen.findByText('Out of stock')).toBeInTheDocument();
    expect(screen.queryByText('In stock')).not.toBeInTheDocument();
  });

  it('shows the first photo, and one thumbnail button per photo', async () => {
    mockApi();
    renderApp('/products/1');

    expect(await screen.findByTestId('gallery-main')).toHaveAttribute('src', '/images/loaf-1.svg');
    expect(screen.getByTestId('gallery-main')).toHaveAttribute('alt', 'Sourdough Loaf');
    const thumbnails = screen.getAllByRole('button', { name: /^Show photo \d$/ });
    expect(thumbnails.map((button) => button.getAttribute('aria-label'))).toEqual(['Show photo 1', 'Show photo 2', 'Show photo 3']);
    expect(thumbnails[0]).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the photo of the thumbnail that was clicked', async () => {
    mockApi();
    renderApp('/products/1');
    await screen.findByTestId('gallery-main');

    await userEvent.click(screen.getByRole('button', { name: 'Show photo 2' }));

    expect(screen.getByTestId('gallery-main')).toHaveAttribute('src', '/images/loaf-2.svg');
    expect(screen.getByRole('button', { name: 'Show photo 2' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Show photo 1' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('says so when a product has no photos', async () => {
    mockApi();
    renderApp('/products/5');

    expect(await screen.findByText('No photos yet')).toBeInTheDocument();
    expect(screen.queryByTestId('gallery-main')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Show photo/ })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Umbrella' })).toBeInTheDocument();
  });

  it('says so when the product does not exist', async () => {
    mockApi();
    renderApp('/products/999');

    expect(await screen.findByRole('heading', { name: 'Product not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to the shop' })).toHaveAttribute('href', '/');
  });

  it('opens from a card of the storefront', async () => {
    mockApi();
    renderApp('/');
    const card = (await screen.findAllByTestId('product-card')).find((item) => within(item).queryByText('Whole Milk'))!;

    await userEvent.click(within(card).getByRole('link', { name: 'Whole Milk' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Whole Milk' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/products/3');
  });
});
