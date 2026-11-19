import { useQuery } from '@tanstack/react-query';
import { request } from './http.ts';
import type { Category } from './types.ts';

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: () => request<Category[]>('/api/categories') });
}
