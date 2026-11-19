# CS-101: A long product name runs over the price and out of the card

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Marta Okafor (Owner) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (product card) |
| Labels | `storefront`, `css` |
| Sprint | CS Sprint 12 |
| Created | 16/11/2026 08:40 |

## Description

I added our new loaf yesterday, "Grandma Lucia's Slow-Fermented Whole Wheat Sourdough Country Loaf (Large)". On the shop page its card is broken: the name stays on one line, runs across the whole card and the price is gone. Every other card looks fine.

Customers ask for the price of that loaf at the counter because they cannot see it online.

## Steps to reproduce

1. Open the shop.
2. Search for `Grandma`.
3. Look at the card of the long-named loaf, then make the window narrower and wider.

## Expected result

The name fits inside the card (cut with "…" or broken into lines) and the price, $8.90, is visible next to it, at any window width.

## Actual result

The name runs past the edge of the card and the price is pushed out of sight.

## Acceptance criteria

- [ ] On a phone, a tablet and a desktop, the long name stays inside its card.
- [ ] The name never covers the price, and the price is fully visible.
- [ ] Cards with short names look the same as before.

## Environment

- CornerShop 1.0, Chrome
- Seen at every window width

## Activity

**Marta Okafor** · 16/11/2026 08:52
> The name is long on purpose, it is how Lucia wants it on the label. Please do not shorten it in the database.
