# CS-205: Add a request id to the answers and to the log of the API

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Lucy Tran (Customer care) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (request log) |
| Labels | `api`, `logging` |
| Sprint | CS Sprint 12 |
| Created | 18/11/2026 08:30 |

## Description

When a customer tells me "the shop gave me an error around ten", I open the log of the API and find hundreds of lines from that minute. They all look alike: method, path, status, duration. I cannot tell which lines belong to that customer, or which error line goes with which request.

Other systems I have used give every request an id, show it in the answer and write it on every log line of that request. Then the customer (or the page) can tell me the id, and I find the request in seconds. We want that here.

## What is already there

- `server/src/log.ts`: the middleware `requestLog(log)` writes one JSON line per request when the answer is sent, with `method`, `path`, `status` and `durationMs`.
- `server/src/app.ts`: `handleErrors(log)` writes a JSON line with `level: "error"` and the message when a route fails with a 500.
- `log` is a function that receives one line of text. In the app it is `console.log`; in the tests it collects the lines (`server/src/test/app.ts`), so you can test what was logged.
- `node:crypto` has `randomUUID()`.

## What to build

- Every request gets an id. If the caller sent an `X-Request-Id` header whose value is 8 to 64 characters of letters, digits and dashes, that value is the id. Otherwise the API creates a new one (for example with `randomUUID()`).
- Every answer carries the id in the `X-Request-Id` header: successes, 400, 403, 404 and 500 alike.
- The log line of the request has the id in a field `requestId`, and so does the error line of a 500.
- The other fields of the log line stay as they are.

## Acceptance criteria

- [ ] Every answer of the API has an `X-Request-Id` header with 8 to 64 letters, digits or dashes.
- [ ] Two requests never share an id.
- [ ] A valid `X-Request-Id` sent by the caller is used as the id; an invalid one (too short, too long, other characters) is replaced by a new id.
- [ ] The log line of each request has `requestId` equal to the header of its answer, also when the request fails.
- [ ] The log line keeps `method`, `path`, `status` and `durationMs`.

## Environment

- CornerShop 1.0 (API)
- The log is what `npm run dev` prints for the server

## Activity

**Lucy Tran** · 18/11/2026 08:47
> If the id also shows up in the browser's Network tab I can ask customers for a screenshot of it. A header does that, right?
