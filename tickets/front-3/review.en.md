# Code review: CS-103, open details stay with their product

The `key` warning is the first thing React teaches and the last thing people understand. This bug shows what the key is really for. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A key answers the question "which item is this?". The index answers "which position is this?", which is a different question as soon as the order changes.
- As long as a card had no state of its own, the index was harmless: React re-rendered every card with new props and nobody saw a difference. The Details button gave the card state, and the bug appeared.
- The list never changed order while the code was written, so the wrong key was never tested.

## Why the reference fix is right

- `product.id` is stable and unique: it is the same value on every page, in every order and after every reload.
- Nothing about the Details button had to change. The state was right; it was attached to the wrong thing.
- With a real key React can also move DOM nodes instead of rewriting them, which is cheaper.

## Compare with your fix

- Did you move the "open" state up to the list, keyed by product id? It works and is sometimes the right design, but the key is still wrong for any other state a card gets later.
- Did you use the product name as the key? Names can repeat; ids cannot.
- Did you close every card when the order changes? It hides the symptom and throws away what the shopper was reading.

## Watch for next time

- Use the index as a key only for a list that never changes order, never filters and whose items have no state.
- When state shows up on the wrong item after a reorder, check the key before anything else.
