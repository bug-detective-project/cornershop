# CS-201: A product can be saved with a negative price

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Marta Okafor (Owner) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | Products API (validation) |
| Labels | `api`, `validation` |
| Sprint | CS Sprint 12 |
| Created | 16/11/2026 09:05 |

## Description

Our supplier sends us a price file every week and a small script of theirs adds the new products through the API. Last week one line had a typo, `-500` instead of `500`, and the shop showed a jam at **-$5.00** for a whole afternoon. A customer asked at the counter whether we would pay her to take it.

The API should have refused that product. It accepted it and answered as if everything was fine. I also saw a price of `4.5` go through, which is not a number of cents at all.

## Steps to reproduce

1. With the app running, send a product with a negative price:
   `curl -i -X POST http://localhost:3001/api/products -H "Content-Type: application/json" -d '{"name":"Fig Jam","priceCents":-500,"stock":5}'`
2. Look at the status of the answer.
3. Open the shop and search for `Fig Jam`.

## Expected result

The API answers **400** and says which field is wrong, as it already does for a product without a name or with a negative stock. Nothing is saved.

## Actual result

The API answers **201 Created** and the product is in the shop with a negative price.

## Acceptance criteria

- [ ] `POST /api/products` with a `priceCents` that is negative, not a whole number or not a number answers 400 with `{ "error": "Invalid product", "fields": { "priceCents": "…" } }`, and saves nothing.
- [ ] `PATCH /api/products/:id` refuses the same values and keeps the old price.
- [ ] A price of `0` is allowed (free samples), and valid products are still created with 201.
- [ ] The other fields are still validated as before.

## Environment

- CornerShop 1.0 (API)
- Reproduced with `curl` and through the supplier's script

## Activity

**Marta Okafor** · 16/11/2026 09:19
> I fixed the jam by hand in the panel. The panel itself does not let me type a negative price, so this is about what the API accepts.
