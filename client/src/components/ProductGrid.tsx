import type { Product } from '../api/types.ts';
import { ProductCard } from './ProductCard.tsx';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    // As many columns as fit. A column is at least 18rem wide, but never wider than the grid.
    <ul data-testid="product-grid" className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
