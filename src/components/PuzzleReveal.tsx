import { useState, useEffect } from 'react';

interface Props {
  triggerAt?: number;
}

export const PuzzleReveal = ({ triggerAt = 12 }: Props) => {
  const [phase, setPhase] = useState<'hidden' | 'rising' | 'text' | 'fading'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('rising'), triggerAt * 1000);
    const t2 = setTimeout(() => setPhase('text'), (triggerAt + 3) * 1000);
    const t3 = setTimeout(() => setPhase('fading'), (triggerAt + 6) * 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [triggerAt]);

  if (phase === 'hidden') return null;

  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Water ripples at the emergence point */}
      {phase === 'rising' && (
        <div className="absolute top-[55%] left-1/2 -translate-x-1/2">
          <div className="water-ripple ripple-1" />
          <div className="water-ripple ripple-2" />
          <div className="water-ripple ripple-3" />
          <div className="water-ripple ripple-4" />
        </div>
      )}

      {/* Splash particles */}
      {phase === 'rising' && (
        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[400px] h-[120px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="splash-particle"
              style={{
                left: `${15 + Math.random() * 70}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.8 + Math.random() * 0.7}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Puzzle piece — rises from below center into view */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`
            puzzle-piece-container
            ${phase === 'rising' || phase === 'text' ? 'puzzle-emerge' : ''}
            ${phase === 'fading' ? 'puzzle-sink' : ''}
          `}
        >
          <svg
            viewBox="0 0 260 280"
            className="puzzle-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Glass-like translucent fill so chess terrain shows through */}
              <linearGradient id="puzzleFill" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="rgba(30,30,30,0.85)" />
                <stop offset="50%" stopColor="rgba(15,15,15,0.9)" />
                <stop offset="100%" stopColor="rgba(8,8,8,0.88)" />
              </linearGradient>

              {/* Bright edge glow */}
              <linearGradient id="edgeGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.12)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
              </linearGradient>

              {/* Outer glow filter */}
              <filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feFlood floodColor="rgba(255,255,255,0.15)" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="puzzleClip">
                <path d={PUZZLE_PATH} />
              </clipPath>
            </defs>

            {/* Outer ambient glow */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              filter="url(#outerGlow)"
            />

            {/* Main puzzle body — semi-translucent dark */}
            <path
              d={PUZZLE_PATH}
              fill="url(#puzzleFill)"
            />

            {/* Bright visible edge */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="url(#edgeGlow)"
              strokeWidth="1.5"
            />

            {/* Inner highlight line for 3D depth */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
              transform="translate(1.5, 1.5) scale(0.988)"
            />

            {/* Water drips */}
            {(phase === 'rising' || phase === 'text') && (
              <g clipPath="url(#puzzleClip)">
                <rect className="water-drip drip-1" x="60" y="-10" width="2" height="40" rx="1" fill="rgba(255,255,255,0.12)" />
                <rect className="water-drip drip-2" x="130" y="-5" width="1.5" height="30" rx="1" fill="rgba(255,255,255,0.08)" />
                <rect className="water-drip drip-3" x="190" y="-15" width="2" height="45" rx="1" fill="rgba(255,255,255,0.1)" />
                <rect className="water-drip drip-4" x="95" y="-8" width="1.2" height="25" rx="1" fill="rgba(255,255,255,0.07)" />
                <rect className="water-drip drip-5" x="165" y="-12" width="1.5" height="35" rx="1" fill="rgba(255,255,255,0.09)" />
              </g>
            )}

            {/* Text content */}
            <foreignObject x="30" y="40" width="200" height="200" clipPath="url(#puzzleClip)">
              <div
                className={`
                  flex flex-col items-center justify-center h-full text-center
                  transition-opacity ease-in-out
                  ${phase === 'text' || phase === 'fading' ? 'opacity-100 duration-[2000ms]' : 'opacity-0 duration-500'}
                `}
              >
                <p className="text-white/50 text-[9px] tracking-[0.5em] uppercase mb-2 font-extralight">
                  Brace yourself
                </p>
                <div className="w-6 h-[0.5px] bg-white/20 mb-3" />
                <p className="text-white text-base font-extralight leading-relaxed tracking-wider">
                  Another world
                </p>
                <p className="text-white text-base font-extralight leading-relaxed tracking-wider">
                  awaits you
                </p>
                <div className="w-6 h-[0.5px] bg-white/20 mt-3 mb-2" />
                <p className="text-white/30 text-[8px] tracking-[0.3em] uppercase font-light">
                  Portfolio
                </p>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Natural puzzle piece path with organic knobs
const PUZZLE_PATH = `
  M 35,12
  C 35,5 42,0 50,0
  L 100,0
  C 105,0 110,-12 130,-12
  C 150,-12 155,0 160,0
  L 210,0
  C 218,0 225,5 225,12
  L 225,80
  C 225,85 238,90 238,105
  C 238,120 225,125 225,130
  L 225,210
  C 225,218 218,225 210,225
  L 160,225
  C 155,225 150,237 130,237
  C 110,237 105,225 100,225
  L 50,225
  C 42,225 35,218 35,210
  L 35,130
  C 35,125 22,120 22,105
  C 22,90 35,85 35,80
  Z
`;
