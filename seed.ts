import { createClient } from '@supabase/supabase-js';
import { songs } from './src/data/songs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log('Seeding ' + songs.length + ' songs...');
  for (const song of songs) {
    const { error } = await supabase.from('songs').upsert({
      id: song.id,
      slug: song.slug,
      title: song.title,
      artist: song.artist,
      album: song.album,
      year: song.year,
      era: song.era,
      language: song.language,
      genre: song.genre,
      thumbnail: song.thumbnail,
      videourl: song.videoUrl, // folded to lowercase by postgres
      duration: song.duration,
      plays: song.plays,
      featured: song.featured,
      lyrics: song.lyrics
    });
    if (error) {
      console.error('Error inserting', song.title, error);
    } else {
      console.log('Inserted', song.title);
    }
  }
  console.log('Done!');
}

seed();
