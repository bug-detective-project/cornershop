import { Link, useParams } from 'react-router';
import { ApiError } from '../api/http.ts';
import { useProduct } from '../api/products.ts';
import { Gallery } from '../components/Gallery.tsx';
import { formatPrice } from '../utils/formatPrice.ts';
import { NotFound } from './NotFound.tsx';

export function ProductPage() {
  const { id } = useParams();
  const product = useProduct(id);

  if (product.isPending) {
    return <main className="mx-auto max-w-6xl px-4 py-6 text-muted">Loading product…</main>;
  }
  if (product.isError) {
    if (product.error instanceof ApiError && product.error.status === 404) {
      return <NotFound title="Product not found" />;
    }
    return (
      <main className="mx-auto max-w-6xl px-4 py-6">
        <p role="alert" className="text-danger">
          The product could not be loaded.
        </p>
      </main>
    );
  }

  const { name, description, priceCents, stock, category, images } = product.data;
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6">
      <Link to="/" className="self-start text-accent underline">
        Back to the shop
      </Link>
      <div className="grid gap-8 md:grid-cols-2">
        {/* A product of its own gets a gallery of its own: the selected photo starts again. */}
        <Gallery key={product.data.id} images={images} name={name} />
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">{category ? category.name : 'Uncategorized'}</p>
          <h1 className="text-3xl font-bold">{name}</h1>
          <p data-testid="product-price" className="text-2xl font-semibold">
            {formatPrice(priceCents)}
          </p>
          <p className={stock > 0 ? 'font-medium text-accent' : 'font-medium text-danger'}>{stock > 0 ? 'In stock' : 'Out of stock'}</p>
          <p className="text-muted">{description || 'No description yet.'}</p>
        </div>
      </div>
    </main>
  );
}
