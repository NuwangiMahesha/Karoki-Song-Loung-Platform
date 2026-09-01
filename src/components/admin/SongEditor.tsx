import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Era, Genre, Language, LyricLine, Song } from '../../types/song';
import { allEras, allGenres, allLanguages } from '../../data/songs';
import { formatTime } from '../../utils/format';

interface Props {
  song: Song | null;
  onClose: () => void;
  onSave: (song: Song) => void;
}

function toTimeline(lines: LyricLine[]): string {
  return lines.map((line) => `${formatTime(line.start)} ${line.text}`).join('\n');
}

function parseTimeline(value: string, fallbackGap = 5): LyricLine[] {
  const rows = value.
  split('\n').
  map((row) => row.trim()).
  filter(Boolean);

  const parsed = rows.map((row, index) => {
    const match = row.match(/^(\d{1,2}):(\d{2})\s+(.*)$/);
    if (!match) return { start: index * fallbackGap, text: row };
    return {
      start: Number(match[1]) * 60 + Number(match[2]),
      text: match[3]
    };
  });

  return parsed.map((entry, index) => ({
    start: entry.start,
    end: parsed[index + 1]?.start ?? entry.start + fallbackGap,
    text: entry.text
  }));
}

const blank: Song = {
  id: '',
  slug: '',
  title: '',
  artist: '',
  album: '',
  year: new Date().getFullYear(),
  era: 'Latest',
  language: 'English',
  genre: 'Pop',
  thumbnail: '',
  videoUrl: '',
  duration: 180,
  plays: 0,
  featured: false,
  lyrics: {}
};

const field =
'w-full rounded-xl border border-line bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-mist/60 focus:border-magenta/60';
const label = 'mb-1.5 block text-xs uppercase tracking-wider text-mist';

export function SongEditor({ song, onClose, onSave }: Props) {
  const isEdit = Boolean(song?.id);
  const [draft, setDraft] = useState<Song>(song ?? blank);
  const [lyricLanguage, setLyricLanguage] = useState<Language>(
    Object.keys(song?.lyrics ?? {})[0] as Language ?? song?.language ?? 'English'
  );
  const [timeline, setTimeline] = useState(toTimeline(song?.lyrics?.[lyricLanguage] ?? []));

  const update = <K extends keyof Song,>(key: K, value: Song[K]) =>
  setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const lines = parseTimeline(timeline);
    const baseSlug = draft.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '').replace(/^-|-$/g, '');
    const finalSlug = baseSlug || draft.slug || `song-${Date.now()}`;
    const newId = draft.id || `sng-${Date.now()}`;
    
    onSave({
      ...draft,
      slug: finalSlug,
      id: newId,
      lyrics: { ...draft.lyrics, [lyricLanguage]: lines },
      duration: lines.length ? Math.max(draft.duration, lines[lines.length - 1].end + 8) : draft.duration
    });
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="presentation">
      
      <motion.form
        onSubmit={submit}
        onClick={(event) => event.stopPropagation()}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
        className="glass-strong flex h-full w-full max-w-xl flex-col overflow-y-auto"
        aria-label={isEdit ? `Edit ${draft.title}` : 'Add a song'}>
        
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-elevated/95 px-6 py-4 backdrop-blur">
          <h2 className="font-display text-2xl">{isEdit ? 'Edit song' : 'Add song'}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
            
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="song-title">
                Title
              </label>
              <input
                id="song-title"
                required
                className={field}
                value={draft.title}
                onChange={(event) => update('title', event.target.value)} />
              
            </div>
            <div>
              <label className={label} htmlFor="song-artist">
                Artist
              </label>
              <input
                id="song-artist"
                required
                className={field}
                value={draft.artist}
                onChange={(event) => update('artist', event.target.value)} />
              
            </div>
            <div>
              <label className={label} htmlFor="song-album">
                Album
              </label>
              <input
                id="song-album"
                className={field}
                value={draft.album}
                onChange={(event) => update('album', event.target.value)} />
              
            </div>
            <div>
              <label className={label} htmlFor="song-year">
                Year
              </label>
              <input
                id="song-year"
                type="number"
                className={field}
                value={draft.year}
                onChange={(event) => update('year', Number(event.target.value))} />
              
            </div>
            <div>
              <label className={label} htmlFor="song-era">
                Era
              </label>
              <select
                id="song-era"
                className={field}
                value={draft.era}
                onChange={(event) => update('era', event.target.value as Era)}>
                
                {allEras.map((era) =>
                <option key={era} value={era} className="bg-elevated">
                    {era}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="song-language">
                Language
              </label>
              <select
                id="song-language"
                className={field}
                value={draft.language}
                onChange={(event) => update('language', event.target.value as Language)}>
                
                {allLanguages.map((item) =>
                <option key={item} value={item} className="bg-elevated">
                    {item}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="song-genre">
                Genre
              </label>
              <select
                id="song-genre"
                className={field}
                value={draft.genre}
                onChange={(event) => update('genre', event.target.value as Genre)}>
                
                {allGenres.map((genre) =>
                <option key={genre} value={genre} className="bg-elevated">
                    {genre}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="song-duration">
                Duration (seconds)
              </label>
              <input
                id="song-duration"
                type="number"
                className={field}
                value={draft.duration}
                onChange={(event) => update('duration', Number(event.target.value))} />
              
            </div>
          </div>

          <div>
            <label className={label} htmlFor="song-thumb">
              Thumbnail URL
            </label>
            <input
              id="song-thumb"
              className={field}
              placeholder="https://…"
              value={draft.thumbnail}
              onChange={(event) => update('thumbnail', event.target.value)} />
            
          </div>

          <div>
            <label className={label} htmlFor="song-video">
              Karaoke video URL
            </label>
            <input
              id="song-video"
              className={field}
              placeholder="https://…"
              value={draft.videoUrl}
              onChange={(event) => update('videoUrl', event.target.value)} />
            
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className={`${label} mb-0`}>Synchronized lyrics</span>
              <div className="flex items-center gap-1 rounded-full border border-line p-1">
                {allLanguages.map((item) =>
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setLyricLanguage(item);
                    setTimeline(toTimeline(draft.lyrics[item] ?? []));
                  }}
                  className={[
                  'rounded-full px-2.5 py-1 text-xs transition-colors duration-150 ease-smooth',
                  lyricLanguage === item ? 'bg-white text-ink' : 'text-mist hover:text-white'].
                  join(' ')}>
                  
                    {item}
                  </button>
                )}
              </div>
            </div>
            <textarea
              id="song-lyrics"
              rows={10}
              className={`${field} font-mono text-[13px] leading-relaxed`}
              placeholder={'0:07 First lyric line\n0:12 Second lyric line'}
              value={timeline}
              onChange={(event) => setTimeline(event.target.value)} />
            
            <p className="mt-1.5 text-xs text-mist/70">
              One line per lyric, prefixed with its start timestamp (m:ss). End times are derived
              from the next line.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-line bg-black/30 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => update('featured', event.target.checked)}
              className="h-4 w-4 accent-magenta" />
            
            Feature this song on the homepage
          </label>
        </div>

        <div className="sticky bottom-0 mt-auto flex items-center justify-end gap-3 border-t border-line bg-elevated/95 px-6 py-4 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white">
            
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full bg-magenta px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth active:scale-95">
            
            {isEdit ? 'Save changes' : 'Add song'}
          </button>
        </div>
      </motion.form>
    </div>);

}