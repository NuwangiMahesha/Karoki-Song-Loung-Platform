import React, { useEffect, useRef } from 'react';
import type { LyricLine as Line } from '../types/song';

interface Props {
  lines: Line[];
  time: number;
  karaokeMode?: boolean;
  onSeek: (seconds: number) => void;
}

function activeIndex(lines: Line[], time: number): number {
  return lines.findIndex((line) => time >= line.start && time < line.end);
}

export function LyricsDisplay({ lines, time, karaokeMode = false, onSeek }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const active = activeIndex(lines, time);

  useEffect(() => {
    const node = container.current;
    if (!node || active < 0) return;
    const el = node.querySelector<HTMLElement>(`[data-line="${active}"]`);
    if (!el) return;
    node.scrollTo({
      top: el.offsetTop - node.clientHeight / 2 + el.clientHeight / 2,
      behavior: 'smooth'
    });
  }, [active]);

  if (lines.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-mist">
        Synced lyrics for this language are not available yet.
      </p>);

  }

  return (
    <div
      ref={container}
      className={[
      'lyrics-scroll relative overflow-y-auto scroll-smooth px-4 sm:px-8',
      karaokeMode ? 'h-[42vh] min-h-[240px]' : 'h-[340px] sm:h-[380px]'].
      join(' ')}
      aria-live="polite"
      aria-label="Synchronized lyrics">
      
      <div className="py-[38%]">
        {lines.map((line, index) => {
          const distance = active < 0 ? index : Math.abs(index - active);
          const isActive = index === active;
          const upcoming = active >= 0 && index > active;
          return (
            <button
              key={`${line.start}-${index}`}
              data-line={index}
              type="button"
              onClick={() => onSeek(line.start + 0.05)}
              className={[
              'block w-full text-balance rounded-xl px-2 py-2.5 text-center transition-[color,opacity,transform] duration-200 ease-smooth',
              karaokeMode ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-2xl',
              isActive ?
              'scale-[1.04] font-semibold text-white [text-shadow:0_0_28px_rgba(226,70,200,0.75)]' :
              upcoming ?
              'font-medium text-mist' :
              'font-medium text-mist'].
              join(' ')}
              style={{ opacity: isActive ? 1 : Math.max(0.18, 0.62 - distance * 0.12) }}>
              
              {line.text}
            </button>);

        })}
      </div>
    </div>);

}