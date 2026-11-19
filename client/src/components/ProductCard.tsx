import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../api/types.ts';
import { formatPrice } from '../utils/formatPrice.ts';
import { StockPill } from './StockPill.tsx';

export function ProductCard({ product }: { product: Product }) {
  // The photo on show, for a product with more than one.
  const [selected, setSelected] = useState(0);
  const photo = product.images[selected] ?? product.images[0];

  return (
    <article data-testid="product-card" className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-raised text-content shadow-card transition-shadow hover:shadow-lift">
      <div className="relative">
        {photo ? (
          <img src={photo} alt={product.name} className="aspect-[4/3] w-full object-cover" />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center bg-surface-sunken text-sm font-semibold tracking-wide text-muted uppercase">No photo</div>
        )}
        {product.images.length > 1 && (
          <div role="group" aria-label={`Photos of ${product.name}`} className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                className={`size-2.5 rounded-full border border-white/80 shadow transition-colors ${index === selected ? 'bg-white' : 'bg-black/30 hover:bg-white/70'}`}
                aria-label={`Photo ${index + 1}`}
                aria-pressed={index === selected}
                onClick={() => setSelected(index)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 px-4 pt-4">
        <span className="text-xs font-bold tracking-[0.12em] text-muted uppercase">{product.category?.name ?? 'New this week'}</span>
        <span className="ml-auto">
          <StockPill stock={product.stock} />
        </span>
      </div>
      <div className="flex items-baseline gap-3 px-4 pt-2">
        <h3 data-testid="product-name" title={product.name} className="flex-1 text-lg leading-snug font-bold">
          <Link to={`/products/${product.id}`} className="block truncate underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p data-testid="product-price" className="text-lg font-extrabold text-content tabular-nums">
          {formatPrice(product.priceCents)}
        </p>
      </div>
      <p data-testid="product-description" className="line-clamp-2 px-4 pt-1 pb-4 text-sm leading-relaxed text-muted">
        {product.description || 'No description yet.'}
      </p>
    </article>
  );
}
