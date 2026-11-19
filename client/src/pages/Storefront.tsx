import { useState } from 'react';
import { useProducts } from '../api/products.ts';
import { Filters } from '../components/Filters.tsx';
import { Pagination } from '../components/Pagination.tsx';
import { ProductGrid } from '../components/ProductGrid.tsx';
import { useFilters } from '../filters.ts';
import { parsePrice } from '../utils/formatPrice.ts';

const PAGE_SIZE = 12;

export function Storefront() {
  const { filters, update } = useFilters();
  const [category, setCategory] = useState('');

  const products = useProducts({
    page: filters.page,
    pageSize: PAGE_SIZE,
    sort: filters.sort,
    category,
    q: filters.q,
    minPrice: parsePrice(filters.minPrice),
    maxPrice: parsePrice(filters.maxPrice),
  });

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Juniper Street Market</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Our shelves</h1>
          <p className="mt-2 max-w-xl text-muted">See what is in before you walk over. Prices and stock are updated every morning.</p>
        </div>
        {products.data && (
          <p className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-semibold text-muted tabular-nums">
            {products.data.total === 1 ? '1 product' : `${products.data.total} products`}
          </p>
        )}
      </div>
      <Filters
        q={filters.q}
        category={category}
        sort={filters.sort}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        // Typing replaces the current history entry: Back leaves the search, not one letter of it.
        onSearch={(q) => update({ q }, { replace: true })}
        onCategory={setCategory}
        onSort={(sort) => update({ sort })}
        onMinPrice={(minPrice) => update({ minPrice }, { replace: true })}
        onMaxPrice={(maxPrice) => update({ maxPrice }, { replace: true })}
      />
      {products.isPending && <p className="text-muted">Loading products…</p>}
      {products.isError && (
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 font-medium text-danger">
          The products could not be loaded.
        </p>
      )}
      {products.data && products.data.items.length === 0 && <p className="card px-6 py-12 text-center font-medium text-muted">No products match these filters.</p>}
      {products.data && products.data.items.length > 0 && (
        <>
          <ProductGrid products={products.data.items} />
          <Pagination page={products.data.page} pageSize={products.data.pageSize} total={products.data.total} onPage={(page) => update({ page: String(page) })} />
        </>
      )}
    </main>
  );
}
