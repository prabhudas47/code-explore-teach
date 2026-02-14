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
      {/* Water surface line - the "ocean surface" the piece rises through */}
      <div className="absolute bottom-[38%] left-0 right-0 h-[2px] water-surface-line" />

      {/* Splash particles at surface level when piece breaks through */}
      {(phase === 'rising') && (
        <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2 w-[400px] h-[100px]">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="splash-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${0.1 + Math.random() * 0.8}s`,
                animationDuration: `${0.8 + Math.random() * 0.6}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ripples on the water surface */}
      {(phase === 'rising') && (
        <div className="absolute bottom-[38%] left-1/2 -translate-x-1/2">
          <div className="water-ripple ripple-1" />
          <div className="water-ripple ripple-2" />
          <div className="water-ripple ripple-3" />
          <div className="water-ripple ripple-4" />
        </div>
      )}

      {/* The puzzle piece — starts fully below, rises up through the surface */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 puzzle-piece-wrapper">
        <div className={`puzzle-piece-container ${phase === 'rising' || phase === 'text' ? 'puzzle-emerge' : ''} ${phase === 'fading' ? 'puzzle-sink' : ''}`}>
          <svg
            viewBox="0 0 260 300"
            className="puzzle-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Realistic matte dark surface */}
              <linearGradient id="matteSurface" x1="0" y1="0" x2="0.2" y2="1">
                <stop offset="0%" stopColor="#1c1c1c" />
                <stop offset="40%" stopColor="#111111" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>

              {/* Subtle edge light */}
              <linearGradient id="edgeLight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
              </linearGradient>

              {/* Inner shadow for depth */}
              <filter id="innerDepth">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                <feOffset dx="2" dy="3" result="offsetBlur" />
                <feFlood floodColor="rgba(0,0,0,0.6)" result="color" />
                <feComposite in="color" in2="offsetBlur" operator="in" result="shadow" />
                <feComposite in="SourceGraphic" in2="shadow" operator="over" />
              </filter>

              {/* Ambient glow */}
              <filter id="ambientGlow">
                <feGaussianBlur stdDeviation="15" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="puzzleShape">
                <path d={PUZZLE_PATH} />
              </clipPath>
            </defs>

            {/* Outer glow/ambient */}
            <path
              d={PUZZLE_PATH}
              fill="rgba(255,255,255,0.03)"
              filter="url(#ambientGlow)"
            />

            {/* Main puzzle body */}
            <path
              d={PUZZLE_PATH}
              fill="url(#matteSurface)"
              filter="url(#innerDepth)"
            />

            {/* Edge highlight */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="url(#edgeLight)"
              strokeWidth="1"
            />

            {/* Subtle surface texture lines */}
            <g clipPath="url(#puzzleShape)" opacity="0.03">
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1={0} y1={i * 26} x2={260} y2={i * 26 + 8}
                  stroke="white" strokeWidth="0.5"
                />
              ))}
            </g>

            {/* Water drips running down the piece */}
            {(phase === 'rising' || phase === 'text') && (
              <g clipPath="url(#puzzleShape)">
                <rect className="water-drip drip-1" x="60" y="-20" width="2" height="30" rx="1" fill="rgba(255,255,255,0.08)" />
                <rect className="water-drip drip-2" x="130" y="-10" width="1.5" height="25" rx="1" fill="rgba(255,255,255,0.06)" />
                <rect className="water-drip drip-3" x="190" y="-30" width="2" height="35" rx="1" fill="rgba(255,255,255,0.07)" />
                <rect className="water-drip drip-4" x="95" y="-15" width="1" height="20" rx="1" fill="rgba(255,255,255,0.05)" />
                <rect className="water-drip drip-5" x="165" y="-25" width="1.5" height="28" rx="1" fill="rgba(255,255,255,0.06)" />
              </g>
            )}

            {/* Text content */}
            <foreignObject x="25" y="50" width="210" height="200" clipPath="url(#puzzleShape)">
              <div
                className={`
                  flex flex-col items-center justify-center h-full text-center
                  transition-opacity ease-in-out
                  ${phase === 'text' || phase === 'fading' ? 'opacity-100 duration-[2000ms]' : 'opacity-0 duration-500'}
                `}
              >
                <p className="text-white/40 text-[9px] tracking-[0.5em] uppercase mb-2 font-extralight">
                  Brace yourself
                </p>
                <div className="w-5 h-[0.5px] bg-white/10 mb-3" />
                <p className="text-white/90 text-base font-extralight leading-relaxed tracking-wider">
                  Another world
                </p>
                <p className="text-white/90 text-base font-extralight leading-relaxed tracking-wider">
                  awaits you
                </p>
                <div className="w-5 h-[0.5px] bg-white/10 mt-3 mb-2" />
                <p className="text-white/25 text-[8px] tracking-[0.3em] uppercase font-light">
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

// Natural puzzle piece path — smoother curves, organic knobs
const PUZZLE_PATH = `
  M 35,15
  C 35,8 42,2 50,2
  L 100,2
  C 104,2 108,-8 120,-8
  C 132,-8 136,2 140,2
  L 210,2
  C 218,2 225,8 225,15
  L 225,85
  C 225,89 235,93 235,105
  C 235,117 225,121 225,125
  L 225,210
  C 225,218 218,225 210,225
  L 140,225
  C 136,225 132,235 120,235
  C 108,235 104,225 100,225
  L 50,225
  C 42,225 35,218 35,210
  L 35,125
  C 35,121 25,117 25,105
  C 25,93 35,89 35,85
  Z
`;
