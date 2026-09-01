import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { Song } from '../types/song';
import { SongCard } from './SongCard';
import { SongCardSkeleton } from './Skeletons';

interface Props {
  title: string;
  subtitle?: string;
  songs: Song[];
  seeAllTo?: string;
  loading?: boolean;
}

export function SongRow({ title, subtitle, songs, seeAllTo, loading = false }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const nudge = (direction: 1 | -1) => {
    scroller.current?.scrollBy({ left: direction * 420, behavior: 'smooth' });
  };

  if (!loading && songs.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="min-w-0">
          <h2 className="font-display text-2xl leading-tight sm:text-[28px]">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-mist">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {seeAllTo &&
          <Link
            to={seeAllTo}
            className="text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white">
            
              See all
            </Link>
          }
          <div className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              onClick={() => nudge(-1)}
              className="glass rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:text-white">
              
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              onClick={() => nudge(1)}
              className="glass rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:text-white">
              
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        className="scroll-row flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 lg:px-10">
        
        {loading ?
        Array.from({ length: 6 }).map((_, index) =>
        <div key={index} className="w-[168px] shrink-0 sm:w-[196px]">
                <SongCardSkeleton />
              </div>
        ) :
        songs.map((song) =>
        <div key={song.id} className="snap-start">
                <SongCard song={song} compact />
              </div>
        )}
      </div>
    </section>);

}