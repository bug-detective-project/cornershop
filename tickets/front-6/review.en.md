# Code review: CS-106, a new product shows up without a reload

A cache makes an app fast and adds one duty: every write must say what it made stale. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- The data was saved. What the owner saw was a copy made before the save, which the client had no reason to doubt.
- The comment above the mutations says each one invalidates the lists. The code of one of them stopped matching the comment, and the comment was believed.
- With the default settings of the library (data stale at once, refetch when the window gets focus) the bug would mostly hide itself. A sensible cache time made it visible every time.

## Why the reference fix is right

- Invalidation asks the server again, so the list has whatever the server decided: the id, the creation date, the position in the order.
- The key is the shared prefix, so the panel, the storefront and any filtered list are all covered by one line.
- It is the same line the other two mutations use: one rule for every write.

## Compare with your fix

- Did you add the new product to the cached list by hand with `setQueryData`? It avoids a request, but you must put it in the right place of every cached list (sorted, filtered, paged).
- Did you set `staleTime` to 0, or turn on refetching on focus? It hides this bug and makes every screen ask the server far more often.
- Did you reload the page from code after saving? It works and throws away everything the cache was for.

## Watch for next time

- When you add a mutation, write next to it which queries it makes stale.
- When the screen and the server disagree, check the Network tab first: it tells you whether the data or the copy is wrong.
