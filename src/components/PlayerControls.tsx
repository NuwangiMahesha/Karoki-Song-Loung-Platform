import React from 'react';
import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon } from
'lucide-react';
import type { PlaybackState } from '../hooks/usePlayback';
import { formatTime } from '../utils/format';

interface Props {
  playback: PlaybackState;
  duration: number;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const RATES = [0.75, 1, 1.25, 1.5];

export function PlayerControls({ playback, duration, fullscreen, onToggleFullscreen }: Props) {
  const { time, playing, rate, volume, muted, toggle, seek, skip, setRate, setVolume, toggleMute } =
  playback;
  const percent = duration > 0 ? time / duration * 100 : 0;
  const VolumeIcon = muted || volume === 0 ? VolumeXIcon : volume < 0.5 ? Volume1Icon : Volume2Icon;

  return (
    <div className="glass rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="w-11 shrink-0 text-xs tabular-nums text-mist">{formatTime(time)}</span>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/12">
            <div
              className="h-full rounded-full bg-magenta"
              style={{ width: `${percent}%`, transition: 'width 120ms linear' }} />
            
          </div>
          <input
            type="range"
            className="track relative w-full cursor-pointer"
            min={0}
            max={duration}
            step={0.1}
            value={time}
            aria-label="Seek"
            onChange={(event) => seek(Number(event.target.value))} />
          
        </div>
        <span className="w-11 shrink-0 text-right text-xs tabular-nums text-mist">
          {formatTime(duration)}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Rewind 10 seconds"
            onClick={() => skip(-10)}
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
            
            <RotateCcwIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={playing ? 'Pause' : 'Play'}
            onClick={toggle}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-magenta text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-95">
            
            {playing ?
            <PauseIcon className="h-5 w-5 fill-current" /> :

            <PlayIcon className="ml-0.5 h-5 w-5 fill-current" />
            }
          </button>
          <button
            type="button"
            aria-label="Forward 10 seconds"
            onClick={() => skip(10)}
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
            
            <RotateCwIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={muted ? 'Unmute' : 'Mute'}
              onClick={toggleMute}
              className="rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
              
              <VolumeIcon className="h-5 w-5" />
            </button>
            <input
              type="range"
              className="track w-20 cursor-pointer accent-magenta sm:w-24"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              aria-label="Volume"
              onChange={(event) => setVolume(Number(event.target.value))} />
            
          </div>

          <div className="flex items-center gap-1 rounded-full border border-line bg-white/[0.03] p-1">
            {RATES.map((value) =>
            <button
              key={value}
              type="button"
              aria-pressed={rate === value}
              onClick={() => setRate(value)}
              className={[
              'rounded-full px-2.5 py-1 text-xs tabular-nums transition-colors duration-150 ease-smooth',
              rate === value ? 'bg-white text-ink' : 'text-mist hover:text-white'].
              join(' ')}>
              
                {value}x
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onClick={onToggleFullscreen}
            className="rounded-full p-2.5 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
            
            {fullscreen ? <MinimizeIcon className="h-5 w-5" /> : <MaximizeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>);

}