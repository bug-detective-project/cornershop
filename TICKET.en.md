# CS-102: On a phone, the product grid is one column cut off on the right

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Lucy Tran (Customer care) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (product grid) |
| Labels | `storefront`, `responsive` |
| Sprint | CS Sprint 12 |
| Created | 16/11/2026 10:15 |

## Description

Three customers told me this week that the shop "does not fit" on their phones. I checked on mine: there is one column of products and the right side of every card is cut off. The page also slides sideways, which it never did.

Most of our customers look at the shop on a phone on their way here.

## Steps to reproduce

1. Open the shop.
2. Make the window as narrow as a phone (or use the device mode of the DevTools, 375 px wide).
3. Scroll down the list, then try to scroll sideways.

## Expected result

On a phone the cards fit the width of the screen and the page does not scroll sideways. On a desktop the grid keeps its columns.

## Actual result

Each card is wider than the screen: its right side is cut off and the page scrolls sideways.

## Acceptance criteria

- [ ] At 320, 375 and 414 px wide, no card passes the edge of the screen and the page does not scroll sideways.
- [ ] On a tablet the grid has more than one column.
- [ ] On a desktop (1280 px) the grid still has at least three columns.

## Environment

- CornerShop 1.0, Chrome on Android and Safari on iPhone
- Fine on a laptop

## Activity

**Lucy Tran** · 16/11/2026 10:31
> On my old phone (a small one) it is even worse, almost a third of the card is missing.
