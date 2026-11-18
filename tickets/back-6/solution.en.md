# Solution: Sorting and a price range in the product list

**What was missing.** The list endpoint read only `category`, `q`, `page` and `pageSize`. The storefront already sent `sort`, `minPrice` and `maxPrice`, but nothing in the API read them, so the order was always by name and no price was filtered.

## Step by step

1. **Name the allowed orders.** In `server/src/types.ts`: `export const SORTS = ['name', 'price_asc', 'price_desc', 'newest'] as const;` and `export type Sort = (typeof SORTS)[number];`.
2. **Validate.** In `parseListQuery` (`server/src/validation.ts`): `sort` defaults to `name` and must be in `SORTS`; `minPrice` and `maxPrice` go through `wholeNumber`; a `maxPrice` below `minPrice` is an error on `maxPrice`. Each problem adds an entry to `fields`, and the function returns the three new values with the others.
3. **Filter.** In `listProducts` (`server/src/repository.ts`): `if (query.minPrice !== undefined) filters.push(gte(products.priceCents, query.minPrice))` and the same with `lte` for `maxPrice`. Both queries use `where`, so the total follows.
4. **Sort.** A table `ORDERS: Record<Sort, SQL[]>` maps each value to its columns: `price_asc: [asc(products.priceCents), asc(products.id)]`, `price_desc: [desc(products.priceCents), asc(products.id)]`, `newest: [desc(products.createdAt), asc(products.id)]`, `name: [asc(byName), asc(products.id)]`. The query becomes `.orderBy(...ORDERS[query.sort])`.
5. **Let the database do it.** Sorting and filtering happen in SQL, before `limit` and `offset`, so page 2 is page 2 of the sorted, filtered list.
6. **Add tests.** The reference adds `server/src/price-range-and-sort.test.ts`: each order, ties, the range alone and combined, the total, and every 400.

Then run `npm test`, try the select and the price fields in the shop, and move the card to **In QA**.
