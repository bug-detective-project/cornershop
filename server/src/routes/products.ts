import { Router } from 'express';
import type { Response } from 'express';
import type { Db } from '../db.ts';
import { categoryExists, createProduct, deleteProduct, findProduct, listProducts, updateProduct } from '../repository.ts';
import { ValidationError, parseListQuery, parseProduct } from '../validation.ts';
import type { ProductInput } from '../validation.ts';

/** Ids are positive whole numbers that fit a PostgreSQL integer; anything else matches no product. */
function parseId(value: string): number | undefined {
  return /^\d{1,9}$/.test(value) ? Number(value) : undefined;
}

const notFound = (res: Response): void => {
  res.status(404).json({ error: 'Product not found' });
};

async function checkCategory(db: Db, product: Partial<ProductInput>): Promise<void> {
  if (product.categoryId != null && !(await categoryExists(db, product.categoryId))) {
    throw new ValidationError('Invalid product', { categoryId: `Category ${product.categoryId} does not exist` });
  }
}

export function productsRouter(db: Db): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    res.json(await listProducts(db, parseListQuery(req.query)));
  });

  router.get('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    const product = id === undefined ? undefined : await findProduct(db, id);
    if (!product) {
      notFound(res);
      return;
    }
    res.json(product);
  });

  router.post('/', async (req, res) => {
    const input = parseProduct(req.body);
    await checkCategory(db, input);
    res.status(201).json(await createProduct(db, input));
  });

  router.patch('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === undefined || !(await findProduct(db, id))) {
      notFound(res);
      return;
    }
    const changes = parseProduct(req.body, { partial: true });
    await checkCategory(db, changes);
    res.json(await updateProduct(db, id, changes));
  });

  router.delete('/:id', async (req, res) => {
    const id = parseId(req.params.id);
    if (id === undefined || !(await deleteProduct(db, id))) {
      notFound(res);
      return;
    }
    res.status(204).end();
  });

  return router;
}
