import { useUpdateProduct } from '../api/products.ts';
import type { Product } from '../api/types.ts';

const step = 'flex size-8 items-center justify-center rounded-full text-lg leading-none font-bold text-content transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40';

/** The stock of a product with a button to take one out and a button to add one; each click is saved. */
export function StockStepper({ product }: { product: Product }) {
  const update = useUpdateProduct();
  const change = (by: number) => update.mutate({ id: product.id, changes: { stock: product.stock + by } });

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface-raised p-1 shadow-sm">
      <button type="button" className={step} aria-label={`Decrease stock of ${product.name}`} disabled={product.stock === 0} onClick={() => change(-1)}>
        −
      </button>
      <span data-testid="stock-value" className="min-w-8 text-center font-semibold tabular-nums">
        {product.stock}
      </span>
      <button type="button" className={step} aria-label={`Increase stock of ${product.name}`} onClick={() => change(1)}>
        +
      </button>
    </div>
  );
}
