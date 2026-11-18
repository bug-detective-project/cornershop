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
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Our shelves</h1>
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
        <p role="alert" className="text-danger">
          The products could not be loaded.
        </p>
      )}
      {products.data && products.data.items.length === 0 && <p className="text-muted">No products match these filters.</p>}
      {products.data && products.data.items.length > 0 && (
        <>
          <ProductGrid products={products.data.items} />
          <Pagination page={products.data.page} pageSize={products.data.pageSize} total={products.data.total} onPage={(page) => update({ page: String(page) })} />
        </>
      )}
    </main>
  );
}
