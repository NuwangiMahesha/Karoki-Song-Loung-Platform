import type { Era, Genre, Language, LyricLine, Song } from '../types/song';

const ART: Record<Era, string> = {
  '70s': "/dce6cbee-9179-420c-9404-2c44a00171db.jpg",
  '80s': "/40ec3fae-1577-443c-b364-558f37d63005.jpg",
  '90s': "/40ec3fae-1577-443c-b364-558f37d63005.jpg",
  '2000s': "/4c0273fb-0a8a-40e5-b3f2-b3d591f40f21.jpg",
  '2010s': "/585edcdd-dee9-42e9-9f4d-4fd567251d8e.jpg",
  Latest: "/585edcdd-dee9-42e9-9f4d-4fd567251d8e.jpg"
};

export const HERO_IMAGE = "/9c6da37b-4b62-4c82-901e-8fdb5634a1e0.jpg";


const INTRO = 7;
const LINE = 5.2;
const OUTRO = 12;

function timed(lines: string[]): LyricLine[] {
  return lines.map((text, i) => ({
    start: +(INTRO + i * LINE).toFixed(2),
    end: +(INTRO + (i + 1) * LINE).toFixed(2),
    text
  }));
}

function slugify(value: string): string {
  return value.
  toLowerCase().
  replace(/[^a-z0-9]+/g, '-').
  replace(/^-|-$/g, '');
}

interface Draft {
  title: string;
  artist: string;
  album: string;
  year: number;
  era: Era;
  language: Language;
  genre: Genre;
  plays: number;
  featured?: boolean;
  broken?: boolean;
  lines: string[];
  translation?: Partial<Record<Language, string[]>>;
}

const drafts: Draft[] = [];


export const songs: Song[] = drafts.map((draft, index) => {
  const lyrics: Partial<Record<Language, LyricLine[]>> = {
    [draft.language]: timed(draft.lines)
  };
  if (draft.translation) {
    for (const [lang, lines] of Object.entries(draft.translation)) {
      lyrics[lang as Language] = timed(lines as string[]);
    }
  }
  const duration = Math.round(INTRO + draft.lines.length * LINE + OUTRO);
  return {
    id: `sng-${String(index + 1).padStart(3, '0')}`,
    slug: slugify(draft.title),
    title: draft.title,
    artist: draft.artist,
    album: draft.album,
    year: draft.year,
    era: draft.era,
    language: draft.language,
    genre: draft.genre,
    thumbnail: ART[draft.era],
    videoUrl: draft.broken ? '' : `https://stream.karaokelounge.app/v/${slugify(draft.title)}.m3u8`,
    duration,
    plays: draft.plays,
    featured: Boolean(draft.featured),
    lyrics
  };
});

export const eras: {
  era: Era;
  label: string;
  blurb: string;
  image: string;
  query: string;
}[] = [
{
  era: '70s',
  label: '70s Classics',
  blurb: 'Golden-era songs and timeless classics.',
  image: ART['70s'],
  query: '70s'
},
{
  era: '80s',
  label: '80s & 90s Hits',
  blurb: 'Iconic songs from the most memorable decades.',
  image: ART['80s'],
  query: '80s,90s'
},
{
  era: '2000s',
  label: '2000s Hits',
  blurb: 'Popular songs from the early 2000s.',
  image: ART['2000s'],
  query: '2000s'
},
{
  era: '2010s',
  label: '2010s Hits',
  blurb: 'Modern classics and radio favourites.',
  image: ART['2010s'],
  query: '2010s'
},
{
  era: 'Latest',
  label: 'Latest Songs',
  blurb: 'Recently added karaoke tracks.',
  image: ART.Latest,
  query: 'Latest'
}];


export const allEras: Era[] = ['70s', '80s', '90s', '2000s', '2010s', 'Latest'];
export const allLanguages: Language[] = ['Sinhala', 'English', 'Tamil'];
export const allGenres: Genre[] = [
'Pop',
'Rock',
'Classic',
'Romantic',
'Oldies',
'Bollywood',
'Folk',
'Movie Songs'];


export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function countByEra(era: Era): number {
  if (era === '80s') return songs.filter((s) => s.era === '80s' || s.era === '90s').length;
  return songs.filter((s) => s.era === era).length;
}