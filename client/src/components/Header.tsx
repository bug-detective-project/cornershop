import { Link, NavLink } from 'react-router';
import { useTheme } from '../theme.ts';

const navLink = ({ isActive }: { isActive: boolean }) => `rounded-lg px-3 py-2 font-medium ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600'}`;

export function Header() {
  const { theme, toggle } = useTheme();

  return (
    <header className="border-b border-slate-300 bg-white text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        <Link to="/" className="mr-auto text-xl font-bold text-slate-900">
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
