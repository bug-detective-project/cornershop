# Code review: CS-102, the product grid fits a phone

Sideways scrolling on a phone almost always comes from one element with a fixed minimum width. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `repeat(auto-fill, minmax(360px, 1fr))` is a pattern copied everywhere, and it carries a hidden assumption: the container is at least 360 px wide.
- On a laptop the assumption always holds, so the grid looked perfect to whoever wrote it.
- A grid track never becomes narrower than the minimum of its `minmax()`. It overflows instead.

## Why the reference fix is right

- `min(100%, 18rem)` keeps the pattern and removes the assumption in one place, with no breakpoint to maintain.
- The page did not need `overflow-x: hidden`. Hiding the overflow would hide the cut-off part of the cards, not fix them.
- The desktop layout is untouched: the change only matters below 18rem of available width.

## Compare with your fix

- Did you use breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)? That is a fine fix too; you now choose the number of columns yourself at each width.
- Did you add `overflow-x-hidden` to the page? The sideways scroll goes away but the cards are still cut.
- Did you lower the minimum to a smaller pixel value? It moves the problem to a narrower screen.

## Watch for next time

- Test every page at 375 px before calling it done: it is the narrowest phone the shop supports.
- When a page scrolls sideways, look for the one element whose width does not come from its container.
