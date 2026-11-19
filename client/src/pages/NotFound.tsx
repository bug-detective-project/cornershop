import { Link } from 'react-router';
import { Icon } from '../components/Icon.tsx';

export function NotFound({ title = 'Page not found' }: { title?: string }) {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
      <span aria-hidden="true" className="flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Icon name="store" className="size-8" />
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
      <p className="text-muted">It may have left the shelves, or the address has a typo.</p>
      <Link to="/" className="button-primary mt-2">
        <Icon name="arrowLeft" />
        Back to the shop
      </Link>
    </main>
  );
}
