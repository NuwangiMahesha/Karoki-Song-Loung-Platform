import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon } from 'lucide-react';
import { useCatalogue } from '../contexts/CatalogueContext';
import { searchSongs } from '../utils/search';
import { useDebounced } from '../hooks/useDebounced';

interface Props {
  placeholder?: string;
  size?: 'sm' | 'lg';
  autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Search songs, artists, albums…',
  size = 'lg',
  autoFocus = false
}: Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const debounced = useDebounced(query, 140);
  const navigate = useNavigate();
  const wrap = useRef<HTMLDivElement>(null);
  
  const { catalogue: songs } = useCatalogue();

  const results = useMemo(
    () => debounced.trim() ? searchSongs(songs, debounced).slice(0, 6) : [],
    [debounced, songs]
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrap.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setOpen(false);
    navigate(`/songs?q=${encodeURIComponent(query.trim())}`);
  };

  const go = (slug: string) => {
    setOpen(false);
    setQuery('');
    navigate(`/song/${slug}`);
  };

  return (
    <div ref={wrap} className="relative w-full">
      <form onSubmit={submit} role="search">
        <label htmlFor={`search-${size}`} className="sr-only">
          Search karaoke songs
        </label>
        <SearchIcon
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist ${
          size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'}`
          } />
        
        <input
          id={`search-${size}`}
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={[
          'glass w-full rounded-full pl-11 pr-10 text-white placeholder:text-mist/70',
          'transition-colors duration-150 ease-smooth focus:border-magenta/60',
          size === 'lg' ? 'h-14 text-base' : 'h-10 text-sm'].
          join(' ')} />
        
        {query &&
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist transition-colors duration-150 ease-smooth hover:text-white">
          
            <XIcon className="h-4 w-4" />
          </button>
        }
      </form>

      {open && debounced.trim().length > 0 &&
      <div className="glass-strong absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl shadow-card">
          {results.length === 0 ?
        <p className="px-4 py-5 text-sm text-mist">
              No songs match “{debounced}”. Try an artist or an era.
            </p> :

        <ul>
              {results.map((song) =>
          <li key={song.id}>
                  <button
              type="button"
              onClick={() => go(song.slug)}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-150 ease-smooth hover:bg-white/5">
              
                    <img
                src={song.thumbnail}
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded-lg object-cover" />
              
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{song.title}</span>
                      <span className="block truncate text-xs text-mist">
                        {song.artist} • {song.year} • {song.language}
                      </span>
                    </span>
                    <span className="shrink-0 text-[11px] uppercase tracking-wide text-mist/70">
                      {song.era}
                    </span>
                  </button>
                </li>
          )}
            </ul>
        }
        </div>
      }
    </div>);

}