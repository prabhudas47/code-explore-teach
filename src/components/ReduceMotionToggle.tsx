import { useEffect, useRef, useState } from 'react';
import { Settings, Sparkles, Zap, X, Bug } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useBgSettings } from '@/lib/bgSettings';
import { isLowPowerForced, setLowPowerForced } from '@/lib/bgPerf';

export const ReduceMotionToggle = () => {
  const [reduced, setReduced] = useReducedMotion();
  const { pauseOnIdle, setPauseOnIdle, orientSens, setOrientSens } = useBgSettings();
  const [open, setOpen] = useState(false);
  const [lowPower, setLowPowerState] = useState<boolean>(isLowPowerForced);
  const [debug, setDebug] = useState<boolean>(
    () => typeof window !== 'undefined' && localStorage.getItem('bg-debug') === '1'
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onLP = (e: Event) => setLowPowerState(!!(e as CustomEvent).detail);
    window.addEventListener('bg-low-power-change', onLP);
    return () => window.removeEventListener('bg-low-power-change', onLP);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  const toggleLowPower = (v: boolean) => {
    setLowPowerForced(v);
    setLowPowerState(v);
    if (v) window.location.reload(); // cleanest way to switch backgrounds
  };

  const toggleDebug = (v: boolean) => {
    if (v) localStorage.setItem('bg-debug', '1');
    else localStorage.removeItem('bg-debug');
    setDebug(v);
    window.dispatchEvent(new Event('bg-debug-change'));
  };

  return (
    <div ref={ref} className="fixed bottom-4 left-4 z-40">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : (setReduced(!reduced)))}
        onContextMenu={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        aria-pressed={reduced}
        aria-label={reduced ? 'Enable background animations' : 'Reduce background animations'}
        title="Click: toggle reduce motion · Double-click / right-click: settings"
        className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs text-white/80 backdrop-blur-md transition hover:bg-black/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        {reduced ? <Zap className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
        <span className="hidden sm:inline">{reduced ? 'Motion: Reduced' : 'Reduce motion'}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          aria-label="Background settings"
          className="ml-1 grid h-5 w-5 place-items-center rounded-full hover:bg-white/10"
        >
          <Settings className="h-3 w-3" />
        </button>
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 w-72 rounded-lg border border-white/15 bg-black/85 p-4 text-xs text-white/85 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold tracking-wide text-white/90">Background settings</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close settings"
              className="grid h-6 w-6 place-items-center rounded hover:bg-white/10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <Row
            label="Reduce motion"
            hint="Slow drift, freeze CSS animations"
            checked={reduced}
            onChange={setReduced}
          />
          <Row
            label="Pause when reading"
            hint="Stops the background after 6s of no input"
            checked={pauseOnIdle}
            onChange={setPauseOnIdle}
          />
          <Row
            label="Low-power mode"
            hint="Disable WebGL, use a static gradient"
            checked={lowPower}
            onChange={toggleLowPower}
          />
          <Row
            label={
              <span className="flex items-center gap-1.5">
                <Bug className="h-3 w-3" /> Show perf overlay
              </span>
            }
            hint="FPS · DPR · parallax"
            checked={debug}
            onChange={toggleDebug}
          />

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span>Tilt sensitivity</span>
              <span className="font-mono text-white/60">{Math.round(orientSens * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={orientSens}
              onChange={(e) => setOrientSens(parseFloat(e.target.value))}
              className="w-full accent-white"
              aria-label="Device orientation sensitivity"
            />
            <p className="mt-1 text-[10px] text-white/50">
              Mobile only · controls how strongly device tilt drifts the camera.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

interface RowProps {
  label: React.ReactNode;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

const Row = ({ label, hint, checked, onChange }: RowProps) => (
  <label className="mb-2 flex cursor-pointer items-start justify-between gap-3 rounded px-1 py-1 hover:bg-white/5">
    <span className="flex-1">
      <span className="block text-white/90">{label}</span>
      {hint && <span className="block text-[10px] text-white/50">{hint}</span>}
    </span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 h-4 w-4 cursor-pointer accent-white"
    />
  </label>
);
