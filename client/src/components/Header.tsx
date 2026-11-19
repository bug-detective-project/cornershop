import { Link, NavLink } from 'react-router';
import { useTheme } from '../theme.ts';
import { Icon } from './Icon.tsx';

const navLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-accent-soft text-accent-strong' : 'text-muted hover:bg-surface-sunken hover:text-content'}`;

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-raised text-content">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <Link to="/" className="mr-auto flex items-center gap-3 text-content">
          <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-content shadow-sm">
            <Icon name="basket" className="size-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-tight">CornerShop</span>
            <span className="hidden text-xs font-medium text-muted sm:block">Juniper Street Market</span>
          </span>
        </Link>
        {/* On a phone the theme button stays on the line of the name, and the pages go to a line of their own. */}
        <nav aria-label="Main" className="order-last flex w-full items-center gap-1 sm:order-none sm:w-auto">
          <NavLink to="/" end className={navLink}>
            Shop
          </NavLink>
          <NavLink to="/admin" className={navLink}>
            Admin
          </NavLink>
        </nav>
        <button type="button" className="button size-9 rounded-full p-0" aria-label="Toggle theme" aria-pressed={theme === 'dark'} onClick={toggle}>
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </div>
    </header>
  );
}
