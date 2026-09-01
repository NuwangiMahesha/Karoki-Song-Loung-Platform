import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  MicVocalIcon,
  MusicIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Share2Icon,
  XIcon } from
'lucide-react';
import { useCatalogue } from '../contexts/CatalogueContext';
import type { Language } from '../types/song';
import { VideoStage } from '../components/VideoStage';
import { PlayerControls } from '../components/PlayerControls';
import { LyricsDisplay } from '../components/LyricsDisplay';
import { FavouriteButton } from '../components/FavouriteButton';
import { SongRow } from '../components/SongRow';
import { EmptyState } from '../components/EmptyState';
import { PlayerSkeleton } from '../components/Skeletons';
import { useLibrary } from '../contexts/LibraryContext';
import { useShare } from '../contexts/ShareContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { usePlayback } from '../hooks/usePlayback';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';
import { formatPlays, formatTime } from '../utils/format';

export function SongPage() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const { catalogue: songs, loading: catalogueLoading } = useCatalogue();
  const song = useMemo(() => songs.find(s => s.slug === slug), [songs, slug]);
  const loading = useSimulatedLoad(420, [slug]) || catalogueLoading;

  const { markPlayed, saveProgress } = useLibrary();
  const { openShare } = useShare();
  const { language: preferred } = usePreferences();

  const resumeAt = Number(params.get('t') ?? 0);
  const [karaokeMode, setKaraokeMode] = useState(params.get('karaoke') === '1');
  const [fullscreen, setFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const availableLanguages = useMemo(
    () => song ? Object.keys(song.lyrics) as Language[] : [],
    [song]
  );
  const [lyricLanguage, setLyricLanguage] = useState<Language>('English');

  useEffect(() => {
    if (!song) return;
    setLyricLanguage(
      availableLanguages.includes(preferred) ? preferred : availableLanguages[0] ?? song.language
    );
  }, [song, preferred, availableLanguages]);

  const duration = song?.duration ?? 0;
  const playback = usePlayback({
    duration,
    initialPosition: Number.isFinite(resumeAt) ? Math.min(resumeAt, Math.max(duration - 1, 0)) : 0
  });
  const { time, playing, toggle, seek, skip, pause } = playback;

  useEffect(() => {
    if (song) markPlayed(song.id);
  }, [song, markPlayed]);

  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    if (!song || !playing) return;
    const timer = window.setInterval(() => saveProgress(song.id, timeRef.current), 2500);
    return () => window.clearInterval(timer);
  }, [song, playing, saveProgress]);

  useEffect(() => {
    const id = song?.id;
    return () => {
      if (id && timeRef.current > 4) saveProgress(id, timeRef.current);
    };
  }, [song?.id, saveProgress]);

  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = stageRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void node.requestFullscreen?.().catch(() => setFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT') return;
      if (event.code === 'Space') {
        event.preventDefault();
        toggle();
      }
      if (event.key === 'ArrowRight') skip(5);
      if (event.key === 'ArrowLeft') skip(-5);
      if (event.key === 'Escape' && karaokeMode) setKaraokeMode(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, skip, karaokeMode]);

  const lines = song?.lyrics[lyricLanguage] ?? [];
  const currentLine = lines.find((line) => time >= line.start && time < line.end);

  const similar = useMemo(() => {
    if (!song) return [];
    return songs.
    filter((item) => item.id !== song.id && (item.era === song.era || item.genre === song.genre)).
    slice(0, 10);
  }, [song]);

  if (!song && !loading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-4 py-24 sm:px-6 lg:px-10">
        <EmptyState
          icon={MusicIcon}
          title="We could not find that song."
          description="The link may be out of date. Browse the catalogue to find another karaoke track."
          actionLabel="Explore songs"
          actionTo="/songs" />
        
      </div>);

  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-10">
      <Link
        to="/songs"
        className="inline-flex items-center gap-2 text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white">
        
        <ArrowLeftIcon className="h-4 w-4" /> Back to songs
      </Link>

      {loading ?
      <div className="mt-6">
          <PlayerSkeleton />
        </div> :

      <>
          <header className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-mist">
                <span className="rounded-full border border-magenta/40 bg-magenta/10 px-2.5 py-1 text-magenta">
                  {song.era}
                </span>
                <span>{song.year}</span>
                <span>•</span>
                <span>{song.language}</span>
                <span>•</span>
                <span>{song.genre}</span>
              </div>
              <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">{song.title}</h1>
              <p className="mt-1 text-mist">
                {song.artist} • {song.album} • {formatPlays(song.plays)} sings •{' '}
                {formatTime(song.duration)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <FavouriteButton song={song} size="lg" withLabel />
              <button
              type="button"
              onClick={() => openShare(song)}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-mist transition-colors duration-150 ease-smooth hover:border-magenta/50 hover:text-white">
              
                <Share2Icon className="h-4 w-4" /> Share
              </button>
              <button
              type="button"
              onClick={() => setKaraokeMode(true)}
              className="inline-flex items-center gap-2 rounded-full bg-magenta px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
              
                <MicVocalIcon className="h-4 w-4" /> Karaoke mode
              </button>
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div ref={stageRef} className="space-y-4 bg-ink">
              <VideoStage
                song={song}
                playing={playing}
                time={time}
                currentLine={currentLine}
                karaokeMode={false}
                volume={playback.volume}
                muted={playback.muted}
                onToggle={toggle}
                onSeek={playback.seek}
              />
            
              <PlayerControls
              playback={playback}
              duration={song.duration}
              fullscreen={fullscreen}
              onToggleFullscreen={toggleFullscreen} />
            
            </div>

            <section className="glass flex min-h-[420px] flex-col rounded-3xl py-5">
              <div className="flex items-center justify-between gap-3 px-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-mist">
                  <MicVocalIcon className="h-4 w-4 text-magenta" /> Lyrics
                </h2>
                {availableLanguages.length > 1 &&
              <div className="flex items-center gap-1 rounded-full border border-line bg-white/[0.03] p-1">
                    {availableLanguages.map((item) =>
                <button
                  key={item}
                  type="button"
                  aria-pressed={lyricLanguage === item}
                  onClick={() => setLyricLanguage(item)}
                  className={[
                  'rounded-full px-3 py-1 text-xs transition-colors duration-150 ease-smooth',
                  lyricLanguage === item ? 'bg-white text-ink' : 'text-mist hover:text-white'].
                  join(' ')}>
                  
                        {item}
                      </button>
                )}
                  </div>
              }
              </div>
              <div className="mt-3 flex-1">
                <LyricsDisplay lines={lines} time={time} onSeek={seek} />
              </div>
              <p className="px-5 pt-3 text-center text-xs text-mist/70">
                Tap any line to jump straight to it.
              </p>
            </section>
          </div>

          <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-10">
            <SongRow title="Up next for you" songs={similar} seeAllTo={`/songs?era=${song.era}`} />
          </div>
        </>
      }

      <AnimatePresence>
        {karaokeMode &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-[60] flex flex-col bg-ink">
          
            <div className="flex items-center justify-between px-4 py-3 sm:px-8">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{song.title}</p>
                <p className="truncate text-xs text-mist">{song.artist}</p>
              </div>
              <button
              type="button"
              onClick={() => setKaraokeMode(false)}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white">
              
                <XIcon className="h-4 w-4" /> Exit karaoke
              </button>
            </div>

            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-4 px-4 pb-6 sm:px-8">
              <VideoStage
                song={song}
                playing={playing}
                time={time}
                currentLine={currentLine}
                karaokeMode={true}
                volume={playback.volume}
                muted={playback.muted}
                onToggle={toggle}
                onSeek={playback.seek}
              />
            
              <LyricsDisplay lines={lines} time={time} karaokeMode onSeek={seek} />
              <div className="flex items-center justify-center gap-4">
                <button
                type="button"
                aria-label="Rewind 10 seconds"
                onClick={() => skip(-10)}
                className="rounded-full p-3 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
                
                  <RotateCcwIcon className="h-6 w-6" />
                </button>
                <button
                type="button"
                aria-label={playing ? 'Pause' : 'Play'}
                onClick={playing ? pause : toggle}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-magenta text-white shadow-glow transition-transform duration-150 ease-smooth active:scale-95">
                
                  {playing ?
                <PauseIcon className="h-7 w-7 fill-current" /> :

                <PlayIcon className="ml-1 h-7 w-7 fill-current" />
                }
                </button>
                <button
                type="button"
                aria-label="Forward 10 seconds"
                onClick={() => skip(10)}
                className="rounded-full p-3 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
                
                  <RotateCwIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}