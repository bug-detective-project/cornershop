import type { Product } from '../api/types.ts';
import { ProductCard } from './ProductCard.tsx';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    // As many columns as fit, each at least 360px wide.
    <ul data-testid="product-grid" className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
