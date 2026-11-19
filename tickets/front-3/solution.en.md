# Solution: The photo picked stays with its product

**Root cause.** In `client/src/components/ProductGrid.tsx` the list items are keyed by their position: `key={index}`. React uses the key to match each item with the component it rendered before. With the index as the key, after a sort React keeps the same component (and its `selected` photo, state of `ProductCard`) in the same position and only hands it another product. That product shows its photo at the same position, or its first photo when it has fewer.

## Step by step

1. **See what moves and what stays.** After sorting, names, prices and photos change places, but the photo picked does not: props follow the data, state follows the key.
2. **Use the identity of the data as the key.** Change `products.map((product, index) => <li key={index}>` to `products.map((product) => <li key={product.id}>`. Now React moves each card, with its state, together with its product.
3. **Try it again.** Pick a photo, sort, search: the photo follows the loaf.
4. **Add a regression test.** The reference adds `client/src/pages/Storefront.photos.test.tsx`, which picks a photo and then sorts and filters the list.

Then run `npm test`, try it in the shop, and move the card to **In QA**.
