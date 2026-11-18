# Solution: A new product shows up without a reload

**Root cause.** The lists come from the TanStack Query cache, where each answer stays fresh for a minute (`client/src/queryClient.ts`). In `client/src/api/products.ts`, `useUpdateProduct` and `useDeleteProduct` call `queryClient.invalidateQueries({ queryKey: ['products'] })` when they succeed, which marks every cached list out of date and refetches the ones on screen. `useCreateProduct` does not, so after the `POST` the screen keeps showing the old copy.

## Step by step

1. **Confirm it in the Network tab.** Creating sends a `POST` that answers 201 and nothing else. Editing sends a `PATCH` and then a `GET /api/products`.
2. **Get the query client** in `useCreateProduct`: `const queryClient = useQueryClient();`.
3. **Invalidate on success:** `onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })`. The key `['products']` is the prefix of every list and of every product page, so all of them are refreshed.
4. **Add a regression test.** The reference adds `client/src/pages/Admin.create.test.tsx`: a new product shows up in the panel and in the storefront without a reload.

Then run `npm test`, create a product and watch the list, and move the card to **In QA**.
