import { Sparkles, Zap } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const ReduceMotionToggle = () => {
  const [reduced, setReduced] = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => setReduced(!reduced)}
      aria-pressed={reduced}
      aria-label={reduced ? 'Enable background animations' : 'Reduce background animations'}
      title={reduced ? 'Animations are reduced — click to enable' : 'Reduce motion'}
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs text-white/80 backdrop-blur-md transition hover:bg-black/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/40"
    >
      {reduced ? <Zap className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{reduced ? 'Motion: Reduced' : 'Reduce motion'}</span>
    </button>
  );
};
