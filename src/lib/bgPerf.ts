// Lightweight shared store for background perf metrics.
// The WebGL shader writes to it each frame; UI components subscribe.

export interface BgPerfState {
  fps: number;
  dpr: number;
  parallax: number;   // 0..1 current adaptive parallax intensity
  lowPower: boolean;  // true once the scaler gives up
  active: boolean;    // shader is currently rendering
}

const state: BgPerfState = {
  fps: 0,
  dpr: 1,
  parallax: 1,
  lowPower: false,
  active: false,
};

type Listener = (s: BgPerfState) => void;
const listeners = new Set<Listener>();

export const bgPerf = {
  get(): BgPerfState {
    return { ...state };
  },
  set(patch: Partial<BgPerfState>) {
    Object.assign(state, patch);
    listeners.forEach((l) => l({ ...state }));
  },
  subscribe(l: Listener): () => void {
    listeners.add(l);
    l({ ...state });
    return () => listeners.delete(l);
  },
};

const LOW_POWER_KEY = 'bg-low-power';
export const isLowPowerForced = () =>
  typeof window !== 'undefined' && localStorage.getItem(LOW_POWER_KEY) === '1';
export const setLowPowerForced = (v: boolean) => {
  if (v) localStorage.setItem(LOW_POWER_KEY, '1');
  else localStorage.removeItem(LOW_POWER_KEY);
  window.dispatchEvent(new CustomEvent('bg-low-power-change', { detail: v }));
};
