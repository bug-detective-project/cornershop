# Code review: CS-203, every page shows different products

Pagination is two numbers that must come from the same place. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `limit` and `offset` are computed from a page size. Here each used a different one: the size the caller asked for, and the default.
- With the default the bug is invisible, and the default is what a test uses unless someone decides otherwise. The tests were green and proved nothing about the shop.
- The symptom ("the same products again") looked like duplicated data. The data was fine; the window over it was misplaced.

## Why the reference fix is right

- One value, `pageSize`, drives both numbers, so they cannot disagree again.
- The default stays in one place, the parsing of the query, and the repository only receives a page size that is already decided.
- The order has a tie-breaker (the id), so a product cannot jump between pages when two names or prices are equal. Without that, even a correct offset can repeat rows.

## Compare with your fix

- Did you make the shop ask for 10 per page? The API still returns wrong pages to anyone who asks for another size.
- Did you remove duplicates in the client? The products that were skipped are still missing.
- Did you test only page 2? Walk every page and count: each product once, and the count equal to `total`.

## Watch for next time

- Test pagination with a page size that is not the default, and by walking all the pages, not one.
- When a test suite is green and a user sees a bug, ask what the tests have in common that the user does not.
