import React, { useEffect, useState, useRef } from 'react';
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
  volume?: number;
  muted?: boolean;
  onToggle: () => void;
  onSeek?: (time: number) => void;
}

type Status = 'loading' | 'ready' | 'error';

const BARS = Array.from({ length: 28 });

export function VideoStage({ song, playing, time, currentLine, karaokeMode, volume = 1, muted = false, onToggle, onSeek }: Props) {
  const [status, setStatus] = useState<Status>('loading');
  const [attempt, setAttempt] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastTimeRef = useRef(time);
  const timeRef = useRef(time);
  timeRef.current = time;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  // Listen to YouTube's native iframe events to perfectly sync lyrics
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes('youtube')) return;
      try {
        const data = JSON.parse(event.data);
        
        // Sync time from YouTube's internal clock
        if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
          const ytTime = data.info.currentTime;
          // If lyrics drift more than 0.5s from actual video time (e.g. due to buffering), snap them back
          if (onSeek && Math.abs(timeRef.current - ytTime) > 0.5) {
            onSeek(ytTime);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSeek]);

  // Sync Play/Pause via native YouTube postMessage API
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      const command = playing ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    }
  }, [playing]);

  // Sync Volume via native YouTube postMessage API
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: muted ? 'mute' : 'unMute', args: [] }),
        '*'
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [volume * 100] }),
        '*'
      );
    }
  }, [volume, muted]);

  // Sync Seek via native YouTube postMessage API
  useEffect(() => {
    if (Math.abs(time - lastTimeRef.current) > 2) {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [time, true] }),
          '*'
        );
      }
    }
    lastTimeRef.current = time;
  }, [time]);

  useEffect(() => {
    setStatus('loading');
    const timer = window.setTimeout(() => {
      setStatus(song.videoUrl ? 'ready' : 'error');
    }, 850);
    return () => window.clearTimeout(timer);
  }, [song.id, song.videoUrl, attempt]);

  // Fix youtu.be links and extract ID for reliable loading
  const getYoutubeId = (url?: string) => {
    if (!url) return null;
    try {
      if (url.includes('youtu.be/')) {
        return url.split('youtu.be/')[1].split(/[?#]/)[0];
      }
      if (url.includes('youtube.com/watch')) {
        return new URL(url).searchParams.get('v');
      }
      if (url.includes('youtube.com/embed/')) {
        return url.split('youtube.com/embed/')[1].split(/[?#]/)[0];
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const youtubeId = getYoutubeId(song.videoUrl);

  // If there is a real video URL, just render the actual YouTube iframe
  // with no overlays blocking it, so it works perfectly.
  if (youtubeId && status !== 'error') {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-card sm:rounded-3xl">
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&disablekb=1&rel=0&iv_load_policy=3&showinfo=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          className="absolute inset-0 z-0"
        />
        {/* Invisible overlay so clicking the video area safely toggles play/pause from our app */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={onToggle} />
      </div>
    );
  }

  // Otherwise, fallback to the original mockup stage
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-card sm:rounded-3xl">
      <img
        src={song.thumbnail}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
        aria-hidden="true" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85 pointer-events-none" />

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

      {status === 'ready' && !song.videoUrl &&
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

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
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
            className={`group absolute inset-0 flex items-center justify-center ${playing ? 'pointer-events-none' : ''}`}>
          
            {!playing &&
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-magenta text-white shadow-glow transition-transform duration-150 ease-smooth group-hover:scale-105 group-active:scale-95 pointer-events-auto">
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