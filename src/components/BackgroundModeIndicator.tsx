import { useEffect, useState } from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import { bgPerf, isLowPowerForced } from '@/lib/bgPerf';

type Mode = 'webgl' | 'lowpower';

/**
 * Small transient pill that appears when the background mode flips
 * between WebGL and the cheap low-power fallback.
 */
export const BackgroundModeIndicator = () => {
  const [mode, setMode] = useState<Mode>(() => (isLowPowerForced() ? 'lowpower' : 'webgl'));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let initial = true;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const flash = (next: Mode) => {
      setMode(next);
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(false), 3500);
    };

    const unsub = bgPerf.subscribe((s) => {
      const next: Mode = s.lowPower ? 'lowpower' : 'webgl';
      if (initial) {
        initial = false;
        setMode(next);
        return;
      }
      setMode((prev) => {
        if (prev === next) return prev;
        flash(next);
        return next;
      });
    });

    const onLP = (e: Event) => {
      const v = !!(e as CustomEvent).detail;
      flash(v ? 'lowpower' : 'webgl');
    };
    window.addEventListener('bg-low-power-change', onLP);

    return () => {
      unsub();
      window.removeEventListener('bg-low-power-change', onLP);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const isLP = mode === 'lowpower';
  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-16 left-4 z-40 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur-md transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      } ${
        isLP
          ? 'border-amber-400/40 bg-amber-500/10 text-amber-200'
          : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
      }`}
    >
      {isLP ? <Cpu className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      <span>{isLP ? 'Switched to Low-power background' : 'WebGL background restored'}</span>
    </div>
  );
};
