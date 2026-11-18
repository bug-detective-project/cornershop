# CS-103: Open details jump to another product when the list is sorted

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Lucy Tran (Customer care) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (product list) |
| Labels | `storefront`, `react` |
| Sprint | CS Sprint 12 |
| Created | 16/11/2026 14:05 |

## Description

A customer wrote to us confused. She opened the **Details** of the Sourdough Loaf to read about it, then sorted the list by price, and the open description was suddenly about a croissant. She thought the shop had mixed up its products.

I tried it: the products are in the right order after sorting, but the open details stay in the same place on the screen, under whatever product lands there.

## Steps to reproduce

1. Open the shop and choose the category **Bakery**.
2. Click **Details** on the Sourdough Loaf.
3. Change **Sort by** to **Price: low to high**.

## Expected result

The details stay open on the Sourdough Loaf, wherever it moves to, and only there.

## Actual result

The card that is now in the place where the loaf was has its details open, and the loaf has them closed.

## Acceptance criteria

- [ ] Open details stay with their product when the list is sorted in any order.
- [ ] They also stay with their product when the list is filtered by a search.
- [ ] Closing the details closes them on the same product.

## Environment

- CornerShop 1.0, any browser

## Activity

**Lucy Tran** · 16/11/2026 14:20
> It also happens when I type in the search box while some details are open.
