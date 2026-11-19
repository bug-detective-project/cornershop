# Solution: The product grid fits a phone

**Root cause.** In `client/src/components/ProductGrid.tsx` the grid is `repeat(auto-fill, minmax(360px, 1fr))`: as many columns as fit, each at least 360 px wide. The phones the shop supports are 375 to 414 px wide, and the page has 16 px of padding on each side, so even one column does not fit: it keeps its 360 px and overflows.

## Step by step

1. **Find what overflows.** In the device mode at 375 px, the `<ul>` of the grid is 343 px wide and its only column is 360 px.
2. **Make the minimum depend on the space.** Change the class to `grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))]`. A column is at least 18rem wide, but never wider than the grid itself: `min()` picks the smaller of the two.
3. **Check the other widths.** Tablet: two columns. Desktop: three or more. Nothing else changes, because wide screens never reach the `100%` branch.
4. **Add a regression test.** The reference adds `client/src/components/ProductGrid.layout.test.tsx`, which refuses a column with a fixed minimum width.

Then run `npm test`, try the shop at 375 px and at 1280 px, and move the card to **In QA**.
