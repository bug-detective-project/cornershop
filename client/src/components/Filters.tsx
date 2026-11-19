import { useCategories } from '../api/categories.ts';
import { SORTS } from '../api/types.ts';
import type { Sort } from '../api/types.ts';
import { Icon } from './Icon.tsx';

interface FiltersProps {
  q: string;
  category: string;
  sort: Sort;
  minPrice: string;
  maxPrice: string;
  onSearch: (q: string) => void;
  onCategory: (slug: string) => void;
  onSort: (sort: string) => void;
  onMinPrice: (text: string) => void;
  onMaxPrice: (text: string) => void;
}

const label = 'flex flex-col gap-1.5 text-xs font-bold tracking-wide text-muted uppercase';
const input = 'field text-base font-normal tracking-normal normal-case';

export function Filters(props: FiltersProps) {
  const categories = useCategories();

  return (
    <form role="search" aria-label="Filter products" className="card grid grid-cols-2 gap-4 p-4 md:grid-cols-[2fr_1fr_1fr_6.5rem_6.5rem]" onSubmit={(event) => event.preventDefault()}>
      <label className={`${label} col-span-2 md:col-span-1`}>
        Search
        <span className="relative">
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input type="search" className={`${input} pl-9`} placeholder="Bread, milk, candles…" value={props.q} onChange={(event) => props.onSearch(event.target.value)} />
        </span>
      </label>
      <label className={label}>
        Category
        <select className={input} value={props.category} onChange={(event) => props.onCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.data?.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        Sort by
        <select className={input} value={props.sort} onChange={(event) => props.onSort(event.target.value)}>
          {SORTS.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        Min price
        <input type="text" inputMode="decimal" placeholder="0.00" className={input} value={props.minPrice} onChange={(event) => props.onMinPrice(event.target.value)} />
      </label>
      <label className={label}>
        Max price
        <input type="text" inputMode="decimal" placeholder="0.00" className={input} value={props.maxPrice} onChange={(event) => props.onMaxPrice(event.target.value)} />
      </label>
    </form>
  );
}
