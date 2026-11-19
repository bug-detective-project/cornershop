import { Icon } from './Icon.tsx';

/** The last line of every page: where the shop is and when it is open. */
export function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-surface-raised">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-6 text-sm text-muted sm:px-6">
        <p className="mr-auto font-bold text-content">Juniper Street Market</p>
        <p className="flex items-center gap-2">
          <Icon name="pin" />
          14 Juniper Street
        </p>
        {/* The opening hours are on every product page; below 768px the footer keeps only the address. */}
        <p className="hidden items-center gap-2 md:flex">
          <Icon name="clock" />
          Open every day, 7:00 to 20:00
        </p>
      </div>
    </footer>
  );
}
