import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type { PlaybackProgress, Song } from '../types/song';
import { useCatalogue } from './CatalogueContext';

const KEY = 'karaoke-lounge:v1';

interface StoredState {
  favourites: string[];
  recent: string[];
  progress: Record<string, PlaybackProgress>;
}

const initialState: StoredState = { favourites: [], recent: [], progress: {} };

function load(): StoredState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      favourites: parsed.favourites ?? [],
      recent: parsed.recent ?? [],
      progress: parsed.progress ?? {}
    };
  } catch {
    return initialState;
  }
}

interface LibraryValue {
  favourites: string[];
  recent: string[];
  progress: Record<string, PlaybackProgress>;
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
  markPlayed: (id: string) => void;
  saveProgress: (id: string, position: number) => void;
  clearProgress: (id: string) => void;
  favouriteSongs: Song[];
  recentSongs: Song[];
  continueSong: {song: Song;position: number;} | null;
}

const LibraryContext = createContext<LibraryValue | null>(null);

export function LibraryProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<StoredState>(load);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {

      /* storage unavailable — session-only library */}
  }, [state]);

  const toggleFavourite = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      favourites: prev.favourites.includes(id) ?
      prev.favourites.filter((item) => item !== id) :
      [id, ...prev.favourites]
    }));
  }, []);

  const markPlayed = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      recent: [id, ...prev.recent.filter((item) => item !== id)].slice(0, 12)
    }));
  }, []);

  const saveProgress = useCallback((id: string, position: number) => {
    setState((prev) => ({
      ...prev,
      progress: { ...prev.progress, [id]: { songId: id, position, updatedAt: Date.now() } }
    }));
  }, []);

  const clearProgress = useCallback((id: string) => {
    setState((prev) => {
      const next = { ...prev.progress };
      delete next[id];
      return { ...prev, progress: next };
    });
  }, []);

  const { catalogue: songs } = useCatalogue();

  const value = useMemo<LibraryValue>(() => {
    const byId = new Map(songs.map((song) => [song.id, song]));
    const favouriteSongs = state.favourites.
    map((id) => byId.get(id)).
    filter((song): song is Song => Boolean(song));
    const recentSongs = state.recent.
    map((id) => byId.get(id)).
    filter((song): song is Song => Boolean(song));

    const latestProgress = Object.values(state.progress).
    filter((entry) => {
      const song = byId.get(entry.songId);
      return song && entry.position > 4 && entry.position < song.duration - 8;
    }).
    sort((a, b) => b.updatedAt - a.updatedAt)[0];

    const continueSong = latestProgress ?
    { song: byId.get(latestProgress.songId) as Song, position: latestProgress.position } :
    null;

    return {
      favourites: state.favourites,
      recent: state.recent,
      progress: state.progress,
      isFavourite: (id: string) => state.favourites.includes(id),
      toggleFavourite,
      markPlayed,
      saveProgress,
      clearProgress,
      favouriteSongs,
      recentSongs,
      continueSong
    };
  }, [state, toggleFavourite, markPlayed, saveProgress, clearProgress, songs]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary(): LibraryValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
}