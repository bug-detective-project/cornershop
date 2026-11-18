# Solution: A product needs a valid price

**Root cause.** In `server/src/validation.ts`, `parseProduct` checks the price with `typeof input.priceCents !== 'number'`. That only refuses values that are not numbers at all. `-500` and `4.5` are numbers, so they pass, the product is inserted and the route answers 201. The stock, two blocks below, uses `isCount`, which asks for a whole number of zero or more.

## Step by step

1. **Confirm it in the API.** The `curl` from the ticket answers `201 Created`; the same request with `"stock": -1` answers `400` and names the field.
2. **Use the same rule as the stock.** Replace the condition with `if (!isCount(input.priceCents))`. `isCount` accepts whole numbers from 0 to the largest integer the database column holds.
3. **Say what is expected.** The message becomes `priceCents must be a whole number of cents, 0 or more`, so whoever calls the API knows how to fix the request.
4. **Check the change route too.** `PATCH` uses the same function with `partial: true`, so it is fixed by the same line.
5. **Add a regression test.** The reference adds `server/src/price-validation.test.ts`: negative, fractional, text, missing and huge prices are refused on create and on change, and zero is accepted.

Then run `npm test`, repeat the `curl`, and move the card to **In QA**.
