# Code review: CS-202, products without a category are in the list

The kind of join is a decision about the rows that have no partner. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `innerJoin` reads naturally ("products with their categories") and gives the right answer as long as every product has a category. The column is optional, so that was never guaranteed.
- The sample data used while the list was written had a category on every product. The rows that show the bug came later.
- The query builder mirrors SQL: `innerJoin` and `leftJoin` are one word apart, and the library does exactly what it is told.

## Why the reference fix is right

- A left join says what the list means: every product, with its category when it has one.
- The page query and the count query change together. A list whose total disagrees with its rows breaks pagination in a way that is hard to notice.
- The API already described `category` as nullable, so no caller has to change.

## Compare with your fix

- Did you fix only the query that reads the rows? Check `total`: with 60 products and a total of 54, the last page cannot be reached.
- Did you load the products without a category in a second query and merge the two lists in JavaScript? Sorting and paging across the two lists is now your job, on every request.
- Did you give those products a default category in the data? The owner files them later on purpose.

## Watch for next time

- When a column can be null and you join on it, decide out loud what happens to the rows where it is null.
- Keep one row of every optional case in your test data: no category, no photo, no stock.
- When a list looks short, compare `count(*)` in the database with what the API answers before reading code.
