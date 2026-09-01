import React from 'react';

function Bar({ className = '' }: {className?: string;}) {
  return (
    <div className={`relative overflow-hidden rounded-md bg-white/[0.07] ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>);

}

export function SongCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-elevated/50">
      <Bar className="aspect-square rounded-none" />
      <div className="space-y-2 p-3.5">
        <Bar className="h-3.5 w-4/5" />
        <Bar className="h-3 w-3/5" />
        <Bar className="h-3 w-2/5" />
      </div>
    </div>);

}

export function SongGridSkeleton({ count = 8 }: {count?: number;}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) =>
      <SongCardSkeleton key={index} />
      )}
    </div>);

}

export function PlayerSkeleton() {
  return (
    <div className="space-y-4">
      <Bar className="aspect-video w-full rounded-3xl" />
      <Bar className="h-4 w-1/3" />
      <Bar className="h-3 w-1/5" />
      <div className="space-y-3 pt-4">
        <Bar className="mx-auto h-4 w-2/3" />
        <Bar className="mx-auto h-5 w-1/2" />
        <Bar className="mx-auto h-4 w-3/5" />
      </div>
    </div>);

}