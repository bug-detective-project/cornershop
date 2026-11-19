# Solution: A long product name stays inside its card

**Root cause.** In `client/src/components/ProductCard.tsx` the name (`<h3>`) and the price share a flex row. A flex item has `min-width: auto`: it refuses to become narrower than its content. The link inside the name is `truncate` (one line, ellipsis), so its content is the whole name on one line, and the `<h3>` grows to that width, past the card. The card clips what overflows, so the price disappears.

## Step by step

1. **See it in DevTools.** Select the `<h3>` of the long-named card: its box is much wider than the card. The price sits after it, outside the visible area.
2. **Let the name shrink.** Add `min-w-0` to the `<h3>`: `className="min-w-0 flex-1 text-lg leading-snug font-bold"`. Now the heading may become narrower than its text, and the `truncate` on the link shows the ellipsis.
3. **Keep the price whole.** Add `shrink-0` to the price: `className="shrink-0 text-lg font-extrabold text-content tabular-nums"`. When space is short, only the name gives way.
4. **Add a regression test.** The reference adds `client/src/components/ProductCard.layout.test.tsx`, which checks that the name may shrink and the price may not.

Then run `npm test`, look at the card at a few window widths, and move the card to **In QA**.
