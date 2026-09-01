import { useEffect, useState } from 'react';

/** Mimics the catalogue fetch so skeleton states are exercised on first paint. */
export function useSimulatedLoad(delay = 650, deps: unknown[] = []): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}