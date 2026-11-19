import { Link, useParams } from 'react-router';
import { ApiError } from '../api/http.ts';
import { useProduct } from '../api/products.ts';
import { Gallery } from '../components/Gallery.tsx';
import { Icon } from '../components/Icon.tsx';
import { formatPrice } from '../utils/formatPrice.ts';
import { NotFound } from './NotFound.tsx';

export function ProductPage() {
  const { id } = useParams();
  const product = useProduct(id);

  if (product.isPending) {
    return <main className="mx-auto max-w-6xl px-4 py-8 text-muted sm:px-6">Loading product…</main>;
  }
  if (product.isError) {
    if (product.error instanceof ApiError && product.error.status === 404) {
      return <NotFound title="Product not found" />;
    }
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 font-medium text-danger">
          The product could not be loaded.
        </p>
      </main>
    );
  }

  const { name, description, priceCents, stock, category, images } = product.data;
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-accent underline-offset-4 hover:underline">
        <Icon name="arrowLeft" />
        Back to the shop
      </Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* A product of its own gets a gallery of its own: the selected photo starts again. */}
        <Gallery key={product.data.id} images={images} name={name} />
        <div className="flex flex-col gap-4">
          <p className="eyebrow">{category ? category.name : 'Uncategorized'}</p>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight">{name}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <p data-testid="product-price" className="text-3xl font-extrabold tabular-nums">
              {formatPrice(priceCents)}
            </p>
            <p className={`pill text-sm ${stock > 0 ? 'bg-accent-soft text-accent-strong' : 'bg-danger-soft text-danger'}`}>{stock > 0 ? 'In stock' : 'Out of stock'}</p>
          </div>
          <p className="text-lg leading-relaxed text-muted">{description || 'No description yet.'}</p>
          <dl className="card mt-2 grid gap-4 p-5 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon name="store" className="size-5" />
              </span>
              <div>
                <dt className="font-bold">Pick it up at the shop</dt>
                <dd className="text-sm text-muted">14 Juniper Street, at the counter.</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon name="clock" className="size-5" />
              </span>
              <div>
                <dt className="font-bold">Open every day</dt>
                <dd className="text-sm text-muted">From 7:00 to 20:00.</dd>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </main>
  );
}
