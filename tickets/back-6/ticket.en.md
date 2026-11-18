# CS-206: Build sorting and the price range in the product list of the API

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Story |
| Status | To Do |
| Priority | High |
| Reporter | Marta Okafor (Owner) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | Products API (list) |
| Labels | `api`, `list` |
| Sprint | CS Sprint 12 |
| Created | 18/11/2026 11:10 |

## Description

The shop page has a **Sort by** select and two fields, **Min price** and **Max price**. They were put on the page ahead of time: the page sends `sort`, `minPrice` and `maxPrice` to the API, and the API ignores all three. Whatever I choose, the list comes by name, with every price.

Customers ask for two things all the time: "show me the cheapest first" and "what do you have under five dollars". Please make the API do it. The page needs no change.

## What is already there

- `GET /api/products` already filters by `category` and `q`, and pages with `page` and `pageSize`. It answers `{ items, total, page, pageSize }`.
- `server/src/validation.ts`: `parseListQuery` reads the query string and throws a `ValidationError` with the bad fields, which becomes a 400 with `{ "error": "Invalid query", "fields": { … } }`. Look at how `page` and `pageSize` are done.
- `server/src/repository.ts`: `listProducts` builds the list of filters, the query that counts the total and the query that reads the page. The list is ordered by name today.
- The storefront already sends the three parameters. Prices travel in cents.

## What to build

- `sort`: one of `name` (the default), `price_asc`, `price_desc` or `newest` (by `createdAt`, most recent first). Any other value answers 400 and names the field `sort`.
- Whatever the order, products that tie (same price, for example) come by `id`, lowest first, so that pages never depend on luck.
- `minPrice` and `maxPrice`: whole numbers of cents, 0 or more. Only products with `minPrice <= priceCents <= maxPrice` are listed; both ends are included, and each parameter works alone.
- A value that is not a whole number of 0 or more answers 400 and names the field. A `maxPrice` below `minPrice` answers 400 and names `maxPrice`.
- `total` counts only the products that match, and the new parameters work together with `category`, `q`, `page` and `pageSize`.

## Acceptance criteria

- [ ] `sort=price_asc`, `price_desc`, `newest` and `name` order the whole list (not only one page), and ties come by id.
- [ ] `minPrice` and `maxPrice` filter in cents, both ends included, alone or together.
- [ ] `total` and the pages follow the filters.
- [ ] Invalid values answer 400 with the field in `fields`: an unknown `sort`, a price that is negative, fractional or not a number, a `maxPrice` below `minPrice`.
- [ ] The category, the search and the pagination keep working as before.

## Environment

- CornerShop 1.0 (API)
- In the sample shop the cheapest product is Chewing Gum (95 cents) and the most expensive is the Gift Hamper with Sparkling Wine (12900 cents)

## Activity

**Marta Okafor** · 18/11/2026 11:26
> Four of our products cost exactly $4.50. When I sort by price I want them in the same order every time, not shuffled on each visit.
