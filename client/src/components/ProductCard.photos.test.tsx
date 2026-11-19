import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { createTestProducts } from '../test/mockApi.ts';
import { ProductCard } from './ProductCard.tsx';

const renderCard = (index: number) => {
  const product = createTestProducts()[index]!;
  render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );
  return product;
};

describe('the card of a product', () => {
  it('shows the description without a click', () => {
    renderCard(0);

    expect(screen.getByTestId('product-description')).toHaveTextContent('About Sourdough Loaf.');
    expect(screen.queryByRole('button', { name: 'Details' })).not.toBeInTheDocument();
  });

  it('switches between the photos of a product that has more than one', async () => {
    renderCard(0);
    const photo = screen.getByRole('img', { name: 'Sourdough Loaf' });
    expect(photo).toHaveAttribute('src', '/images/loaf-1.svg');

    await userEvent.click(screen.getByRole('button', { name: 'Photo 3' }));

    expect(photo).toHaveAttribute('src', '/images/loaf-3.svg');
    expect(screen.getByRole('button', { name: 'Photo 3' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Photo 1' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows no photo buttons for a product with one photo or none', () => {
    renderCard(1);
    expect(screen.queryByRole('group', { name: /Photos of/ })).not.toBeInTheDocument();
  });
});
