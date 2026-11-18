import { Route, Routes } from 'react-router';
import { Header } from './components/Header.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { Storefront } from './pages/Storefront.tsx';

export function App() {
  return (
    <div className="min-h-screen bg-surface text-content">
      <Header />
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
