import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.tsx';

/**
 * The question asked before a product is deleted, over the page. It opens on Cancel, the safe
 * answer; Escape, Cancel and a press around it all keep the product. Tab stays inside it. The
 * product's first photo, when it has one, shows which product is about to go.
 */
export function ConfirmDelete({ name, image, onConfirm, onCancel }: { name: string; image?: string; onConfirm: () => void; onCancel: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  function key(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const stops = [...(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? [])];
    const first = stops[0];
    const last = stops.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-text"
        className="card w-full max-w-sm p-6"
        onKeyDown={key}
      >
        <div className="flex items-start gap-4">
          {image ? (
            <span className="relative shrink-0">
              <img src={image} alt="" data-testid="confirm-delete-photo" className="size-20 rounded-xl border border-border object-cover" />
              <span aria-hidden="true" className="absolute -right-2 -bottom-2 flex size-8 items-center justify-center rounded-full border-2 border-surface-raised bg-danger-soft text-danger">
                <Icon name="trash" />
              </span>
            </span>
          ) : (
            <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
              <Icon name="trash" />
            </span>
          )}
          <div className="min-w-0">
            <h2 id="confirm-delete-title" className="text-lg font-extrabold tracking-tight">
              Delete product?
            </h2>
            <p id="confirm-delete-text" className="mt-1 text-sm text-muted">
              <strong className="font-semibold text-content">{name}</strong> leaves the shelves and this list. This cannot be undone.
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={cancelRef} type="button" className="button" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2 font-semibold text-surface-raised shadow-sm transition-opacity hover:opacity-90"
            onClick={onConfirm}
          >
            Delete product
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
