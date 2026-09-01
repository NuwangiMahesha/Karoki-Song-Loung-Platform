import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckIcon,
  FacebookIcon,
  LinkIcon,
  MailIcon,
  MessageCircleIcon,
  MicVocalIcon,
  SendIcon,
  XIcon } from
'lucide-react';
import type { Song } from '../types/song';
import { absoluteSongUrl } from '../utils/format';

interface Props {
  song: Song | null;
  onClose: () => void;
}

export function ShareModal({ song, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!song) return;
    setCopied(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [song, onClose]);

  const url = song ? absoluteSongUrl(song.slug) : '';
  const text = song ? `Sing "${song.title}" by ${song.artist} on Karaoke Lounge` : '';

  const targets = [
  {
    label: 'WhatsApp',
    icon: MessageCircleIcon,
    href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  },
  {
    label: 'Facebook',
    icon: FacebookIcon,
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    label: 'Messenger',
    icon: SendIcon,
    href: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=0&redirect_uri=${encodeURIComponent(url)}`
  },
  {
    label: 'Email',
    icon: MailIcon,
    href: `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`
  }];


  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {

      /* clipboard blocked — the link stays visible for manual copying */}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <AnimatePresence>
      {song &&
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        onClick={onClose}
        role="presentation">
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Share ${song.title}`}
          className="glass-strong w-full max-w-lg rounded-t-3xl p-6 shadow-card sm:rounded-3xl"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          onClick={(event) => event.stopPropagation()}>
          
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                src={song.thumbnail}
                alt=""
                loading="lazy"
                className="h-14 w-14 rounded-xl object-cover" />
              
                <div>
                  <h2 className="text-lg font-semibold leading-tight">{song.title}</h2>
                  <p className="text-sm text-mist">{song.artist}</p>
                </div>
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close share dialog"
              className="rounded-full p-2 text-mist transition-colors duration-150 ease-smooth hover:bg-white/10 hover:text-white">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-3">
              {targets.map(({ label, icon: Icon, href }) =>
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="glass flex flex-col items-center gap-2 rounded-2xl px-2 py-4 text-xs text-mist transition-colors duration-150 ease-smooth hover:border-magenta/50 hover:text-white">
              
                  <Icon className="h-5 w-5 text-magenta" />
                  {label}
                </a>
            )}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-black/40 p-2 pl-4">
              <LinkIcon className="h-4 w-4 shrink-0 text-mist" />
              <span className="min-w-0 flex-1 truncate text-sm text-mist">{url}</span>
              <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink transition-transform duration-150 ease-smooth active:scale-95">
              
                {copied ?
              <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Copied
                  </span> :

              'Copy link'
              }
              </button>
            </div>

            <a
            href={targets[0].href}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-magenta px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-150 ease-smooth hover:bg-magenta/90 active:scale-[0.98]">
            
              <MicVocalIcon className="h-4 w-4" />
              Share karaoke
            </a>
            <p className="mt-3 text-center text-xs text-mist">
              Anyone with the link opens straight into this karaoke track.
            </p>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}