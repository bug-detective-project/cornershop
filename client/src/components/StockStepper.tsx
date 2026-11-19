import { useUpdateProduct } from '../api/products.ts';
import type { Product } from '../api/types.ts';

// Below 725px the table is too narrow for the buttons: the row shows only the number, and the stock
// is changed in the form above.
const step = 'hidden size-8 items-center justify-center rounded-full text-lg leading-none font-bold text-content transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40 min-[725px]:flex';

/** The stock of a product with a button to take one out and a button to add one; each click is saved. */
export function StockStepper({ product }: { product: Product }) {
  const update = useUpdateProduct();
  const change = (by: number) => update.mutate({ id: product.id, changes: { stock: product.stock + by } });

  return (
    <div className="inline-flex items-center gap-1 min-[725px]:rounded-full min-[725px]:border min-[725px]:border-border-strong min-[725px]:bg-surface-raised min-[725px]:p-1 min-[725px]:shadow-sm">
      <button type="button" className={step} aria-label={`Decrease stock of ${product.name}`} disabled={product.stock === 0} onClick={() => change(-1)}>
        −
      </button>
      <span data-testid="stock-value" className="font-semibold tabular-nums min-[725px]:min-w-8 min-[725px]:text-center">
        {product.stock}
      </span>
      <button type="button" className={step} aria-label={`Increase stock of ${product.name}`} onClick={() => change(1)}>
        +
      </button>
    </div>
  );
}
