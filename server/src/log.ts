import type { RequestHandler } from 'express';

/** Where the log lines go: the console in the app, an array in the tests. */
export type Log = (line: string) => void;

/** One JSON line per request, written when the answer is sent. */
export function requestLog(log: Log): RequestHandler {
  return (req, res, next) => {
    const started = performance.now();
    res.on('finish', () => {
      log(
        JSON.stringify({
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
