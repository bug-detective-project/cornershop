# Code review: CS-206, sorting and a price range in the product list

A list endpoint is three steps in a fixed order: filter, sort, then cut a page. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- The page was ready before the API. A parameter the server does not read is silently ignored, so nothing failed: the list simply never changed.
- Sorting has a detail that only shows with real data: equal values. Without a tie-breaker the database may return ties in any order, and a product can appear on two pages or on none.
- Everything the caller sends is input, including the name of an order and the two ends of a range.

## Why the reference is built this way

- The allowed orders are one list that gives the validation, the type and the table of columns. Adding an order is one line in each.
- Every order ends with the id, so the result is the same on every request.
- Filters are added to one list that both the count and the page use, which keeps `total` honest.
- Bad input is refused with the name of the field, the same contract as the rest of the API, instead of being ignored or guessed.

## Compare with what you built

- Did you load every product and sort or filter in JavaScript? It works with 60 products, reads the whole table on every request, and has to redo paging by hand.
- Did you put the value of `sort` directly into the SQL (`order by ${sort}`)? That is how SQL injection starts. Map allowed values to columns.
- Did you sort only the page that was read? Then "cheapest first" means the cheapest of ten products that came by name.
- Is your range inclusive at both ends? Try `minPrice=450&maxPrice=450`: four products.
- What does your API answer to `sort=cheapest`? Silently falling back to the default hides a bug in whoever called.

## Watch for next time

- For a list endpoint, write the order of operations down: filter, sort (with a tie-breaker), page, and count with the same filters.
- Test sorting with data that has ties, and a range at exactly its two ends.
