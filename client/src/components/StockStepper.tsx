import { useUpdateProduct } from '../api/products.ts';
import type { Product } from '../api/types.ts';

// Below 768px the table is too narrow for the buttons: the row shows only the number, and the stock
// is changed in the form above.
const step = 'hidden size-8 items-center justify-center rounded-full text-lg leading-none font-bold text-content transition-colors hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-40 md:flex';

/** The stock of a product with a button to take one out and a button to add one; each click is saved. */
export function StockStepper({ product }: { product: Product }) {
  const update = useUpdateProduct();
  const change = (by: number) => update.mutate({ id: product.id, changes: { stock: product.stock + by } });

  return (
    <div className="inline-flex items-center gap-1 md:rounded-full md:border md:border-border-strong md:bg-surface-raised md:p-1 md:shadow-sm">
      <span className={`${step} cursor-pointer`} onClick={() => change(-1)}>
        −
      </span>
      <span data-testid="stock-value" className="font-semibold tabular-nums md:min-w-8 md:text-center">
        {product.stock}
      </span>
      <span className={`${step} cursor-pointer`} onClick={() => change(1)}>
        +
      </span>
    </div>
  );
}
