import { Router } from 'express';
import type { Db } from '../db.ts';
import { listCategories } from '../repository.ts';

export function categoriesRouter(db: Db): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await listCategories(db));
  });

  return router;
}
