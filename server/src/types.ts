export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  /** Whole cents: 450 is $4.50. */
  priceCents: number;
  stock: number;
  category: Category | null;
  /** Paths of the photos, in order. */
  images: string[];
  /** ISO date. */
  createdAt: string;
}

export interface ProductPage {
  items: Product[];
  /** How many products match, on every page together. */
  total: number;
  page: number;
  pageSize: number;
}

export const SORTS = ['name', 'price_asc', 'price_desc', 'newest'] as const;
export type Sort = (typeof SORTS)[number];

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
