export function formatTime(seconds: number): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatPlays(plays: number): string {
  if (plays >= 1_000_000) return `${(plays / 1_000_000).toFixed(1)}M`;
  if (plays >= 1_000) return `${Math.round(plays / 1_000)}K`;
  return String(plays);
}

export function songUrl(slug: string): string {
  return `/song/${slug}`;
}

export function absoluteSongUrl(slug: string): string {
  if (typeof window === 'undefined') return songUrl(slug);
  return `${window.location.origin}${songUrl(slug)}`;
}