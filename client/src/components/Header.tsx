import { Link, NavLink } from 'react-router';
import { useTheme } from '../theme.ts';

const navLink = ({ isActive }: { isActive: boolean }) => `rounded-lg px-3 py-2 font-medium ${isActive ? 'bg-surface text-content' : 'text-muted'}`;

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-border bg-surface-raised text-content">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="mr-auto text-xl font-bold text-content">
          CornerShop
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1">
          <NavLink to="/" end className={navLink}>
            Shop
          </NavLink>
          <NavLink to="/admin" className={navLink}>
            Admin
          </NavLink>
        </nav>
        <button type="button" className="button" aria-label="Toggle theme" aria-pressed={theme === 'dark'} onClick={toggle}>
          <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
      </div>
    </header>
  );
}
