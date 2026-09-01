import { useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  duration: number;
  initialPosition?: number;
  onEnded?: () => void;
}

export interface PlaybackState {
  time: number;
  playing: boolean;
  rate: number;
  volume: number;
  muted: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

/**
 * Drives karaoke playback from a monotonic clock so lyrics stay in sync with the
 * stream position, independent of render cadence.
 */
export function usePlayback({ duration, initialPosition = 0, onEnded }: Options): PlaybackState {
  const [time, setTime] = useState(initialPosition);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const frame = useRef<number>();
  const last = useRef<number>(0);
  const rateRef = useRef(rate);
  rateRef.current = rate;
  const endedRef = useRef(onEnded);
  endedRef.current = onEnded;

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (now: number) => {
      const delta = (now - last.current) / 1000 * rateRef.current;
      last.current = now;
      setTime((prev) => {
        const next = prev + delta;
        if (next >= duration) {
          setPlaying(false);
          endedRef.current?.();
          return duration;
        }
        return next;
      });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [playing, duration]);

  const play = useCallback(() => {
    setTime((prev) => prev >= duration - 0.25 ? 0 : prev);
    setPlaying(true);
  }, [duration]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => playing ? pause() : play(), [playing, pause, play]);

  const seek = useCallback(
    (seconds: number) => setTime(Math.min(Math.max(seconds, 0), duration)),
    [duration]
  );

  const skip = useCallback(
    (delta: number) => setTime((prev) => Math.min(Math.max(prev + delta, 0), duration)),
    [duration]
  );

  const setVolume = useCallback((next: number) => {
    setVolumeState(next);
    if (next > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((prev) => !prev), []);

  return {
    time,
    playing,
    rate,
    volume,
    muted,
    play,
    pause,
    toggle,
    seek,
    skip,
    setRate,
    setVolume,
    toggleMute
  };
}