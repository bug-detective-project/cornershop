# CS-107: Apply the dark theme to the header and the product cards

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Story |
| Status | To Do |
| Priority | Medium |
| Reporter | Lucy Tran (Customer care) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (theme) |
| Labels | `storefront`, `theme` |
| Sprint | CS Sprint 12 |
| Created | 18/11/2026 09:00 |

## Description

The shop got a dark theme last sprint (the moon button at the top). The page background, the filters, the owner panel and the product page follow it. Two parts were left for later and are still painted with the colors of the light theme: the **header** and the **product cards**. In the dark theme they stay white, which is the opposite of what a dark theme is for: customers who look at the shop at night get a wall of bright cards.

Please finish the job: both must follow the theme, with text that is easy to read in both.

## What is already there

- The theme button in the header: it sets `data-theme="dark"` or `"light"` on `<html>` and remembers the choice (`client/src/theme.ts`).
- The color tokens in `client/src/styles.css`: `surface`, `surface-raised`, `surface-sunken`, `content`, `muted`, `border`, `accent`, `accent-soft`, `accent-strong` and a few more, each with a value per theme. They are Tailwind colors: `bg-surface-raised`, `text-content`, `border-border`…
- Every other part of the app already uses the tokens. `client/src/pages/Admin.tsx` and `client/src/components/Filters.tsx` are good examples.

## What to build

- In `client/src/components/Header.tsx`: the header background and border, the shop name and the two navigation links (the current page and the other one) follow the theme.
- In `client/src/components/ProductCard.tsx`: the card background and border, the name, the price, the description and the "No photo" placeholder follow the theme.
- No fixed color is left in those two files: use the tokens (or a `dark:` variant for each fixed color).

## Acceptance criteria

- [ ] In the dark theme, the header and the product cards have a dark background.
- [ ] In both themes, every text in the header and in the cards has a contrast of at least 4.5:1 against its background (WCAG AA).
- [ ] In the light theme they look as they do today.
- [ ] The theme chosen is still applied after a reload.

## Environment

- CornerShop 1.0, any browser
- Use the moon button at the top right to switch themes

## Activity

**Lucy Tran** · 18/11/2026 09:17
> A customer sent us a screenshot at 11 pm with the caption "my eyes". Fair.
