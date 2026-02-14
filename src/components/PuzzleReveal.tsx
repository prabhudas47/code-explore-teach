import { useState, useEffect } from 'react';

interface Props {
  triggerAt?: number; // seconds after mount to show
}

export const PuzzleReveal = ({ triggerAt = 12 }: Props) => {
  const [phase, setPhase] = useState<'hidden' | 'rising' | 'text' | 'fading'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('rising'), triggerAt * 1000);
    const t2 = setTimeout(() => setPhase('text'), (triggerAt + 2.5) * 1000);
    const t3 = setTimeout(() => setPhase('fading'), (triggerAt + 5.5) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [triggerAt]);

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none flex items-center justify-center">
      {/* Puzzle piece container */}
      <div
        className={`
          relative transition-all ease-out
          ${phase === 'rising' ? 'duration-[2500ms] translate-y-0 opacity-100 scale-100' : ''}
          ${phase === 'text' ? 'duration-1000 translate-y-0 opacity-100 scale-100' : ''}
          ${phase === 'fading' ? 'duration-[2000ms] translate-y-0 opacity-0 scale-95' : ''}
          ${phase === 'rising' && 'animate-none'}
        `}
        style={{
          transform: phase === 'rising' ? undefined : undefined,
          // initial position handled by CSS animation
        }}
      >
        <svg
          width="320"
          height="360"
          viewBox="0 0 320 360"
          className={`
            drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]
            ${phase === 'rising' ? 'puzzle-rise' : ''}
            ${phase === 'fading' ? 'puzzle-fade-out' : ''}
          `}
        >
          <defs>
            <clipPath id="puzzleClip">
              <path d={puzzlePath} />
            </clipPath>
            <linearGradient id="puzzleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="100%" stopColor="#0a0a0a" />
            </linearGradient>
            <filter id="puzzleGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Puzzle piece body */}
          <path
            d={puzzlePath}
            fill="url(#puzzleGrad)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
            filter="url(#puzzleGlow)"
          />

          {/* Water drip effects */}
          {phase === 'rising' && (
            <>
              <circle className="water-drop drop-1" cx="80" cy="340" r="3" fill="rgba(255,255,255,0.2)" />
              <circle className="water-drop drop-2" cx="160" cy="350" r="2.5" fill="rgba(255,255,255,0.15)" />
              <circle className="water-drop drop-3" cx="240" cy="345" r="2" fill="rgba(255,255,255,0.18)" />
              <circle className="water-drop drop-4" cx="120" cy="355" r="1.8" fill="rgba(255,255,255,0.12)" />
              <circle className="water-drop drop-5" cx="200" cy="348" r="2.2" fill="rgba(255,255,255,0.14)" />
            </>
          )}

          {/* Text inside puzzle */}
          <foreignObject
            x="30" y="60" width="260" height="240"
            clipPath="url(#puzzleClip)"
          >
            <div
              className={`
                flex flex-col items-center justify-center h-full text-center px-4
                transition-opacity duration-[1500ms] ease-in-out
                ${phase === 'text' || phase === 'fading' ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <p className="text-white/60 text-[10px] tracking-[0.4em] uppercase mb-3 font-light">
                Prepare yourself
              </p>
              <p className="text-white text-lg font-light leading-relaxed tracking-wide">
                You're about to enter
              </p>
              <p className="text-white text-lg font-light leading-relaxed tracking-wide">
                another world
              </p>
              <div className="w-8 h-[1px] bg-white/20 my-3" />
              <p className="text-white/40 text-[11px] tracking-[0.2em] uppercase font-light">
                Portfolio awaits
              </p>
            </div>
          </foreignObject>
        </svg>
      </div>

      {/* Ripple effect at bottom when puzzle emerges */}
      {phase === 'rising' && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2">
          <div className="ripple-ring ring-1" />
          <div className="ripple-ring ring-2" />
          <div className="ripple-ring ring-3" />
        </div>
      )}
    </div>
  );
};

// Puzzle piece SVG path with knobs
const puzzlePath = `
  M 40,20
  L 130,20
  C 130,20 135,0 160,0
  C 185,0 190,20 190,20
  L 280,20
  Q 300,20 300,40
  L 300,120
  C 300,120 320,125 320,150
  C 320,175 300,180 300,180
  L 300,260
  Q 300,280 280,280
  L 190,280
  C 190,280 185,300 160,300
  C 135,300 130,280 130,280
  L 40,280
  Q 20,280 20,260
  L 20,180
  C 20,180 0,175 0,150
  C 0,125 20,120 20,120
  L 20,40
  Q 20,20 40,20
  Z
`;
