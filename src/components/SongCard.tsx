import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, Share2Icon } from 'lucide-react';
import type { Song } from '../types/song';
import { FavouriteButton } from './FavouriteButton';
import { useShare } from '../contexts/ShareContext';
import { formatTime } from '../utils/format';

interface Props {
  song: Song;
  compact?: boolean;
}

export function SongCard({ song, compact = false }: Props) {
  const { openShare } = useShare();

  return (
    <article
      className={[
      'group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-elevated/60 shadow-card backdrop-blur-md',
      'transition-[transform,border-color] duration-200 ease-smooth hover:-translate-y-1 hover:border-magenta/40',
      compact ? 'w-[168px] shrink-0 sm:w-[196px]' : 'w-full'].
      join(' ')}>
      
      <Link
        to={`/song/${song.slug}`}
        className="relative block aspect-square overflow-hidden"
        aria-label={`Play ${song.title} by ${song.artist}`}>
        
        <img
          src={song.thumbnail}
          alt={`${song.album} artwork`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur">
          {song.era}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2 py-1 text-[11px] tabular-nums text-white/80 backdrop-blur">
          {formatTime(song.duration)}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 translate-y-2 items-center justify-center rounded-full bg-magenta text-white opacity-0 shadow-glow transition-[opacity,transform] duration-200 ease-smooth group-hover:translate-y-0 group-hover:opacity-100">
            <PlayIcon className="ml-0.5 h-6 w-6 fill-current" />
          </span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="truncate text-[15px] font-semibold leading-tight">
          <Link to={`/song/${song.slug}`} className="hover:text-magenta">
            {song.title}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[13px] text-mist">{song.artist}</p>
        <p className="mt-1 truncate text-[12px] text-mist/70">
          {song.year} • {song.language}
        </p>
        <div className="mt-auto flex items-center justify-end gap-1 pt-3">
          <FavouriteButton song={song} />
          <button
            type="button"
            aria-label={`Share ${song.title}`}
            onClick={() => openShare(song)}
            className="rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
            
            <Share2Icon className="h-[17px] w-[17px]" />
          </button>
        </div>
      </div>
    </article>);

}