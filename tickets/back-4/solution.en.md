# Solution: A product has one price everywhere

**Root cause.** In `server/src/repository.ts`, `toDetail` (used by `GET /api/products/:id` and by the answers to creating and changing a product) returns `priceCents: product.priceCents / 100`. The field is called `priceCents` and every caller treats it as cents: the client divides by 100 again to format it, so 450 becomes 4.5 and then "$0.05". `toListItem`, the twin function used by the list, returns the value as stored.

## Step by step

1. **Follow the value.** Database: `450`. `GET /api/products?q=sourdough loaf`: `"priceCents": 450`. `GET /api/products/<id>`: `"priceCents": 4.5`. The number changes inside the API, between the row and the answer of the details route.
2. **Find where the details answer is built.** `findProduct` calls `toDetail`. Compare it line by line with `toListItem` right above it.
3. **Return the cents as they are:** `priceCents: product.priceCents`. Money stays in whole cents from the database to the API; only the screen turns it into text.
4. **Add a regression test.** The reference adds `server/src/price-cents.test.ts`: the price is the same whole number in the list, in the details and in the database, and comes back as sent after a create and a change.

Then run `npm test`, open the page of the loaf, and move the card to **In QA**.
