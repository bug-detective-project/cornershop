import { useState } from 'react';
import { useDeleteProduct, useProducts } from '../api/products.ts';
import type { Product } from '../api/types.ts';
import { Icon } from '../components/Icon.tsx';
import { Pagination } from '../components/Pagination.tsx';
import { ProductForm } from '../components/ProductForm.tsx';
import { StockStepper } from '../components/StockStepper.tsx';
import { formatPrice } from '../utils/formatPrice.ts';

const PAGE_SIZE = 20;

export function Admin() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  /** Counts the forms that were finished, so the next one starts empty. */
  const [formNumber, setFormNumber] = useState(0);
  const products = useProducts({ page, pageSize: PAGE_SIZE, sort: 'newest' });
  const remove = useDeleteProduct();

  const done = (text: string | null) => {
    setMessage(text);
    setEditing(null);
    setFormNumber((current) => current + 1);
  };

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Behind the counter</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Owner panel</h1>
          <p className="mt-2 max-w-xl text-muted">Add what arrived, fix a price, and keep the stock true to the shelves.</p>
        </div>
        {products.data && (
          <p className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-semibold text-muted tabular-nums">
            {products.data.total === 1 ? '1 product' : `${products.data.total} products`}
          </p>
        )}
      </div>
      <ProductForm key={`${editing?.id ?? 'new'}-${formNumber}`} editing={editing} onDone={done} />
      {message && (
        <p role="status" className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 font-semibold text-accent-strong">
          {message}
        </p>
      )}
      {products.isPending && <p className="text-muted">Loading products…</p>}
      {products.isError && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 font-medium text-danger">
          The products could not be loaded.
        </p>
      )}
      {products.data && (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-border bg-surface-sunken/60 text-xs font-bold tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock</th>
                  <th className="px-5 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.data.items.map((product) => (
                  <tr key={product.id} data-testid="admin-product" className="border-b border-border transition-colors last:border-b-0 hover:bg-surface-sunken/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt="" className="size-11 shrink-0 rounded-lg border border-border object-cover" />
                        ) : (
                          <span aria-hidden="true" className="size-11 shrink-0 rounded-lg border border-dashed border-border-strong bg-surface-sunken" />
                        )}
                        <div className="min-w-0">
                          <span data-testid="admin-product-name" className="block font-bold">
                            {product.name}
                          </span>
                          <span className="block text-sm text-muted">{product.category?.name ?? 'No category'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold tabular-nums">{formatPrice(product.priceCents)}</td>
                    <td className="px-5 py-3">
                      <StockStepper product={product} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="button text-sm"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => {
                            setMessage(null);
                            setEditing(product);
                          }}
                        >
                          <Icon name="pencil" />
                          Edit
                        </button>
                        <button type="button" className="button text-sm text-danger" aria-label={`Delete ${product.name}`} onClick={() => remove.mutate(product.id)}>
                          <Icon name="trash" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={products.data.page} pageSize={products.data.pageSize} total={products.data.total} onPage={setPage} />
        </>
      )}
    </main>
  );
}
