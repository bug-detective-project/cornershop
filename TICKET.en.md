# CS-203: Page 2 of the shop repeats products of page 1

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Lucy Tran (Customer care) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | Products API (pagination) |
| Labels | `api`, `pagination` |
| Sprint | CS Sprint 12 |
| Created | 17/11/2026 08:50 |

## Description

A customer told me she "keeps seeing the same things" in the shop. She is right: the first two products of page 2 are the last two of page 1. The same happens on every next page, and when I went through all five pages I never found two products that I know we have (the last ones in alphabetical order).

Our developer before you said the API tests for pagination all pass.

## Steps to reproduce

1. Open the shop and note the last two products of the first page.
2. Click **Next**.
3. Compare the first two products of page 2 with the ones you noted.
4. Go to the last page and look for `Whole Milk 1 L` and `Wildflower Honey`.

## Expected result

Each page shows the next products of the list. No product appears on two pages and none is left out.

## Actual result

Each page starts with products the previous page already showed, and the last products of the list are never reached.

## Acceptance criteria

- [ ] Walking through every page of `GET /api/products` returns each product exactly once, for any `pageSize` (the shop uses 12).
- [ ] `total`, `page` and `pageSize` in the answer stay correct.
- [ ] Pagination also works inside a category and with a search.

## Environment

- CornerShop 1.0 (API)
- The shop asks for 12 products per page; the API default is 10

## Activity

**Lucy Tran** · 17/11/2026 09:06
> With the address `…/api/products?page=2` in the browser I do not see the problem. In the shop I always do.
