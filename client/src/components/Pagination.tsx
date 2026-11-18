interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPage }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <nav aria-label="Pages" className="flex items-center justify-center gap-4">
      <button type="button" className="button" disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous page
      </button>
      <span className="text-sm text-muted">
        Page {page} of {pages}
      </span>
      <button type="button" className="button" disabled={page >= pages} onClick={() => onPage(page + 1)}>
        Next page
      </button>
    </nav>
  );
}
