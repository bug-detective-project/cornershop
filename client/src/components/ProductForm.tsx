import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCategories } from '../api/categories.ts';
import { ApiError } from '../api/http.ts';
import { useCreateProduct, useUpdateProduct } from '../api/products.ts';
import type { Product } from '../api/types.ts';
import { parsePrice } from '../utils/formatPrice.ts';

interface FormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
}

const EMPTY: FormValues = { name: '', description: '', price: '', stock: '0', categoryId: '' };

const valuesOf = (product: Product): FormValues => ({
  name: product.name,
  description: product.description,
  price: (product.priceCents / 100).toFixed(2),
  stock: String(product.stock),
  categoryId: product.category ? String(product.category.id) : '',
});

const label = 'flex flex-col gap-1 text-sm font-medium text-muted';

/**
 * The form of the owner panel: a new product, or the changes to `editing`. The parent gives it a
 * new `key` per product, so its fields start from that product.
 */
export function ProductForm({ editing, onDone }: { editing: Product | null; onDone: (message: string | null) => void }) {
  const categories = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const [values, setValues] = useState<FormValues>(() => (editing ? valuesOf(editing) : EMPTY));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (field: keyof FormValues) => (event: { target: { value: string } }) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const priceCents = parsePrice(values.price);
    if (priceCents === undefined) {
      setErrors({ priceCents: 'Enter a price like 4.50' });
      return;
    }
    const input = {
      name: values.name,
      description: values.description,
      priceCents,
      stock: Number(values.stock),
      categoryId: values.categoryId === '' ? null : Number(values.categoryId),
    };
    try {
      if (editing) {
        await update.mutateAsync({ id: editing.id, changes: input });
      } else {
        await create.mutateAsync(input);
      }
      onDone(editing ? 'Product saved' : 'Product created');
    } catch (error) {
      setErrors(error instanceof ApiError && Object.keys(error.fields).length > 0 ? error.fields : { form: 'The product could not be saved.' });
    }
  };

  const errorOf = (field: string) =>
    errors[field] && (
      <span className="text-sm font-normal text-danger" id={`error-${field}`}>
        {errors[field]}
      </span>
    );

  return (
    <form className="grid gap-3 rounded-xl border border-border bg-surface-raised p-4 md:grid-cols-2" onSubmit={(event) => void submit(event)} noValidate>
      <h2 className="text-lg font-semibold md:col-span-2">{editing ? 'Edit product' : 'New product'}</h2>
      <label className={label}>
        Name
        <input className="field" value={values.name} onChange={set('name')} aria-describedby={errors.name ? 'error-name' : undefined} />
        {errorOf('name')}
      </label>
      <label className={label}>
        Category
        <select className="field" value={values.categoryId} onChange={set('categoryId')}>
          <option value="">No category</option>
          {categories.data?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errorOf('categoryId')}
      </label>
      <label className={label}>
        Price
        <input className="field" inputMode="decimal" placeholder="4.50" value={values.price} onChange={set('price')} aria-describedby={errors.priceCents ? 'error-priceCents' : undefined} />
        {errorOf('priceCents')}
      </label>
      <label className={label}>
        Stock
        <input className="field" type="number" min="0" step="1" value={values.stock} onChange={set('stock')} aria-describedby={errors.stock ? 'error-stock' : undefined} />
        {errorOf('stock')}
      </label>
      <label className={`${label} md:col-span-2`}>
        Description
        <textarea className="field" rows={2} value={values.description} onChange={set('description')} />
        {errorOf('description')}
      </label>
      <div className="flex items-center gap-3 md:col-span-2">
        <button type="submit" className="button-primary" disabled={create.isPending || update.isPending}>
          Save
        </button>
        {editing && (
          <button type="button" className="button" onClick={() => onDone(null)}>
            Cancel
          </button>
        )}
        {errors.form && (
          <span role="alert" className="text-danger">
            {errors.form}
          </span>
        )}
      </div>
    </form>
  );
}
