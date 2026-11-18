# Solution: Products without a category are in the list

**Root cause.** In `server/src/repository.ts`, `listProducts` joins `products` with `categories` using `innerJoin`. An inner join returns only the rows that match on both sides, so a product whose `category_id` is null matches no category and disappears from the result. The same join is used by the query that counts the total.

## Step by step

1. **Count on both sides.** The table has 60 products; the API says `total: 54`. The six missing ones all have `category_id` null.
2. **Keep every product.** In the query that reads the page, change `.innerJoin(categories, eq(products.categoryId, categories.id))` to `.leftJoin(…)`. A left join keeps every row of `products`; where there is no category, the `category` column of the result is null.
3. **Fix the count too.** The query that computes `total` has the same join. Change it as well, or the list and the total disagree and the last page goes missing.
4. **Check the category filter.** The filter compares `categories.slug`; for a product without a category that column is null, so it is left out of a filtered list, as it should be.
5. **Add a regression test.** The reference adds `server/src/uncategorized.test.ts`: products without a category are listed, counted and found by the search, and stay out of a category filter.

Then run `npm test`, compare the two counts again, and move the card to **In QA**.
