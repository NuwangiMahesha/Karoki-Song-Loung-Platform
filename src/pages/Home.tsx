import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Hero } from '../components/Hero';
import { SongRow } from '../components/SongRow';
import { ContinueSinging } from '../components/ContinueSinging';
import { useLibrary } from '../contexts/LibraryContext';
import { useCatalogue } from '../contexts/CatalogueContext';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';

export function Home() {
  const { catalogue: songs, loading: catalogueLoading } = useCatalogue();
  const loading = useSimulatedLoad(600) || catalogueLoading;
  const { recentSongs, continueSong } = useLibrary();

  const sections = useMemo(
    () => ({
      popular: [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10),
      seventies: songs.filter((song) => song.era === '70s'),
      nineties: songs.filter((song) => song.era === '80s' || song.era === '90s'),
      thousands: songs.filter((song) => song.era === '2000s'),
      latest: songs.filter((song) => song.era === 'Latest' || song.era === '2010s')
    }),
    [songs]
  );

  return (
    <div className="w-full">
      <Hero />

      <div className="space-y-14 pt-14 sm:space-y-16">
        <SongRow
          title="Popular karaoke"
          subtitle="What the lounge is singing this week."
          songs={sections.popular}
          seeAllTo="/songs"
          loading={loading} />
        

        <SongRow
          title="The golden 70s"
          subtitle="Timeless classics, slow tempos, big feelings."
          songs={sections.seventies}
          seeAllTo="/songs?era=70s"
          loading={loading} />
        

        <SongRow
          title="90s forever"
          subtitle="Neon nights and the decade everyone still requests."
          songs={sections.nineties}
          seeAllTo="/songs?era=90s"
          loading={loading} />
        

        <SongRow
          title="2000s hits"
          subtitle="Early millennium anthems, ready when you are."
          songs={sections.thousands}
          seeAllTo="/songs?era=2000s"
          loading={loading} />
        

        {recentSongs.length > 0 &&
        <SongRow
          title="Recently played"
          subtitle="Pick up where you left the mic."
          songs={recentSongs} />

        }

        {continueSong &&
        <ContinueSinging song={continueSong.song} position={continueSong.position} />
        }

        <SongRow
          title="Fresh on the stage"
          subtitle="Newly added karaoke tracks."
          songs={sections.latest}
          seeAllTo="/songs?era=Latest"
          loading={loading} />
        

        <section className="px-4 sm:px-6 lg:px-10">
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(226,70,200,0.22),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl sm:text-5xl">Ready to sing?</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist sm:text-base">
                A place where generations of music come together. Grab the mic, pick a decade, and
                let the lyrics do the rest.
              </p>
              <Link
                to="/songs"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-magenta px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
                
                Explore all songs
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>);

}