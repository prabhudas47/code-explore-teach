import { useCallback, useEffect, useState } from 'react';

const KEY_PAUSE_ON_IDLE = 'bg-pause-on-idle';
const KEY_ORIENT_SENS = 'bg-orient-sensitivity'; // 0..1
const EVT = 'bg-settings-change';

const readBool = (k: string, dflt: boolean) => {
  if (typeof window === 'undefined') return dflt;
  const v = localStorage.getItem(k);
  if (v === '1') return true;
  if (v === '0') return false;
  return dflt;
};

const readNum = (k: string, dflt: number) => {
  if (typeof window === 'undefined') return dflt;
  const v = localStorage.getItem(k);
  if (v == null) return dflt;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : dflt;
};

export const getOrientationSensitivity = () =>
  Math.max(0, Math.min(1, readNum(KEY_ORIENT_SENS, 0.15)));

export const getPauseOnIdle = () => readBool(KEY_PAUSE_ON_IDLE, true);

export function useBgSettings() {
  const [pauseOnIdle, setPauseState] = useState(getPauseOnIdle);
  const [orientSens, setOrientState] = useState(getOrientationSensitivity);

  useEffect(() => {
    const onChange = () => {
      setPauseState(getPauseOnIdle());
      setOrientState(getOrientationSensitivity());
    };
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
  }, []);

  const setPauseOnIdle = useCallback((v: boolean) => {
    localStorage.setItem(KEY_PAUSE_ON_IDLE, v ? '1' : '0');
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);
  const setOrientSens = useCallback((v: number) => {
    localStorage.setItem(KEY_ORIENT_SENS, String(v));
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);

  return { pauseOnIdle, setPauseOnIdle, orientSens, setOrientSens };
}
