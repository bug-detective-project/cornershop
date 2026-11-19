import express from 'express';
import type { ErrorRequestHandler, Express, RequestHandler } from 'express';
import type { Db } from './db.ts';
import { requestLog } from './log.ts';
import type { Log } from './log.ts';
import { categoriesRouter } from './routes/categories.ts';
import { productsRouter } from './routes/products.ts';
import { ValidationError } from './validation.ts';

export function createApp({ db, log }: { db: Db; log: Log }): Express {
  const app = express();

  app.use(requestLog(log));
  app.use(allowedHost);
  app.use(express.json());
  app.use('/api/categories', categoriesRouter(db));
  app.use('/api/products', productsRouter(db));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use(handleErrors(log));

  return app;
}

/** Hosts the API answers; the port is ignored. */
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * The app runs on the player's computer and only the local client talks to it: a page on the
 * internet that reaches the API through the browser sends another Host, and gets 403.
 */
const allowedHost: RequestHandler = (req, res, next) => {
  const host = req.headers.host ?? '';
  const name = host.startsWith('[') ? host.slice(0, host.indexOf(']') + 1) : host.replace(/:\d+$/, '');
  if (LOCAL_HOSTS.has(name.toLowerCase())) {
    next();
    return;
  }
  res.status(403).json({ error: 'Forbidden host' });
};

/** Turns what a route threw into an answer: 400 for a bad request, 500 (and a log line) for a bug. */
export function handleErrors(log: Log): ErrorRequestHandler {
  return (error, _req, res, _next) => {
    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message, fields: error.fields });
      return;
    }
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({ error: 'Request body must be valid JSON' });
      return;
    }
    log(JSON.stringify({ level: 'error', message: error instanceof Error ? error.message : String(error) }));
    res.status(500).json({ error: 'Internal server error' });
  };
}
