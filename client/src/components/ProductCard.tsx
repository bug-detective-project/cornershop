import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../api/types.ts';
import { formatPrice } from '../utils/formatPrice.ts';
import { StockPill } from './StockPill.tsx';

export function ProductCard({ product }: { product: Product }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [photo] = product.images;

  return (
    <article data-testid="product-card" className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised text-content shadow-card transition-shadow hover:shadow-lift">
      {photo ? (
        <img src={photo} alt={product.name} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface-sunken text-sm font-semibold tracking-wide text-muted uppercase">No photo</div>
      )}
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
        <span className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{product.category?.name ?? 'New this week'}</span>
        <span className="ml-auto">
          <StockPill stock={product.stock} />
        </span>
      </div>
      <div className="flex items-baseline gap-3 px-4 pt-2">
        <h3 data-testid="product-name" title={product.name} className="min-w-0 flex-1 text-lg leading-snug font-bold">
          <Link to={`/products/${product.id}`} className="block truncate underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p data-testid="product-price" className="shrink-0 text-lg font-extrabold text-content tabular-nums">
          {formatPrice(product.priceCents)}
        </p>
      </div>
      <div className="mt-auto p-4">
        <button type="button" className="button w-full text-sm" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}>
          Details
        </button>
        {detailsOpen && (
          <p data-testid="product-description" className="mt-3 text-sm leading-relaxed text-muted">
            {product.description || 'No description yet.'}
          </p>
        )}
      </div>
    </article>
  );
}
