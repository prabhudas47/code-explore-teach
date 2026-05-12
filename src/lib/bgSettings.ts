import { useCallback, useEffect, useState } from 'react';

const KEY_PAUSE_ON_IDLE = 'bg-pause-on-idle';
const KEY_ORIENT_SENS = 'bg-orient-sensitivity'; // 0..1
const KEY_LP_FPS = 'bg-lowpower-fps';            // FPS threshold (e.g. 40)
const KEY_LP_WINDOWS = 'bg-lowpower-windows';    // # of consecutive 1s windows (e.g. 3)
const EVT = 'bg-settings-change';

const safeGet = (k: string): string | null => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* quota / private mode */ }
};

const readBool = (k: string, dflt: boolean) => {
  if (typeof window === 'undefined') return dflt;
  const v = safeGet(k);
  if (v === '1') return true;
  if (v === '0') return false;
  return dflt;
};

const readNum = (k: string, dflt: number) => {
  if (typeof window === 'undefined') return dflt;
  const v = safeGet(k);
  if (v == null) return dflt;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : dflt;
};

export const getOrientationSensitivity = () =>
  Math.max(0, Math.min(1, readNum(KEY_ORIENT_SENS, 0.15)));

export const getPauseOnIdle = () => readBool(KEY_PAUSE_ON_IDLE, true);

export const getLowPowerFpsThreshold = () =>
  Math.max(15, Math.min(58, readNum(KEY_LP_FPS, 40)));

export const getLowPowerWindows = () =>
  Math.max(1, Math.min(10, Math.round(readNum(KEY_LP_WINDOWS, 3))));

export function useBgSettings() {
  const [pauseOnIdle, setPauseState] = useState(getPauseOnIdle);
  const [orientSens, setOrientState] = useState(getOrientationSensitivity);
  const [lpFps, setLpFpsState] = useState(getLowPowerFpsThreshold);
  const [lpWindows, setLpWindowsState] = useState(getLowPowerWindows);

  useEffect(() => {
    const onChange = () => {
      setPauseState(getPauseOnIdle());
      setOrientState(getOrientationSensitivity());
      setLpFpsState(getLowPowerFpsThreshold());
      setLpWindowsState(getLowPowerWindows());
    };
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
  }, []);

  const setPauseOnIdle = useCallback((v: boolean) => {
    safeSet(KEY_PAUSE_ON_IDLE, v ? '1' : '0');
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);
  const setOrientSens = useCallback((v: number) => {
    const c = Math.max(0, Math.min(1, v));
    safeSet(KEY_ORIENT_SENS, String(c));
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);
  const setLpFps = useCallback((v: number) => {
    const c = Math.max(15, Math.min(58, Math.round(v)));
    safeSet(KEY_LP_FPS, String(c));
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);
  const setLpWindows = useCallback((v: number) => {
    const c = Math.max(1, Math.min(10, Math.round(v)));
    safeSet(KEY_LP_WINDOWS, String(c));
    window.dispatchEvent(new CustomEvent(EVT));
  }, []);

  return {
    pauseOnIdle, setPauseOnIdle,
    orientSens, setOrientSens,
    lpFps, setLpFps,
    lpWindows, setLpWindows,
  };
}
