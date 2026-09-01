export type Era = '70s' | '80s' | '90s' | '2000s' | '2010s' | 'Latest';

export type Language = 'Sinhala' | 'English' | 'Tamil';

export type Genre =
'Pop' |
'Rock' |
'Classic' |
'Romantic' |
'Oldies' |
'Bollywood' |
'Folk' |
'Movie Songs';

export interface LyricLine {
  start: number;
  end: number;
  text: string;
}

export interface Song {
  id: string;
  slug: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  era: Era;
  language: Language;
  genre: Genre;
  thumbnail: string;
  videoUrl: string;
  /** total runtime in seconds */
  duration: number;
  plays: number;
  featured: boolean;
  /** synchronized lyrics keyed by language — the song's own language is always present */
  lyrics: Partial<Record<Language, LyricLine[]>>;
}

export interface PlaybackProgress {
  songId: string;
  position: number;
  updatedAt: number;
}