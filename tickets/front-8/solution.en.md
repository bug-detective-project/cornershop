# Solution: The product page, with a photo gallery

**What was missing.** The storefront linked to `/products/<id>`, but no route matched that address, so the router fell through to the "Page not found" route. The data and the hook to load it already existed; the page and its gallery did not.

## Step by step

1. **Add the route.** In `client/src/App.tsx`: `<Route path="/products/:id" element={<ProductPage />} />`, above the `*` route.
2. **Load the product.** `client/src/pages/ProductPage.tsx` reads `const { id } = useParams()` and calls `useProduct(id)`.
3. **Handle loading and errors first.** `isPending`: a "Loading product…" line. `isError` with an `ApiError` of status 404: `<NotFound title="Product not found" />`. Any other error: a message with `role="alert"`.
4. **Show the product.** The name in an `<h1>`, `formatPrice(priceCents)` in `data-testid="product-price"`, the category name (or "Uncategorized"), "In stock" when `stock > 0` and "Out of stock" otherwise, the description, and a `<Link to="/">Back to the shop</Link>`.
5. **Build the gallery.** `client/src/components/Gallery.tsx` keeps `const [selected, setSelected] = useState(0)`. No images: the "No photos yet" box. Otherwise the main `<img data-testid="gallery-main" src={images[selected]} alt={name}>` and one `<button aria-label={`Show photo ${index + 1}`} aria-pressed={index === selected}>` per image.
6. **Start each product at its first photo.** The page renders `<Gallery key={product.id} …>`, so going from one product to another gives a new gallery instead of keeping the old selected index.
7. **Add tests.** The reference adds `client/src/pages/ProductPage.test.tsx`, which covers every criterion.

Then run `npm test`, open a product with three photos, one with none and an id that does not exist, and move the card to **In QA**.
