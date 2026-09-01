import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogueProvider } from './contexts/CatalogueContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { ShareProvider } from './contexts/ShareContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { Home } from './pages/Home';
import { Songs } from './pages/Songs';
import { SongPage } from './pages/SongPage';
import { Favourites } from './pages/Favourites';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="min-h-[60vh] w-full">
        
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/song/:slug" element={<SongPage />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>);

}

export function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <CatalogueProvider>
          <LibraryProvider>
            <ShareProvider>
              <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-ink text-white">
                <ScrollToTop />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
              </div>
            </ShareProvider>
          </LibraryProvider>
        </CatalogueProvider>
      </PreferencesProvider>
    </BrowserRouter>);

}