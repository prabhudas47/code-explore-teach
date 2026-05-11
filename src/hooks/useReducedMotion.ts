import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'reduce-motion';
const ATTR = 'data-reduced-motion';

const readSystemPref = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const readStored = (): boolean | null => {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null;
};

const applyAttr = (on: boolean) => {
  if (typeof document === 'undefined') return;
  if (on) document.documentElement.setAttribute(ATTR, 'true');
  else document.documentElement.removeAttribute(ATTR);
};

/** Initialize once on module load so the value is correct before first paint. */
const initial = (() => {
  const stored = readStored();
  const on = stored ?? readSystemPref();
  applyAttr(on);
  return on;
})();

export function useReducedMotion(): [boolean, (next: boolean) => void] {
  const [enabled, setEnabled] = useState<boolean>(initial);

  // React to system pref changes only when user hasn't overridden
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      if (readStored() === null) {
        setEnabled(e.matches);
        applyAttr(e.matches);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setReducedMotion = useCallback((next: boolean) => {
    localStorage.setItem(STORAGE_KEY, String(next));
    applyAttr(next);
    setEnabled(next);
    window.dispatchEvent(new CustomEvent('reduced-motion-change', { detail: next }));
  }, []);

  // Sync across components/tabs
  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<boolean>).detail;
      if (typeof detail === 'boolean') setEnabled(detail);
    };
    window.addEventListener('reduced-motion-change', onChange);
    return () => window.removeEventListener('reduced-motion-change', onChange);
  }, []);

  return [enabled, setReducedMotion];
}
