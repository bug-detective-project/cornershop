import { Route, Routes } from 'react-router';
import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { Admin } from './pages/Admin.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { ProductPage } from './pages/ProductPage.tsx';
import { Storefront } from './pages/Storefront.tsx';

export function App() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-content">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
