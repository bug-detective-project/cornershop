import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { request } from './http.ts';
import type { Product, ProductInput, ProductPage, Sort } from './types.ts';

export interface ListParams {
  page: number;
  pageSize: number;
  sort: Sort;
  category?: string;
  q?: string;
  /** In cents. */
  minPrice?: number;
  maxPrice?: number;
}

function toSearch(params: ListParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  }
  return search.toString();
}

/** A page of the product list. While another page loads, the one on screen stays. */
export function useProducts(params: ListParams) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: () => request<ProductPage>(`/api/products?${toSearch(params)}`),
    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: () => request<Product>(`/api/products/${id}`),
    enabled: id !== undefined,
  });
}

// Every list and every product page is a copy kept in the cache. A change on the server does not
// reach those copies by itself: each mutation below marks them out of date when it succeeds.

export function useCreateProduct() {
  return useMutation({
    mutationFn: (input: ProductInput) => request<Product>('/api/products', { method: 'POST', body: input }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<ProductInput> }) => request<Product>(`/api/products/${id}`, { method: 'PATCH', body: changes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => request<void>(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}
