import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import type { Era } from '../types/song';

interface Props {
  era: Era;
  label: string;
  blurb: string;
  image: string;
  count: number;
  query?: string;
}

export function CategoryCard({ era, label, blurb, image, count, query }: Props) {
  return (
    <Link
      to={`/songs?era=${encodeURIComponent(query ?? era)}`}
      className="group relative flex h-56 w-[260px] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-line shadow-card transition-[transform,border-color] duration-200 ease-smooth hover:-translate-y-1 hover:border-magenta/50 sm:h-64 sm:w-auto">
      
      <img
        src={image}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-smooth group-hover:scale-105" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <div className="relative p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-magenta">{era}</p>
        <h3 className="mt-1 font-display text-2xl leading-tight">{label}</h3>
        <p className="mt-1.5 text-sm leading-snug text-mist">{blurb}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-mist/80">{count} songs</span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 ease-smooth group-hover:bg-magenta">
            Explore
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>);

}