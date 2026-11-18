# Code review: CS-105, the stock buttons work from the keyboard and say what they do

Most accessibility bugs are one decision: a generic element where a native one belonged. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A `<span>` with `onClick` looks and clicks exactly like a button for someone with a mouse, so the bug is invisible to whoever wrote it.
- Styling made it worse: the same `button` class is on both, so they even look alike.
- A symbol such as "−" is not a name. It is read as "minus", or not at all, and says nothing about which product it belongs to.

## Why the reference fix is right

- The native `<button>` brings focus, keyboard, role and `disabled` together, and they keep working in every browser and with every assistive technology.
- The name carries the product, because a screen reader user moves from button to button without seeing the row.
- No ARIA role had to be written. The best ARIA is the HTML element that already has the behavior.

## Compare with your fix

- Did you keep the `<span>` and add `role="button"`, `tabIndex={0}` and an `onKeyDown` for Enter and Space? It can work, but you rebuilt by hand what the element gives you, and it is easy to forget Space, or `disabled`.
- Did you use `title` instead of `aria-label`? Support for `title` as a name is uneven; `aria-label` is the dependable one.
- Did every button get the same name ("Increase stock")? The name must tell the rows apart.

## Watch for next time

- If it does something when clicked, it is a `<button>`; if it goes somewhere, it is a link. Decide that before styling.
- Do one pass of every screen with the keyboard only before calling it done.
