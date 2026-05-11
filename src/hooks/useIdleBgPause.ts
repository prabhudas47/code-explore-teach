import { useEffect } from 'react';
import { getPauseOnIdle } from '@/lib/bgSettings';

const ATTR = 'data-bg-paused';

/**
 * Adds `html[data-bg-paused="true"]` after N seconds of no input,
 * removes it on any interaction. Used to freeze the puzzle CSS animations
 * while the user is reading.
 */
export const useIdleBgPause = (idleMs = 6000) => {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clearPause = () => {
      if (root.getAttribute(ATTR) === 'true') root.removeAttribute(ATTR);
    };
    const setPause = () => {
      if (getPauseOnIdle()) root.setAttribute(ATTR, 'true');
    };
    const reset = () => {
      clearPause();
      if (timer) clearTimeout(timer);
      if (getPauseOnIdle()) timer = setTimeout(setPause, idleMs);
    };

    const events: (keyof WindowEventMap)[] = ['mousemove', 'touchstart', 'scroll', 'keydown'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    window.addEventListener('bg-settings-change', reset);
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      window.removeEventListener('bg-settings-change', reset);
      if (timer) clearTimeout(timer);
      clearPause();
    };
  }, [idleMs]);
};
