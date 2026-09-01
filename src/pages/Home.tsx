import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import { SongRow } from '../components/SongRow';
import { ContinueSinging } from '../components/ContinueSinging';
import { countByEra, eras, songs } from '../data/songs';
import { useLibrary } from '../contexts/LibraryContext';
import { useSimulatedLoad } from '../hooks/useSimulatedLoad';

export function Home() {
  const loading = useSimulatedLoad(600);
  const { recentSongs, continueSong } = useLibrary();

  const sections = useMemo(
    () => ({
      popular: [...songs].sort((a, b) => b.plays - a.plays).slice(0, 10),
      seventies: songs.filter((song) => song.era === '70s'),
      nineties: songs.filter((song) => song.era === '80s' || song.era === '90s'),
      thousands: songs.filter((song) => song.era === '2000s'),
      latest: songs.filter((song) => song.era === 'Latest' || song.era === '2010s')
    }),
    []
  );

  return (
    <div className="w-full">
      <Hero />

      <div className="space-y-14 pt-14 sm:space-y-16">
        <section className="px-4 sm:px-6 lg:px-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl sm:text-[28px]">Explore by era</h2>
              <p className="mt-1 text-sm text-mist">
                Five decades of singalongs, sorted the way you remember them.
              </p>
            </div>
            <Link
              to="/songs"
              className="hidden text-sm text-mist transition-colors duration-150 ease-smooth hover:text-white sm:block">
              
              See all
            </Link>
          </div>
          <div className="scroll-row -mx-4 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3 xl:grid-cols-5">
            {eras.map((category) =>
            <CategoryCard
              key={category.era}
              era={category.era}
              label={category.label}
              blurb={category.blurb}
              image={category.image}
              query={category.query}
              count={countByEra(category.era)} />

            )}
          </div>
        </section>

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