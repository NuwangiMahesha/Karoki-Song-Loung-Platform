import React from 'react';
import { Link } from 'react-router-dom';
import { MicVocalIcon } from 'lucide-react';
import { allEras } from '../data/songs';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface/80">
      <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-magenta text-white">
              <MicVocalIcon className="h-5 w-5" />
            </span>
            <span className="font-display text-xl">Karaoke Lounge</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
            A place where generations of music come together. Synced lyrics, era-spanning
            catalogues and a stage that is always open.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Browse</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            {allEras.map((era) =>
            <li key={era}>
                <Link
                to={`/songs?era=${encodeURIComponent(era)}`}
                className="transition-colors duration-150 ease-smooth hover:text-white">
                
                  {era === 'Latest' ? 'Latest songs' : `${era} karaoke`}
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">Library</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-mist">
            <li>
              <Link to="/songs" className="transition-colors duration-150 ease-smooth hover:text-white">
                All songs
              </Link>
            </li>
            <li>
              <Link
                to="/favourites"
                className="transition-colors duration-150 ease-smooth hover:text-white">
                
                My favourites
              </Link>
            </li>
            <li>
              <Link to="/admin" className="transition-colors duration-150 ease-smooth hover:text-white">
                Admin dashboard
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line px-4 py-6 text-center text-xs text-mist/70 sm:px-6 lg:px-10">
        © {new Date().getFullYear()} Karaoke Lounge. Sample catalogue for demonstration.
      </div>
    </footer>);

}