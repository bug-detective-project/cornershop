# Solution: The category filter lives in the URL

**Root cause.** In `client/src/pages/Storefront.tsx` the category is kept with `useState`, while every other filter comes from `useFilters()` (`client/src/filters.ts`), which reads and writes the search parameters of the URL. Component state does not appear in the address, so it is lost on a reload, is not in a copied link and makes no history entry for Back.

## Step by step

1. **Compare the two filters.** The search writes `?q=…` to the address; the category writes nothing.
2. **Read the category from the URL.** Replace `const [category, setCategory] = useState('')` with `const { category } = filters;`: `useFilters()` already reads `category` from the address.
3. **Write it to the URL.** `const setCategory = (slug: string) => update({ category: slug });`. `update` removes the page number (back to page 1), keeps the other filters and adds a history entry, so Back works.
4. **Remove the unused import** of `useState`.
5. **Add a regression test.** The reference adds `client/src/pages/Storefront.category.test.tsx`: the category goes to the URL, is read from it, keeps the search and resets the page.

Then run `npm test`, try a reload, a copied link and the Back button, and move the card to **In QA**.
