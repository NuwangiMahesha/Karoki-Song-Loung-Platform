import React from 'react';
import { HeartIcon } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import type { Song } from '../types/song';

interface Props {
  song: Song;
  size?: 'sm' | 'lg';
  withLabel?: boolean;
}

export function FavouriteButton({ song, size = 'sm', withLabel = false }: Props) {
  const { isFavourite, toggleFavourite } = useLibrary();
  const active = isFavourite(song.id);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${song.title} from favourites` : `Add ${song.title} to favourites`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavourite(song.id);
      }}
      className={[
      'inline-flex items-center gap-2 rounded-full transition-colors duration-150 ease-smooth',
      size === 'lg' ? 'glass px-4 py-2.5 text-sm font-medium' : 'p-2',
      active ? 'text-magenta' : 'text-mist hover:text-white',
      size === 'sm' ? 'hover:bg-white/10' : 'hover:border-magenta/50'].
      join(' ')}>
      
      <HeartIcon
        className={[
        size === 'lg' ? 'h-4 w-4' : 'h-[18px] w-[18px]',
        'transition-transform duration-150 ease-smooth',
        active ? 'scale-110 fill-current' : ''].
        join(' ')} />
      
      {withLabel && <span>{active ? 'Saved' : 'Favourite'}</span>}
    </button>);

}