import { useState } from 'react';
import { useDeleteProduct, useProducts } from '../api/products.ts';
import type { Product } from '../api/types.ts';
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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Owner panel</h1>
      <ProductForm key={`${editing?.id ?? 'new'}-${formNumber}`} editing={editing} onDone={done} />
      {message && (
        <p role="status" className="font-medium text-accent">
          {message}
        </p>
      )}
      {products.isPending && <p className="text-muted">Loading products…</p>}
      {products.isError && (
        <p role="alert" className="text-danger">
          The products could not be loaded.
        </p>
      )}
      {products.data && (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface-raised">
            <table className="w-full text-left">
              <thead className="border-b border-border text-sm text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Price</th>
                  <th className="px-4 py-2 font-medium">Stock</th>
                  <th className="px-4 py-2 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.data.items.map((product) => (
                  <tr key={product.id} data-testid="admin-product" className="border-b border-border last:border-b-0">
                    <td className="px-4 py-2">
                      <span data-testid="admin-product-name" className="font-medium">
                        {product.name}
                      </span>
                      <span className="block text-sm text-muted">{product.category?.name ?? 'No category'}</span>
                    </td>
                    <td className="px-4 py-2 tabular-nums">{formatPrice(product.priceCents)}</td>
                    <td className="px-4 py-2">
                      <StockStepper product={product} />
                    </td>
                    <td className="px-4 py-2">
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
                          Edit
                        </button>
                        <button type="button" className="button text-sm text-danger" aria-label={`Delete ${product.name}`} onClick={() => remove.mutate(product.id)}>
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
