# Solution: The header and the product cards follow the theme

**What was missing.** `Header.tsx` and `ProductCard.tsx` were painted with fixed colors of the light theme (`bg-white`, `text-slate-900`, `border-slate-300`…). The rest of the app uses the color tokens of `client/src/styles.css`, whose values change with `data-theme`.

## Step by step

1. **Learn the tokens.** In `styles.css`, `:root` gives each token its light value and `[data-theme='dark']` its dark value; the `@theme inline` block turns them into Tailwind colors.
2. **Header.** `border-slate-300 bg-white text-slate-900` becomes `border-border bg-surface-raised text-content`; the shop name `text-content`; the current link `bg-surface text-content` and the other `text-muted`.
3. **Card.** The article becomes `border-border bg-surface-raised text-content`; the "No photo" placeholder `bg-surface text-muted`; the description `text-muted`.
4. **Check both themes.** Switch with the moon button and look at each text. The tokens were chosen with AA contrast in both themes, so using the right pair (a text token on a surface token) is enough.
5. **Add a test.** The reference adds `client/src/components/theme.test.tsx`, which refuses a fixed color in the header and in the card.

Then run `npm test`, look at the shop in both themes, and move the card to **In QA**.
