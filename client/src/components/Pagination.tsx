import { Icon } from './Icon.tsx';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav aria-label="Pages" className="flex items-center justify-center gap-3">
      <button type="button" className="button text-sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        <Icon name="chevronLeft" />
        Previous page
      </button>
      <span className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-semibold text-muted tabular-nums">
        Page {page} of {pages}
      </span>
      <button type="button" className="button text-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next page
        <Icon name="chevronRight" />
      </button>
    </nav>
  );
}
