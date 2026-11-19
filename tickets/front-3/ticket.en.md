# CS-103: The photo picked on a card jumps to another product when the list is sorted

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

A customer wrote to us confused. On the Sourdough Loaf she clicked the dots on the photo to see the second photo, the loaf cooling on a rack. Then she sorted the list by price, and the Sourdough Loaf was back on its first photo, while the big loaf from Grandma Lucia was now showing its second photo, which she had never picked. She thought the shop had mixed up its photos.

I tried it: the products are in the right order after sorting, but the photo picked stays in the same place on the screen, on whatever product lands there.

## Steps to reproduce

1. Open the shop and choose the category **Bakery**.
2. On the Sourdough Loaf, click the second dot on the photo (**Photo 2**).
3. Change **Sort by** to **Price: low to high**.

## Expected result

The Sourdough Loaf keeps showing its second photo, wherever it moves to, and every other card keeps the photo it had.

## Actual result

The Sourdough Loaf is back on its first photo, and the card that is now in the place where it was shows its second photo.

## Acceptance criteria

- [ ] The photo picked on a card stays with its product when the list is sorted in any order.
- [ ] It also stays with its product when the list is filtered by a search.
- [ ] Going back to the first photo changes the same product, and no other.

## Environment

- CornerShop 1.0, any browser

## Activity

**Lucy Tran** · 16/11/2026 14:20
> It also happens when I type in the search box after picking a photo.
