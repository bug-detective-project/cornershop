# CS-104: The category filter is lost on reload and is missing from shared links

| Field | Value |
| --- | --- |
| Project | CornerShop (CS) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Lucy Tran (Customer care) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Storefront (filters) |
| Labels | `storefront`, `routing` |
| Sprint | CS Sprint 12 |
| Created | 17/11/2026 09:10 |

## Description

I send customers links to our shelves all the time ("here is everything we have in the bakery"). The link I copy with the Bakery category chosen opens the whole shop for them, not the bakery.

The same happens to me when I reload the page: the category goes back to "All categories". The search does not have this problem: when I search for something and reload, the search is still there.

## Steps to reproduce

1. Open the shop and choose the category **Bakery**.
2. Look at the address bar, then reload the page.
3. Choose **Bakery**, then **Dairy**, then press the Back button of the browser.

## Expected result

The chosen category is part of the address. A reload, a shared link and the Back button all show the shelf that was chosen.

## Actual result

The address never changes when a category is chosen. A reload and a shared link show every product, and Back leaves the shop instead of returning to the previous category.

## Acceptance criteria

- [ ] Choosing a category puts it in the address (`?category=bakery`).
- [ ] A reload and a link opened directly show that category, in the list and in the select.
- [ ] The Back button returns to the category chosen before.
- [ ] Choosing a category keeps the search that was typed and goes back to the first page.

## Environment

- CornerShop 1.0, any browser

## Activity

**Lucy Tran** · 17/11/2026 09:24
> For now I tell customers to open the shop and pick the category themselves. Half of them do not.
