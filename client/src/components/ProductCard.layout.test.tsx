import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { createTestProducts } from '../test/mockApi.ts';
import { ProductCard } from './ProductCard.tsx';

// The test environment has no layout engine, so this checks the classes that make the layout
// hold: a long name must be able to shrink, and the price must not.
describe('the name and the price of a card', () => {
  it('share one line where the name gives way and the price keeps its width', () => {
    const product = { ...createTestProducts()[0]!, name: 'Grandma Lucia\'s Slow-Fermented Whole Wheat Sourdough Country Loaf (Large)' };
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    );

    const name = screen.getByTestId('product-name');
    const price = screen.getByTestId('product-price');
    expect(name.parentElement).toBe(price.parentElement);
    expect(name.parentElement).toHaveClass('flex');
    expect(name).toHaveClass('min-w-0', 'truncate');
    expect(price).toHaveClass('shrink-0');
    // The whole name is still there for a pointer and for a screen reader.
    expect(name).toHaveAttribute('title', product.name);
  });
});
