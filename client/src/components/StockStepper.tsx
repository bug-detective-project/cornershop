import { useUpdateProduct } from '../api/products.ts';
import type { Product } from '../api/types.ts';

/** The stock of a product with a button to take one out and a button to add one; each click is saved. */
export function StockStepper({ product }: { product: Product }) {
  const update = useUpdateProduct();
  const change = (by: number) => update.mutate({ id: product.id, changes: { stock: product.stock + by } });

  return (
    <div className="flex items-center gap-2">
      <button type="button" className="button px-2 py-0.5" aria-label={`Decrease stock of ${product.name}`} disabled={product.stock === 0} onClick={() => change(-1)}>
        −
      </button>
      <span data-testid="stock-value" className="min-w-8 text-center tabular-nums">
        {product.stock}
      </span>
      <button type="button" className="button px-2 py-0.5" aria-label={`Increase stock of ${product.name}`} onClick={() => change(1)}>
        +
      </button>
    </div>
  );
}
