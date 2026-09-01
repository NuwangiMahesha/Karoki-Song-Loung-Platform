import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data: songs } = await supabase.from('songs').select('id, title, slug').eq('slug', '');
  if (songs && songs.length > 0) {
    for (const s of songs) {
      const fixedSlug = s.id; // Just use ID as slug if it's empty
      await supabase.from('songs').update({ slug: fixedSlug }).eq('id', s.id);
      console.log(`Fixed slug for ${s.title}: ${fixedSlug}`);
    }
  } else {
    console.log("No empty slugs found.");
  }
}
fix();
