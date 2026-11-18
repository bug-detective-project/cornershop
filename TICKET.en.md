# CS-202: Products without a category are missing from the shop

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Marta Okafor (Owner) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | Products API (list) |
| Labels | `api`, `database` |
| Sprint | CS Sprint 12 |
| Created | 16/11/2026 11:45 |

## Description

When something new arrives I add it right away and choose its category later, when I have a minute. Those products are not showing up: not in the shop, not in the list of the panel. This morning I added an umbrella three times before I understood that it was being saved and simply not listed.

As soon as I give the product a category, it appears.

## Steps to reproduce

1. Open the owner panel and add a product, leaving **Category** as "No category".
2. Look for it in the list of the panel and in the shop.
3. Run `psql "$DATABASE_URL" -c "select count(*) from products"` in the terminal and compare with the number of products the shop lists.

## Expected result

Every product is listed, with or without a category, and the total counts all of them.

## Actual result

Products without a category are saved in the database but are not in the list, and the total leaves them out.

## Acceptance criteria

- [ ] `GET /api/products` lists the products without a category too, with `"category": null`.
- [ ] The `total` counts them, and the search finds them.
- [ ] Filtering by a category still shows only the products of that category.

## Environment

- CornerShop 1.0 (API)
- The sample shop has six products without a category (for example Umbrella and Matches)

## Activity

**Marta Okafor** · 16/11/2026 12:02
> The database has 60 products. The shop lists 54.
