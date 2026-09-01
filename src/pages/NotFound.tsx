import React from 'react';
import { CompassIcon } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-28 sm:px-6 lg:px-10">
      <EmptyState
        icon={CompassIcon}
        title="This stage is empty."
        description="The page you were looking for does not exist. Head back to the catalogue and pick a track."
        actionLabel="Explore songs"
        actionTo="/songs" />
      
    </div>);

}