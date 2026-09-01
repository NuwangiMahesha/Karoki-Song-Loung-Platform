import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Song } from '../types/song';
import { ShareModal } from '../components/ShareModal';

interface ShareValue {
  openShare: (song: Song) => void;
}

const ShareContext = createContext<ShareValue | null>(null);

export function ShareProvider({ children }: {children: React.ReactNode;}) {
  const [song, setSong] = useState<Song | null>(null);
  const openShare = useCallback((next: Song) => setSong(next), []);
  const value = useMemo(() => ({ openShare }), [openShare]);

  return (
    <ShareContext.Provider value={value}>
      {children}
      <ShareModal song={song} onClose={() => setSong(null)} />
    </ShareContext.Provider>);

}

export function useShare(): ShareValue {
  const ctx = useContext(ShareContext);
  if (!ctx) throw new Error('useShare must be used inside ShareProvider');
  return ctx;
}