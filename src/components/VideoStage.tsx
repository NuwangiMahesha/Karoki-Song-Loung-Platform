import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangleIcon, PlayIcon, RotateCwIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LyricLine, Song } from '../types/song';

interface Props {
  song: Song;
  playing: boolean;
  time: number;
  currentLine?: LyricLine;
  karaokeMode: boolean;
  onToggle: () => void;
}

type Status = 'loading' | 'ready' | 'error';

const BARS = Array.from({ length: 28 });

export function VideoStage({ song, playing, time, currentLine, karaokeMode, onToggle }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setStatus('loading');
    const timer = window.setTimeout(() => {
      setStatus(song.videoUrl ? 'ready' : 'error');
    }, 850);
    return () => window.clearTimeout(timer);
  }, [song.id, song.videoUrl, attempt]);

  const progress = Math.min(100, time / song.duration * 100);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-card sm:rounded-3xl">
      <img
        src={song.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
        aria-hidden="true" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />

      {status === 'loading' &&
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-magenta" />
          <p className="text-sm text-mist">Loading karaoke track…</p>
        </div>
      }

      {status === 'error' &&
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-magenta/30 bg-magenta/10 text-magenta">
            <AlertTriangleIcon className="h-6 w-6" />
          </span>
          <p className="max-w-sm text-base font-medium">
            This karaoke video is temporarily unavailable.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
            type="button"
            onClick={() => setAttempt((prev) => prev + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform duration-150 ease-smooth active:scale-95">
            
              <RotateCwIcon className="h-4 w-4" /> Try again
            </button>
            <Link
            to={`/songs?era=${encodeURIComponent(song.era)}`}
            className="glass rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 ease-smooth hover:border-magenta/50">
            
              Browse similar songs
            </Link>
          </div>
        </div>
      }

      {status === 'ready' &&
      <>
          <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-end justify-center gap-[3px] px-6 pb-14 opacity-70">
            {BARS.map((_, index) =>
          <span
            key={index}
            className="w-full max-w-[10px] origin-bottom rounded-t-sm bg-gradient-to-t from-magenta/70 to-electric/70"
            style={{
              height: `${18 + index * 37 % 64}%`,
              animation: playing ?
              `eq ${700 + index * 53 % 500}ms ease-in-out ${index * 40}ms infinite` :
              'none',
              transform: playing ? undefined : 'scaleY(0.18)',
              transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1)'
            }} />

          )}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">
              {song.album} • {song.year}
            </p>
            <h2
            className={[
            'mt-2 font-display leading-tight',
            karaokeMode ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-4xl'].
            join(' ')}>
            
              {song.title}
            </h2>
            <p className="mt-1 text-sm text-mist">{song.artist}</p>

            {currentLine && playing &&
          <motion.p
            key={currentLine.start}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 max-w-2xl text-balance text-base font-medium text-white [text-shadow:0_0_24px_rgba(226,70,200,0.7)] sm:text-xl">
            
                {currentLine.text}
              </motion.p>
          }
          </div>

          <button
          type="button"
          onClick={onToggle}
          aria-label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          className="group absolute inset-0 flex items-center justify-center">
          
            {!playing &&
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-magenta text-white shadow-glow transition-transform duration-150 ease-smooth group-hover:scale-105 group-active:scale-95">
                <PlayIcon className="ml-1 h-8 w-8 fill-current" />
              </span>
          }
          </button>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div
            className="h-full bg-magenta"
            style={{ width: `${progress}%`, transition: 'width 120ms linear' }} />
          
          </div>
        </>
      }
    </div>);

}