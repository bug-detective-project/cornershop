# CS-204: The product page shows a price a hundred times too low

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Lucy Tran (Customer care) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | Products API (product details) |
| Labels | `api`, `price` |
| Sprint | CS Sprint 12 |
| Created | 17/11/2026 13:40 |

## Description

A customer came in with her phone, pointed at the page of the Sourdough Loaf and asked for the loaf at **$0.05**. On the shop page the same loaf is **$4.50**, which is the right price. On its own page it says $0.05.

I checked a few more: every product page shows a price that is far too low, while the cards of the shop are right. Marta looked in the database and the price there is correct. We honored the five cents once. Please fix it before it becomes a habit.

## Steps to reproduce

1. Open the shop and search for `Sourdough Loaf`. Note the price on the card.
2. Click the name of the product to open its page. Note the price there.
3. Compare with the database: `psql "$DATABASE_URL" -c "select name, price_cents from products where name = 'Sourdough Loaf'"`.

## Expected result

The product page shows the same price as the card: $4.50.

## Actual result

The card shows $4.50 and the product page shows $0.05. The database holds 450.

## Acceptance criteria

- [ ] `GET /api/products/:id` gives the same `priceCents` as the list and as the database: a whole number of cents.
- [ ] The answers to creating and changing a product carry the price that was saved.
- [ ] The product page shows the same price as the card of the shop.

## Environment

- CornerShop 1.0
- Every product is affected; the cards of the shop are not

## Activity

**Lucy Tran** · 17/11/2026 13:58
> The gift hamper, our most expensive item, shows $1.29 on its page. It costs $129.
