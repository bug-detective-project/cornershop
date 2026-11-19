# CS-108: Build the product page, with a photo gallery

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Story |
| Status | To Do |
| Priority | High |
| Reporter | Marta Okafor (Owner) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (product page) |
| Labels | `storefront`, `new-page` |
| Sprint | CS Sprint 12 |
| Created | 18/11/2026 10:30 |

## Description

Customers want to see a product properly before they walk over: bigger photos, the full description, whether we have it. Today, clicking the name of a product on the shop page goes to `/products/<id>` and lands on "Page not found", because that page was never built.

Please build it. Several of our products have two or three photos, and some have none yet, so the page needs a small gallery and must look right without photos too.

## What is already there

- The API: `GET /api/products/:id` answers the product, or 404 with `{ "error": "Product not found" }`.
- The hook `useProduct(id)` in `client/src/api/products.ts`: it loads the product with TanStack Query (`isPending`, `isError`, `error`, `data`). A 404 arrives as an `ApiError` with `status` 404 (`client/src/api/http.ts`).
- `formatPrice(cents)` in `client/src/utils/formatPrice.ts`, and the page `NotFound` in `client/src/pages/NotFound.tsx`, which takes a `title` and already has the link **Back to the shop**.
- The cards of the storefront already link to `/products/<id>`.

## What to build

- The route `/products/:id` in `client/src/App.tsx`, showing a new page component.
- The page shows: the name as the main heading (`<h1>`), the price (in an element with `data-testid="product-price"`), the category name, **In stock** or **Out of stock**, the description and a link **Back to the shop** to `/`.
- A gallery: the selected photo in an `<img data-testid="gallery-main">` whose `alt` is the product name, and one button per photo named **Show photo 1**, **Show photo 2**… Clicking a button shows that photo. The first photo is selected at the start.
- A product without photos shows the text **No photos yet** in place of the gallery.
- While the product loads, say so. A product that does not exist shows the heading **Product not found** and the link **Back to the shop**.

## Acceptance criteria

- [ ] Clicking the name of a product in the shop opens its page at `/products/<id>`, and opening that address directly works too.
- [ ] The page shows the name (`<h1>`), the price (`data-testid="product-price"`, for example `$4.50`), the category, **In stock** / **Out of stock** and the description.
- [ ] The gallery shows the first photo in `data-testid="gallery-main"` and one button **Show photo N** per photo; clicking one shows that photo.
- [ ] A product without photos shows **No photos yet**, with no gallery image and no photo buttons.
- [ ] An id that does not exist shows **Product not found** and a link **Back to the shop**.

## Environment

- CornerShop 1.0
- Sourdough Loaf has three photos; Matches has none; Fish Fingers is out of stock

## Activity

**Marta Okafor** · 18/11/2026 10:44
> Nothing fancy. Clear photos, the price, and whether it is on the shelf.
