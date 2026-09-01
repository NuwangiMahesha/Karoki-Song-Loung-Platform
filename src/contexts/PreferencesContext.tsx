import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../types/song';

const KEY = 'karaoke-lounge:lang';

interface PreferencesValue {
  language: Language;
  setLanguage: (language: Language) => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: {children: React.ReactNode;}) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'English';
    return window.localStorage.getItem(KEY) as Language || 'English';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, language);
    } catch {

      /* storage unavailable */}
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider');
  return ctx;
}