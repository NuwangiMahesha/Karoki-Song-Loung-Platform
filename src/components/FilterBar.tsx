import React from 'react';
import { XIcon } from 'lucide-react';
import { allEras, allGenres, allLanguages } from '../data/songs';
import type { SongFilters } from '../utils/search';
import { filterCount, toggleValue } from '../utils/search';
import type { Era, Genre, Language } from '../types/song';

interface Props {
  filters: SongFilters;
  onChange: (filters: SongFilters) => void;
}

function Chip({
  label,
  active,
  onClick




}: {label: string;active: boolean;onClick: () => void;}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
      'rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-150 ease-smooth',
      active ?
      'border-magenta bg-magenta/20 text-white' :
      'border-line bg-white/[0.03] text-mist hover:border-white/25 hover:text-white'].
      join(' ')}>
      
      {label}
    </button>);

}

export function FilterBar({ filters, onChange }: Props) {
  const active = filterCount(filters);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-mist/70">Era</span>
        {allEras.map((era) =>
        <Chip
          key={era}
          label={era}
          active={filters.eras.includes(era)}
          onClick={() => onChange({ ...filters, eras: toggleValue<Era>(filters.eras, era) })} />

        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-mist/70">Language</span>
        {allLanguages.map((language) =>
        <Chip
          key={language}
          label={language}
          active={filters.languages.includes(language)}
          onClick={() =>
          onChange({
            ...filters,
            languages: toggleValue<Language>(filters.languages, language)
          })
          } />

        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="w-20 shrink-0 text-xs uppercase tracking-wider text-mist/70">Genre</span>
        {allGenres.map((genre) =>
        <Chip
          key={genre}
          label={genre}
          active={filters.genres.includes(genre)}
          onClick={() =>
          onChange({ ...filters, genres: toggleValue<Genre>(filters.genres, genre) })
          } />

        )}
        {active > 0 &&
        <button
          type="button"
          onClick={() => onChange({ eras: [], languages: [], genres: [] })}
          className="ml-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] text-mist transition-colors duration-150 ease-smooth hover:text-white">
          
            <XIcon className="h-3.5 w-3.5" /> Clear {active}
          </button>
        }
      </div>
    </div>);

}