import { useCategories } from '../api/categories.ts';
import { SORTS } from '../api/types.ts';
import type { Sort } from '../api/types.ts';

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

const label = 'flex flex-col gap-1 text-sm font-medium text-muted';

export function Filters(props: FiltersProps) {
  const categories = useCategories();

  return (
    <form role="search" aria-label="Filter products" className="grid grid-cols-2 gap-3 md:grid-cols-[2fr_1fr_1fr_6rem_6rem]" onSubmit={(event) => event.preventDefault()}>
      <label className={`${label} col-span-2 md:col-span-1`}>
        Search
        <input type="search" className="field" value={props.q} onChange={(event) => props.onSearch(event.target.value)} />
      </label>
      <label className={label}>
        Category
        <select className="field" value={props.category} onChange={(event) => props.onCategory(event.target.value)}>
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
        <select className="field" value={props.sort} onChange={(event) => props.onSort(event.target.value)}>
          {SORTS.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        Min price
        <input type="text" inputMode="decimal" placeholder="0.00" className="field" value={props.minPrice} onChange={(event) => props.onMinPrice(event.target.value)} />
      </label>
      <label className={label}>
        Max price
        <input type="text" inputMode="decimal" placeholder="0.00" className="field" value={props.maxPrice} onChange={(event) => props.onMaxPrice(event.target.value)} />
      </label>
    </form>
  );
}
