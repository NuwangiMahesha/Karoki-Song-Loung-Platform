import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import type { Song } from '../types/song';
import { formatTime } from '../utils/format';

interface Props {
  song: Song;
  position: number;
}

export function ContinueSinging({ song, position }: Props) {
  const percent = Math.round(position / song.duration * 100);

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <h2 className="mb-4 font-display text-2xl sm:text-[28px]">Continue singing</h2>
      <div className="glass flex flex-col gap-5 rounded-3xl p-4 sm:flex-row sm:items-center sm:p-5">
        <img
          src={song.thumbnail}
          alt={`${song.album} artwork`}
          loading="lazy"
          className="h-40 w-full rounded-2xl object-cover sm:h-24 sm:w-24" />
        
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold">{song.title}</h3>
          <p className="truncate text-sm text-mist">
            {song.artist} • {song.year}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${song.title} progress`}>
              
              <div className="h-full rounded-full bg-magenta" style={{ width: `${percent}%` }} />
            </div>
            <span className="shrink-0 text-xs tabular-nums text-mist">
              {formatTime(position)} / {formatTime(song.duration)} • {percent}%
            </span>
          </div>
        </div>
        <Link
          to={`/song/${song.slug}?t=${Math.floor(position)}`}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-magenta px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
          
          Continue
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>);

}