# Code review: CS-101, a long product name stays inside its card

This is the flexbox trap almost everyone meets once. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- `truncate` needs a box that is narrower than the text. In a flex row, the box around the text was allowed to be as wide as the text, so there was nothing to truncate.
- The default `min-width` of a flex item is `auto`, not `0`. That default protects content from being squashed, and it is exactly what breaks ellipsis inside flex rows.
- Only one product had a name long enough to show it, so the bug hid behind ordinary data.

## Why the reference fix is right

- `min-w-0` goes on the flex item (the heading), not on the text: the item is what refuses to shrink.
- `shrink-0` on the price says which of the two gives way. Without it, a very narrow card could squeeze the price instead.
- The full name stays available in the `title` attribute, so nothing is lost when it is cut.

## Compare with your fix

- Did you let the name wrap onto more lines instead? That is a valid fix too; check that cards in the same row still line up.
- Did you set a fixed `max-width` in pixels on the name? It works at one window width and breaks at the next.
- Did you shorten the name in the data? The owner asked to keep it.

## Watch for next time

- When an ellipsis does not appear inside a flex or grid layout, look for a missing `min-width: 0` on the item.
- Test lists with the longest and the shortest real values, not only with typical ones.
