import React from 'react';
import { Link } from 'react-router-dom';
import { MicVocalIcon, MusicIcon, Music2Icon, Music4Icon, SparklesIcon } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { HERO_IMAGE } from '../data/songs';
import { useCatalogue } from '../contexts/CatalogueContext';

const notes = [
{ Icon: MusicIcon, left: '8%', top: '22%', delay: '0s', size: 'h-6 w-6' },
{ Icon: Music2Icon, left: '18%', top: '68%', delay: '1.4s', size: 'h-5 w-5' },
{ Icon: Music4Icon, left: '82%', top: '28%', delay: '2.2s', size: 'h-7 w-7' },
{ Icon: MusicIcon, left: '90%', top: '64%', delay: '0.8s', size: 'h-5 w-5' },
{ Icon: Music2Icon, left: '68%', top: '14%', delay: '3s', size: 'h-4 w-4' }];


export function Hero() {
  const { catalogue: songs } = useCatalogue();
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden="true" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/70 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(226,70,200,0.18),transparent_70%)]" />

      {notes.map(({ Icon, left, top, delay, size }, index) =>
      <Icon
        key={index}
        aria-hidden="true"
        className={`absolute hidden animate-float text-magenta/50 sm:block ${size}`}
        style={{ left, top, animationDelay: delay }} />

      )}

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-10">
        <div className="max-w-3xl">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs text-mist">
            <SparklesIcon className="h-3.5 w-3.5 text-magenta" />
            {songs.length} karaoke tracks • Sinhala, English & Tamil
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] sm:text-7xl lg:text-[84px]">
            Sing the classics.
            <br />
            <span className="italic text-magenta">Feel every note.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            Your ultimate karaoke collection from the golden 70s to today's favourites — with
            lyrics that follow you line by line.
          </p>

          <div className="mt-8 max-w-xl">
            <SearchBar autoFocus={false} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/songs"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-150 ease-smooth hover:bg-white/90 active:scale-95">
              
              Explore songs
            </Link>
            <Link
              to={`/song/${songs[0]?.slug ?? ''}?karaoke=1`}
              className="inline-flex items-center gap-2 rounded-full bg-magenta px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
              
              <MicVocalIcon className="h-4 w-4" />
              Start singing
            </Link>
          </div>
        </div>
      </div>
    </section>);

}