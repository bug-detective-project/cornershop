import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../api/types.ts';
import { formatPrice } from '../utils/formatPrice.ts';

export function ProductCard({ product }: { product: Product }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [photo] = product.images;

  return (
    <article data-testid="product-card" className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface-raised text-content">
      {photo ? (
        <img src={photo} alt={product.name} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface text-muted">No photo</div>
      )}
      <div className="flex items-baseline gap-3 px-4 pt-4">
        <h3 data-testid="product-name" title={product.name} className="min-w-0 flex-1 truncate font-semibold">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p data-testid="product-price" className="shrink-0 font-semibold">
          {formatPrice(product.priceCents)}
        </p>
      </div>
      <div className="mt-auto p-4">
        <button type="button" className="button text-sm" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}>
          Details
        </button>
        {detailsOpen && (
          <p data-testid="product-description" className="mt-3 text-sm text-muted">
            {product.description || 'No description yet.'}
          </p>
        )}
      </div>
    </article>
  );
}
