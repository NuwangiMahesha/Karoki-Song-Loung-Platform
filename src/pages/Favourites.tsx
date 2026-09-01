import React from 'react';
import { HeartIcon, HistoryIcon } from 'lucide-react';
import { useLibrary } from '../contexts/LibraryContext';
import { SongCard } from '../components/SongCard';
import { SongRow } from '../components/SongRow';
import { EmptyState } from '../components/EmptyState';

export function Favourites() {
  const { favouriteSongs, recentSongs } = useLibrary();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pb-10 pt-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl sm:text-5xl">My favourites</h1>
        <p className="mt-2 text-sm text-mist">
          {favouriteSongs.length > 0 ?
          `${favouriteSongs.length} ${favouriteSongs.length === 1 ? 'song' : 'songs'} saved on this device.` :
          'Saved songs live here, ready for your next session.'}
        </p>
      </header>

      {favouriteSongs.length === 0 ?
      <div className="py-6">
          <EmptyState
          icon={HeartIcon}
          title="Your playlist is waiting."
          description="Start exploring classic karaoke songs and save your favourites so they are one tap away."
          actionLabel="Explore songs"
          actionTo="/songs" />
        
        </div> :

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {favouriteSongs.map((song) =>
        <SongCard key={song.id} song={song} />
        )}
        </div>
      }

      {recentSongs.length > 0 &&
      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-10">
          <SongRow
          title="Recently played"
          subtitle="The last tracks you opened."
          songs={recentSongs} />
        
        </div>
      }

      {recentSongs.length === 0 && favouriteSongs.length > 0 &&
      <p className="mt-14 flex items-center justify-center gap-2 text-sm text-mist">
          <HistoryIcon className="h-4 w-4" /> Nothing played yet this session.
        </p>
      }
    </div>);

}