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
  createdAt: string;
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export const SORTS = [
  ['name', 'Name'],
  ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'],
  ['newest', 'Newest'],
] as const;
export type Sort = (typeof SORTS)[number][0];

export interface ProductInput {
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  categoryId: number | null;
}
