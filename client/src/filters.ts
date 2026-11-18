import { useSearchParams } from 'react-router';
import { SORTS } from './api/types.ts';
import type { Sort } from './api/types.ts';

/** The filters of the storefront, as the URL holds them. Prices are the text the shopper typed, in dollars. */
export interface Filters {
  q: string;
  category: string;
  sort: Sort;
  minPrice: string;
  maxPrice: string;
  page: number;
}

const isSort = (value: string | null): value is Sort => SORTS.some(([sort]) => sort === value);

/**
 * The filters live in the URL, so a reload, a shared link and the Back button all show the same
 * list. `update` changes some of them; an empty value leaves the URL without that filter, and any
 * change but the page itself goes back to the first page.
 */
export function useFilters(): { filters: Filters; update: (changes: Partial<Record<keyof Filters, string>>, options?: { replace?: boolean }) => void } {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page'));
  const sort = searchParams.get('sort');

  return {
    filters: {
      q: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      sort: isSort(sort) ? sort : 'name',
      minPrice: searchParams.get('minPrice') ?? '',
      maxPrice: searchParams.get('maxPrice') ?? '',
      page: Number.isInteger(page) && page > 0 ? page : 1,
    },
    update: (changes, options) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        if (!('page' in changes)) {
          next.delete('page');
        }
        for (const [key, value] of Object.entries(changes)) {
          if (value === '' || (key === 'sort' && value === 'name') || (key === 'page' && value === '1')) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      }, options);
    },
  };
}
