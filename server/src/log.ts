import { randomUUID } from 'node:crypto';
import type { RequestHandler, Response } from 'express';

/** Where the log lines go: the console in the app, an array in the tests. */
export type Log = (line: string) => void;

/** An id a caller may send in X-Request-Id: letters, digits and dashes, 8 to 64 characters. */
const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;

/** The id of the request an answer belongs to. */
export const requestIdOf = (res: Response): string => res.locals.requestId as string;

/**
 * One JSON line per request, written when the answer is sent. Every request gets an id (the
 * caller's own, when it sent a plain one): it goes back in the X-Request-Id header and into every
 * line the request logs, so one request can be followed through the log.
 */
export function requestLog(log: Log): RequestHandler {
  return (req, res, next) => {
    const sent = req.get('x-request-id');
    const requestId = sent !== undefined && REQUEST_ID.test(sent) ? sent : randomUUID();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    const started = performance.now();
    res.on('finish', () => {
      log(
        JSON.stringify({
          requestId,
          method: req.method,
          path: req.originalUrl.split('?')[0],
          status: res.statusCode,
          durationMs: Math.round(performance.now() - started),
        }),
      );
    });
    next();
  };
}
