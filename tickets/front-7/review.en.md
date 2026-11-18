# Code review: CS-107, the header and the product cards follow the theme

A theme is finished when no component knows a color, only the part a color plays. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- The dark theme was added after the first components were written. Components that named colors directly (`bg-white`) could not follow it.
- A token names a role ("the surface of a card", "secondary text"). The value behind the role can change with the theme without touching a component.
- Contrast is part of the work: a dark background with the old dark text is as unreadable as the white cards were bright.

## Why the reference is built this way

- It changes only class names, in two files. No new CSS and no new token: the system already had what was needed.
- Each text token is used on the surface it was designed for, so AA contrast holds in both themes without measuring every pair again.
- A third theme later would need no change in these components.

## Compare with what you built

- Did you add `dark:` variants next to the fixed colors (`bg-white dark:bg-slate-800`)? It works, and now each component carries two palettes; a change of the dark theme means editing every file.
- Did you invent new color values for the dark header? Check their contrast, and ask whether an existing token already plays that part.
- Did you leave the "No photo" placeholder or the description behind? They are easy to miss because they do not always show.

## Watch for next time

- When you write a component, reach for a token before a color. If no token fits, that is a design question, not a class to make up.
- Look at every state of a component in every theme: with and without a photo, details open and closed.
