# Solution: The owner's price field with the mask of the filters

**What was missing.** The mask already exists: `client/src/components/PriceInput.tsx` takes the digits from the right as cents, ignores the rest, opens the number keys (`inputMode="numeric"`) and keeps what was typed while it has the focus. The filters use it; the product form in `client/src/components/ProductForm.tsx` still had a plain `<input>` for **Price**.

## Step by step

1. **Find what is already built.** `Filters.tsx` renders `<PriceInput value={props.minPrice} onChange={props.onMinPrice} />`. The field takes and gives the price as plain text ("4.50"), the same text the form keeps in `values.price` and reads with `parsePrice`.
2. **Use it in the form.** Import `PriceInput` and replace the `<input>` of **Price** with `<PriceInput className={input} placeholder="$0.00" value={values.price} onChange={(price) => setValues((current) => ({ ...current, price }))} aria-describedby={…} />`. `PriceInput` passes the other props (class, placeholder, `aria-describedby`) to its `<input>`.
3. **Nothing else changes.** Saving still calls `parsePrice(values.price)`; editing still fills `values.price` with `"1.20"`, which the field shows as **$1.20**; an empty field still shows **Enter a price like 4.50**.
4. **Add a regression test.** The reference adds `client/src/pages/Admin.price.test.tsx`: typing digit by digit, letters and Backspace, the price of a product to edit, and the cents sent when saving.

Then run `npm test`, type a few prices in the panel, and move the card to **In QA**.
