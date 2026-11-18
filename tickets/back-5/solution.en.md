# Solution: A request id in the answers and in the log

**What was missing.** The API logged each request, but nothing tied a log line to the answer the caller received, or an error line to the request that caused it. The log needed one shared value per request.

## Step by step

1. **Decide the id at the start of the request.** In `requestLog` (`server/src/log.ts`): `const sent = req.get('x-request-id')`, and `const requestId = sent !== undefined && REQUEST_ID.test(sent) ? sent : randomUUID()`, with `const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/`.
2. **Send it back and keep it.** `res.setHeader('X-Request-Id', requestId)` and `res.locals.requestId = requestId`. Setting the header in the middleware, before any route runs, is what puts it on every answer, errors included.
3. **Log it.** Add `requestId` to the object written in the `finish` handler.
4. **Use it in the error line.** Export a small `requestIdOf(res)` from `log.ts`; in `handleErrors` (`server/src/app.ts`) put the id in the error log line and in the body of the 500.
5. **Keep the middleware first.** `app.use(requestLog(log))` already comes before the host check, so a refused host gets an id too.
6. **Add tests.** The reference adds `server/src/request-id.test.ts`: the header on every answer, different ids, the caller's id reused or replaced, and the id on the log lines.

Then run `npm test`, call the API with `curl -i` and read the log, and move the card to **In QA**.
