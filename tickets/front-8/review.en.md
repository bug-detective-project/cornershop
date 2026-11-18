# Code review: CS-108, the product page, with a photo gallery

A new page is mostly decisions about states: loading, missing, empty, and the happy one last. Here is the reference approach, so you can compare it with yours.

## What this ticket was about

- The work was a page and a route. Everything around it (the API, the hook, the price format, the not-found page) was ready, and using it was part of the job.
- A page that reads its id from the URL can be opened from a link, a bookmark or a reload: it cannot depend on the list having been loaded before.
- The gallery has exactly one fact to remember, which photo is selected. Everything else comes from its props.

## Why the reference is built this way

- Loading and errors are handled before the data is touched, so the rest of the component can assume there is a product.
- A 404 from the API and an unknown address look the same to the customer: the same `NotFound` page, with another title.
- The gallery is a separate component with no knowledge of products: it takes images and a name. It can be tested, and reused, alone.
- Thumbnails are real buttons with a name and `aria-pressed`, so the gallery works with a keyboard and a screen reader from the first day.

## Compare with what you built

- Did you fetch with `fetch` inside a `useEffect` instead of `useProduct`? It works, and you rewrote loading, errors and caching that the hook already handles.
- Did you look for the product in the cached list of the storefront? A direct link has no list.
- What does your gallery show after going from a product with three photos (third selected) to one with a single photo? Without a `key` or a reset, `images[2]` is undefined.
- Are your thumbnails clickable `<img>` elements? See what the keyboard does with them.

## Watch for next time

- List the states of a page before writing its markup: loading, error, not found, empty, full.
- Before building something, read what the project already has for it. Here that was most of the work.
