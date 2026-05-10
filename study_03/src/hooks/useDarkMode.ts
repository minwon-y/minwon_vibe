import { useEffect, useState } from 'react';

const KEY = 'quiz_dark';

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored !== null) return stored === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem(KEY, String(dark));
    } catch {}
  }, [dark]);

  return [dark, setDark] as const;
}
