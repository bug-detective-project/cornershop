# Solution: Every page shows different products

**Root cause.** In `listProducts` (`server/src/repository.ts`) the query takes `pageSize` rows (`limit(pageSize)`) but skips `(page - 1) * DEFAULT_PAGE_SIZE` rows. With the default page size (10) the two numbers agree, which is why the existing tests pass. The shop asks for 12 per page: page 2 skips 10 rows instead of 12, so it starts with the last two products of page 1, and each next page drifts two more.

## Step by step

1. **Reproduce it with the shop's page size.** `?pageSize=12&page=2` starts at the 11th product; it should start at the 13th.
2. **Skip by the size that was asked for.** Change the offset to `.offset((page - 1) * pageSize)`.
3. **Remove the import** of `DEFAULT_PAGE_SIZE` from `repository.ts`, which is no longer used there. The default still applies where it belongs: in `parseListQuery`, when the caller sends no `pageSize`.
4. **Add a regression test.** The reference adds `server/src/pagination.test.ts`: with 12, 5, 25 and 50 per page, walking the pages returns every product exactly once.

Then run `npm test`, walk the pages of the shop, and move the card to **In QA**.
