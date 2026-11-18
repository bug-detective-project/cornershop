# Code review: CS-104, the category filter lives in the URL

Where a piece of state lives decides what happens to it on reload, share and Back. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `useState` is the first tool everyone reaches for, and it works on screen: the list filtered correctly, so the problem was invisible until someone reloaded.
- The other filters were already in the URL. The category was added the quick way and nobody compared it with its neighbors.
- Sharing a link is a feature nobody writes down, because the browser gives it for free, as long as the state is in the address.

## Why the reference fix is right

- It reuses `useFilters()`, the one place that knows how the filters map to the URL. The category now behaves exactly like the search.
- Choosing a category pushes a history entry (typing in the search replaces the current one), so Back steps through categories and not through letters.
- The page goes back to 1 on any filter change, because page 3 of the bakery may not exist.

## Compare with your fix

- Did you keep `useState` and copy the value to the URL in an effect? You now have two sources of truth that can disagree; Back changes the URL but not the state.
- Did you store the category in `localStorage`? It survives a reload on the same computer, but a shared link still opens the whole shop.
- Did you call `setSearchParams` directly in the page? It works; check that it keeps the other parameters and resets the page.

## Watch for next time

- Before choosing where state lives, ask: should it survive a reload? Should a link carry it? Should Back undo it? Three times yes means the URL.
- When a feature has siblings (other filters, other fields), make the new one work like them.
