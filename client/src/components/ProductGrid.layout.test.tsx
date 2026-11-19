import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { createTestProducts } from '../test/mockApi.ts';
import { ProductGrid } from './ProductGrid.tsx';

// The test environment has no layout engine, so this checks the rule of the grid itself: a column
// may never be wider than the space there is.
describe('the product grid', () => {
  it('has no column with a fixed minimum width', () => {
    render(
      <MemoryRouter>
        <ProductGrid products={createTestProducts()} />
      </MemoryRouter>,
    );

    const grid = screen.getByTestId('product-grid');
    const columns = [...grid.classList].filter((name) => name.includes('grid-cols'));
    expect(columns.length).toBeGreaterThan(0);
    for (const name of columns) {
      // minmax(360px, 1fr) overflows a phone; minmax(min(100%, 18rem), 1fr) and grid-cols-1 do not.
      expect(name).not.toMatch(/minmax\(\d+(px|rem)/);
    }
  });
});
