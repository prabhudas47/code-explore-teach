import { useState, useEffect } from 'react';
import './PuzzleRevealStyles.css';

interface Props {
  triggerAt?: number;
}

export const PuzzleReveal = ({ triggerAt = 12 }: Props) => {
  const [phase, setPhase] = useState<'hidden' | 'rising' | 'text' | 'fading'>('hidden');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('rising'), triggerAt * 1000);
    const t2 = setTimeout(() => setPhase('text'), (triggerAt + 0.3) * 1000);
    const t3 = setTimeout(() => setPhase('fading'), (triggerAt + 1.7) * 1000);
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
              <linearGradient id="puzzleFill" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="rgba(20,20,22,0.88)" />
                <stop offset="50%" stopColor="rgba(10,10,12,0.92)" />
                <stop offset="100%" stopColor="rgba(5,5,8,0.9)" />
              </linearGradient>

              {/* Outer glow filter */}
              <filter id="outerGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feFlood floodColor="rgba(255,255,255,0.12)" result="color" />
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

            {/* Soft outer glow */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              filter="url(#outerGlow)"
            />

            {/* Main puzzle body */}
            <path
              d={PUZZLE_PATH}
              fill="url(#puzzleFill)"
            />

            {/* Static white border */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="white"
              strokeWidth="1.2"
              strokeOpacity="0.7"
            />

            {/* Animated traveling light along border */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              className="puzzle-border-anim"
            />

            {/* Second traveling light (opposite direction) */}
            <path
              d={PUZZLE_PATH}
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="puzzle-border-anim-reverse"
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

// Refined natural puzzle piece with smooth organic knobs
const PUZZLE_PATH = `
  M 40,8
  Q 40,0 48,0
  L 95,0
  C 98,0 102,-6 110,-10
  C 118,-14 126,-14 134,-10
  C 142,-6 146,0 149,0
  L 208,0
  Q 216,0 216,8
  L 216,78
  C 216,81 222,85 226,93
  C 230,101 230,109 226,117
  C 222,125 216,129 216,132
  L 216,208
  Q 216,216 208,216
  L 149,216
  C 146,216 142,222 134,226
  C 126,230 118,230 110,226
  C 102,222 98,216 95,216
  L 48,216
  Q 40,216 40,208
  L 40,132
  C 40,129 34,125 30,117
  C 26,109 26,101 30,93
  C 34,85 40,81 40,78
  Z
`;
