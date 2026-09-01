import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react';
import { allEras, songs } from '../data/songs';
import { SongCard } from '../components/SongCard';
import { FilterBar } from '../components/FilterBar';
import { SongGridSkeleton } from '../components/Skeletons';
import { EmptyState } from '../components/EmptyState';
import { useDebounced } from '../hooks/useDebounced';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { applyFilters, emptyFilters, searchSongs } from '../utils/search';
import type { SongFilters } from '../utils/search';
import type { Era } from '../types/song';

export function Songs() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const eraParam = params.get('era');

  const parseEras = (value: string | null): Era[] =>
  (value ?? '').
  split(',').
  map((item) => item.trim()).
  filter((item): item is Era => allEras.includes(item as Era));

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SongFilters>(() => ({
    ...emptyFilters,
    eras: parseEras(eraParam)
  }));
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounced(query, 140);
  const loading = useSimulatedLoad(450, [eraParam]);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
    const next = parseEras(params.get('era'));
    setFilters((prev) => ({ ...prev, eras: next.length ? next : prev.eras }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const results = useMemo(
    () => applyFilters(searchSongs(songs, debouncedQuery), filters),
    [debouncedQuery, filters]
  );

  const updateQuery = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(params);
    if (value) next.set('q', value);else
    next.delete('q');
    setParams(next, { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl">All karaoke songs</h1>
        <p className="mt-2 text-sm text-mist">
          {songs.length} tracks across five eras, three languages and every mood.
        </p>
      </header>

      <div className="sticky top-16 z-30 -mx-4 mb-6 bg-ink/85 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            <label htmlFor="catalogue-search" className="sr-only">
              Search the catalogue
            </label>
            <input
              id="catalogue-search"
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder="Search by title, artist, album, year, language or era…"
              className="glass h-11 w-full rounded-full pl-11 pr-10 text-sm placeholder:text-mist/70 focus:border-magenta/60" />
            
            {query &&
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => updateQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-mist hover:text-white">
              
                <XIcon className="h-4 w-4" />
              </button>
            }
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
            className="glass inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white lg:hidden">
            
            <SlidersHorizontalIcon className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} mt-4 lg:block`}>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
      </div>

      {loading ?
      <SongGridSkeleton count={10} /> :
      results.length === 0 ?
      <div className="py-10">
          <EmptyState
          icon={SearchIcon}
          title="Nothing matched that."
          description="Try a different artist, decade or language — the catalogue spans Sinhala, English and Tamil."
          actionLabel="Reset filters"
          onAction={() => {
            setFilters(emptyFilters);
            updateQuery('');
          }} />
        
        </div> :

      <>
          <p className="mb-4 text-sm text-mist">
            {results.length} {results.length === 1 ? 'song' : 'songs'}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((song) =>
          <SongCard key={song.id} song={song} />
          )}
          </div>
        </>
      }
    </div>);

}