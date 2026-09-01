import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { GlobeIcon, HeartIcon, MenuIcon, MicVocalIcon, SearchIcon, UserIcon, XIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { usePreferences } from '../contexts/PreferencesContext';
import { allLanguages } from '../data/songs';
import type { Language } from '../types/song';

const links = [
{ to: '/', label: 'Home', end: true },
{ to: '/songs', label: 'Songs' },
{ to: '/songs?era=70s', label: '70s' },
{ to: '/songs?era=90s', label: '90s' },
{ to: '/songs?era=2000s', label: '2000s' },
{ to: '/favourites', label: 'Favourites' }];


export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage } = usePreferences();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
      'sticky top-0 z-50 w-full transition-colors duration-200 ease-smooth',
      scrolled ? 'glass-strong border-b border-line' : 'border-b border-transparent bg-transparent'].
      join(' ')}>
      
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-magenta text-white shadow-glow">
            <MicVocalIcon className="h-5 w-5" />
          </span>
          <span className="font-display text-xl tracking-tight">Karaoke Lounge</span>
        </Link>

        <ul className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((link) =>
          <li key={link.label}>
              <NavLink
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
              [
              'rounded-full px-3.5 py-2 text-sm transition-colors duration-150 ease-smooth',
              isActive && link.to === location.pathname + location.search ?
              'bg-white/10 text-white' :
              'text-mist hover:text-white'].
              join(' ')
              }>
              
                {link.label}
              </NavLink>
            </li>
          )}
        </ul>

        <div className="ml-auto hidden w-full max-w-xs xl:block">
          <SearchBar size="sm" placeholder="Search songs or artists…" />
        </div>

        <div className="ml-auto flex items-center gap-1 xl:ml-2">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((prev) => !prev)}
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white xl:hidden">
            
            <SearchIcon className="h-5 w-5" />
          </button>

          <div className="relative hidden items-center sm:flex">
            <GlobeIcon className="pointer-events-none absolute left-2.5 h-4 w-4 text-mist" />
            <label htmlFor="nav-language" className="sr-only">
              Preferred lyrics language
            </label>
            <select
              id="nav-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
              className="glass appearance-none rounded-full py-2 pl-8 pr-3 text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white">
              
              {allLanguages.map((item) =>
              <option key={item} value={item} className="bg-elevated text-white">
                  {item}
                </option>
              )}
            </select>
          </div>

          <Link
            to="/favourites"
            aria-label="My favourites"
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white lg:hidden">
            
            <HeartIcon className="h-5 w-5" />
          </Link>

          <Link
            to="/admin"
            aria-label="Admin profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/5 text-mist transition-colors duration-150 ease-smooth hover:text-white">
            
            <UserIcon className="h-[18px] w-[18px]" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white lg:hidden">
            
            {menuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen &&
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="glass-strong overflow-visible border-t border-line px-4 py-3 xl:hidden">
          
            <SearchBar size="sm" autoFocus />
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen &&
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="glass-strong border-t border-line lg:hidden">
          
            <ul className="flex flex-col p-3">
              {links.map((link) =>
            <li key={link.label}>
                  <Link
                to={link.to}
                className="block rounded-xl px-4 py-3 text-sm text-mist transition-colors duration-150 ease-smooth hover:bg-white/5 hover:text-white">
                
                    {link.label}
                  </Link>
                </li>
            )}
              <li className="sm:hidden">
                <div className="flex items-center justify-between rounded-xl px-4 py-3">
                  <span className="text-sm text-mist">Language</span>
                  <select
                  aria-label="Preferred lyrics language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="glass rounded-full px-3 py-1.5 text-sm">
                  
                    {allLanguages.map((item) =>
                  <option key={item} value={item} className="bg-elevated text-white">
                        {item}
                      </option>
                  )}
                  </select>
                </div>
              </li>
            </ul>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}