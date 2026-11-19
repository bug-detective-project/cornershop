# Solution: The stock buttons work from the keyboard and say what they do

**Root cause.** In `client/src/components/StockStepper.tsx` the two controls are `<span onClick={…}>`. A span is not interactive: it is not in the Tab order, it does not react to Enter or Space, and assistive technology sees plain text ("−"), with no role and no name.

## Step by step

1. **Compare with what works.** Edit and Delete in the same row are `<button>` elements, and the keyboard reaches them.
2. **Use real buttons.** Replace each `<span>` with `<button type="button" className={step} …>` (`step` is the look the two controls already share). `type="button"` keeps it from submitting a form.
3. **Give each one a name.** `aria-label={`Decrease stock of ${product.name}`}` and `aria-label={`Increase stock of ${product.name}`}`. With twenty rows on the page, "minus" alone would not say which product.
4. **Stop at zero.** `disabled={product.stock === 0}` on the decrease button: the API refuses a negative stock, so the button should not offer it.
5. **Add a regression test.** The reference adds `client/src/pages/Admin.stock.test.tsx`: the buttons are found by role and name, reached with Tab and used with Enter and Space.

Then run `npm test`, change a stock with the keyboard only, and move the card to **In QA**.
