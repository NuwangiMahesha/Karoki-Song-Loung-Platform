import type { Era, Genre, Language, Song } from '../types/song';

export interface SongFilters {
  eras: Era[];
  languages: Language[];
  genres: Genre[];
}

export const emptyFilters: SongFilters = { eras: [], languages: [], genres: [] };

function haystack(song: Song): string {
  return [song.title, song.artist, song.album, song.year, song.language, song.era, song.genre].
  join(' ').
  toLowerCase();
}

export function searchSongs(list: Song[], query: string): Song[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((song) => {
    const hay = haystack(song);
    return terms.every((term) => hay.includes(term));
  });
}

export function applyFilters(list: Song[], filters: SongFilters): Song[] {
  return list.filter((song) => {
    if (filters.eras.length && !filters.eras.includes(song.era)) return false;
    if (filters.languages.length && !filters.languages.includes(song.language)) return false;
    if (filters.genres.length && !filters.genres.includes(song.genre)) return false;
    return true;
  });
}

export function filterCount(filters: SongFilters): number {
  return filters.eras.length + filters.languages.length + filters.genres.length;
}

export function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}