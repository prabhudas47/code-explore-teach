import { useEffect, useState } from 'react';
import { bgPerf, type BgPerfState } from '@/lib/bgPerf';

const isDebugEnabled = () => {
  if (typeof window === 'undefined') return false;
  if (new URLSearchParams(window.location.search).get('debug') === '1') return true;
  return localStorage.getItem('bg-debug') === '1';
};

export const BackgroundDebugOverlay = () => {
  const [enabled, setEnabled] = useState(isDebugEnabled);
  const [s, setS] = useState<BgPerfState>(bgPerf.get());

  useEffect(() => {
    const onStorage = () => setEnabled(isDebugEnabled());
    window.addEventListener('storage', onStorage);
    window.addEventListener('bg-debug-change', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('bg-debug-change', onStorage);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    return bgPerf.subscribe(setS);
  }, [enabled]);

  if (!enabled) return null;

  const fpsColor =
    s.fps >= 55 ? 'text-emerald-400' : s.fps >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 rounded-md border border-white/15 bg-black/70 px-3 py-2 font-mono text-[10px] leading-tight text-white/90 backdrop-blur-md">
      <div>
        <span className="text-white/50">FPS </span>
        <span className={fpsColor}>{s.fps.toFixed(0).padStart(2, ' ')}</span>
      </div>
      <div>
        <span className="text-white/50">DPR </span>
        <span>{s.dpr.toFixed(2)}</span>
      </div>
      <div>
        <span className="text-white/50">PRX </span>
        <span>{s.parallax.toFixed(2)}</span>
      </div>
      <div>
        <span className="text-white/50">MODE </span>
        <span className={s.lowPower ? 'text-red-400' : s.active ? 'text-emerald-400' : 'text-white/60'}>
          {s.lowPower ? 'LOW-PWR' : s.active ? 'WEBGL' : 'IDLE'}
        </span>
      </div>
    </div>
  );
};
