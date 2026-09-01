import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import type { Song } from '../types/song';

interface CatalogueValue {
  catalogue: Song[];
  loading: boolean;
  saveSong: (song: Song) => Promise<void>;
  removeSong: (id: string) => Promise<void>;
}

const CatalogueContext = createContext<CatalogueValue | null>(null);

export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const [catalogue, setCatalogue] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSongs() {
      const { data, error } = await supabase.from('songs').select('*');
      if (error) {
        console.error('Error loading songs:', error);
      } else if (data) {
        // Map database columns to our Song type
        const formatted = data.map(row => ({
          ...row,
          videoUrl: row.videourl // map videourl back to videoUrl
        })) as Song[];
        setCatalogue(formatted);
      }
      setLoading(false);
    }
    loadSongs();
  }, []);

  const saveSong = async (song: Song) => {
    const { videoUrl, ...rest } = song;
    const dbSong = { ...rest, videourl: videoUrl };
    const { error } = await supabase.from('songs').upsert(dbSong);
    if (!error) {
      setCatalogue(prev => {
        const exists = prev.some(item => item.id === song.id);
        return exists ? prev.map(item => item.id === song.id ? song : item) : [song, ...prev];
      });
    } else {
      console.error('Failed to save', error);
      alert('Failed to save song. Please check Supabase permissions.');
    }
  };

  const removeSong = async (id: string) => {
    const { error } = await supabase.from('songs').delete().eq('id', id);
    if (!error) {
      setCatalogue(prev => prev.filter(song => song.id !== id));
    } else {
      console.error('Failed to delete', error);
      alert('Failed to delete song.');
    }
  };

  return (
    <CatalogueContext.Provider value={{ catalogue, loading, saveSong, removeSong }}>
      {children}
    </CatalogueContext.Provider>
  );
}

export function useCatalogue(): CatalogueValue {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used inside CatalogueProvider');
  return ctx;
}
