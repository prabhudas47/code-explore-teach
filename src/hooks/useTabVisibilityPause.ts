import { useEffect } from 'react';

const ATTR = 'data-bg-hidden';

/**
 * Toggles `html[data-bg-hidden="true"]` whenever the tab/window becomes hidden.
 * Reuses the same CSS pause rules as the idle-pause system so all background
 * animations (WebGL + CSS) stop while the tab is in the background.
 */
export const useTabVisibilityPause = () => {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      if (document.hidden) root.setAttribute(ATTR, 'true');
      else root.removeAttribute(ATTR);
    };
    apply();
    document.addEventListener('visibilitychange', apply);
    window.addEventListener('blur', apply);
    window.addEventListener('focus', apply);
    return () => {
      document.removeEventListener('visibilitychange', apply);
      window.removeEventListener('blur', apply);
      window.removeEventListener('focus', apply);
      root.removeAttribute(ATTR);
    };
  }, []);
};
