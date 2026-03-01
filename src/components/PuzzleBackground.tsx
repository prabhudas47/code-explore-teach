import { useMemo } from 'react';
import './PuzzleBackgroundStyles.css';

// Generate jigsaw puzzle piece SVG path with tabs/blanks
const generatePuzzlePiecePath = (
  x: number, y: number, w: number, h: number,
  tabTop: number, tabRight: number, tabBottom: number, tabLeft: number
): string => {
  const tabSize = Math.min(w, h) * 0.18;
  const tabNeck = tabSize * 0.4;
  
  let d = `M ${x} ${y}`;
  
  // Top edge
  if (tabTop !== 0) {
    const mid = x + w / 2;
    d += ` L ${mid - tabNeck * 1.5} ${y}`;
    if (tabTop === 1) {
      d += ` C ${mid - tabNeck} ${y}, ${mid - tabSize * 0.8} ${y - tabSize * 1.1}, ${mid} ${y - tabSize * 1.1}`;
      d += ` C ${mid + tabSize * 0.8} ${y - tabSize * 1.1}, ${mid + tabNeck} ${y}, ${mid + tabNeck * 1.5} ${y}`;
    } else {
      d += ` C ${mid - tabNeck} ${y}, ${mid - tabSize * 0.8} ${y + tabSize * 1.1}, ${mid} ${y + tabSize * 1.1}`;
      d += ` C ${mid + tabSize * 0.8} ${y + tabSize * 1.1}, ${mid + tabNeck} ${y}, ${mid + tabNeck * 1.5} ${y}`;
    }
  }
  d += ` L ${x + w} ${y}`;
  
  // Right edge
  if (tabRight !== 0) {
    const mid = y + h / 2;
    d += ` L ${x + w} ${mid - tabNeck * 1.5}`;
    if (tabRight === 1) {
      d += ` C ${x + w} ${mid - tabNeck}, ${x + w + tabSize * 1.1} ${mid - tabSize * 0.8}, ${x + w + tabSize * 1.1} ${mid}`;
      d += ` C ${x + w + tabSize * 1.1} ${mid + tabSize * 0.8}, ${x + w} ${mid + tabNeck}, ${x + w} ${mid + tabNeck * 1.5}`;
    } else {
      d += ` C ${x + w} ${mid - tabNeck}, ${x + w - tabSize * 1.1} ${mid - tabSize * 0.8}, ${x + w - tabSize * 1.1} ${mid}`;
      d += ` C ${x + w - tabSize * 1.1} ${mid + tabSize * 0.8}, ${x + w} ${mid + tabNeck}, ${x + w} ${mid + tabNeck * 1.5}`;
    }
  }
  d += ` L ${x + w} ${y + h}`;
  
  // Bottom edge
  if (tabBottom !== 0) {
    const mid = x + w / 2;
    d += ` L ${mid + tabNeck * 1.5} ${y + h}`;
    if (tabBottom === 1) {
      d += ` C ${mid + tabNeck} ${y + h}, ${mid + tabSize * 0.8} ${y + h + tabSize * 1.1}, ${mid} ${y + h + tabSize * 1.1}`;
      d += ` C ${mid - tabSize * 0.8} ${y + h + tabSize * 1.1}, ${mid - tabNeck} ${y + h}, ${mid - tabNeck * 1.5} ${y + h}`;
    } else {
      d += ` C ${mid + tabNeck} ${y + h}, ${mid + tabSize * 0.8} ${y + h - tabSize * 1.1}, ${mid} ${y + h - tabSize * 1.1}`;
      d += ` C ${mid - tabSize * 0.8} ${y + h - tabSize * 1.1}, ${mid - tabNeck} ${y + h}, ${mid - tabNeck * 1.5} ${y + h}`;
    }
  }
  d += ` L ${x} ${y + h}`;
  
  // Left edge
  if (tabLeft !== 0) {
    const mid = y + h / 2;
    d += ` L ${x} ${mid + tabNeck * 1.5}`;
    if (tabLeft === 1) {
      d += ` C ${x} ${mid + tabNeck}, ${x - tabSize * 1.1} ${mid + tabSize * 0.8}, ${x - tabSize * 1.1} ${mid}`;
      d += ` C ${x - tabSize * 1.1} ${mid - tabSize * 0.8}, ${x} ${mid - tabNeck}, ${x} ${mid - tabNeck * 1.5}`;
    } else {
      d += ` C ${x} ${mid + tabNeck}, ${x + tabSize * 1.1} ${mid + tabSize * 0.8}, ${x + tabSize * 1.1} ${mid}`;
      d += ` C ${x + tabSize * 1.1} ${mid - tabSize * 0.8}, ${x} ${mid - tabNeck}, ${x} ${mid - tabNeck * 1.5}`;
    }
  }
  d += ` Z`;
  
  return d;
};

interface PieceData {
  id: string;
  path: string;
  cx: number;
  cy: number;
}

export const PuzzleBackground = () => {
  const cols = 7;
  const rows = 10;

  const pieces = useMemo(() => {
    const svgW = 1000;
    const svgH = 1400;
    const pw = svgW / cols;
    const ph = svgH / rows;

    // Pre-compute tab directions so adjacent pieces interlock
    // Horizontal tabs (between col and col+1): cols-1 per row
    const hTabs: number[][] = [];
    for (let r = 0; r < rows; r++) {
      hTabs[r] = [];
      for (let c = 0; c < cols - 1; c++) {
        hTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
      }
    }
    // Vertical tabs (between row and row+1): rows-1 per col
    const vTabs: number[][] = [];
    for (let r = 0; r < rows - 1; r++) {
      vTabs[r] = [];
      for (let c = 0; c < cols; c++) {
        vTabs[r][c] = Math.random() > 0.5 ? 1 : -1;
      }
    }

    const result: PieceData[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * pw;
        const y = r * ph;

        const tabTop = r === 0 ? 0 : -vTabs[r - 1][c];
        const tabBottom = r === rows - 1 ? 0 : vTabs[r][c];
        const tabLeft = c === 0 ? 0 : -hTabs[r][c - 1];
        const tabRight = c === cols - 1 ? 0 : hTabs[r][c];

        result.push({
          id: `${r}-${c}`,
          path: generatePuzzlePiecePath(x, y, pw, ph, tabTop, tabRight, tabBottom, tabLeft),
          cx: x + pw / 2,
          cy: y + ph / 2,
        });
      }
    }
    return result;
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0, background: '#020202' }}>
      <svg
        viewBox="0 0 1000 1400"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Noise texture filter */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>

          {/* Ambient occlusion / inner shadow for depth in seams */}
          <filter id="pieceDepth" x="-5%" y="-5%" width="110%" height="110%">
            {/* Soft inner shadow for bevel */}
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feOffset dx="1.5" dy="2" result="offsetBlur" />
            <feFlood floodColor="#000000" floodOpacity="0.6" result="shadowColor" />
            <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Top-left key light highlight */}
          <linearGradient id="keyLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.01" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
          </linearGradient>

          {/* Rim light from bottom-right */}
          <linearGradient id="rimLight" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Vignette */}
          <radialGradient id="vignette" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </radialGradient>

          {/* Subtle surface texture per piece */}
          <filter id="surfaceTexture" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="2.5" numOctaves="3" seed="42" result="tex" />
            <feColorMatrix type="saturate" values="0" in="tex" result="grayTex" />
            <feBlend in="SourceGraphic" in2="grayTex" mode="multiply" />
          </filter>

          {/* Colored glow filter for borders */}
          <filter id="borderGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Piece shadows layer (rendered behind pieces) */}
        <g>
          {pieces.map((piece) => (
            <path
              key={`shadow-${piece.id}`}
              d={piece.path}
              fill="none"
              stroke="#000000"
              strokeWidth="6"
              strokeOpacity="0.5"
              filter="url(#pieceDepth)"
            />
          ))}
        </g>

        {/* Puzzle pieces */}
        <g filter="url(#surfaceTexture)" style={{ animation: 'wallColorShift 40s ease-in-out infinite' }}>
          {pieces.map((piece, i) => {
            const delay = ((i * 0.37) % 4).toFixed(2);
            const delayAlt = (((i * 0.53) + 1.5) % 5).toFixed(2);
            return (
              <g key={piece.id} className="puzzle-piece-hover">
                {/* Piece fill with breathing glow */}
                <path
                  d={piece.path}
                  fill="#0a0a0a"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  className="piece-border-pulse"
                  style={{ animationDelay: `${(i * 0.6 % 5).toFixed(2)}s` }}
                />
                {/* Colored glow border layer */}
                <path
                  d={piece.path}
                  fill="none"
                  stroke="rgba(100,180,255,0.2)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  filter="url(#borderGlow)"
                  className="piece-border-pulse"
                  style={{ animationDelay: `${((i * 0.7 + 2) % 5).toFixed(2)}s` }}
                />
                {/* Breathing ambient glow overlay */}
                <path
                  d={piece.path}
                  fill="rgba(255,255,255,1)"
                  className="piece-breathe"
                  style={{ animationDelay: `${(i * 0.8 % 6).toFixed(2)}s` }}
                />
                {/* Animated traveling white border */}
                <path
                  d={piece.path}
                  fill="none"
                  stroke="white"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                  className="wall-border-anim"
                  style={{ animationDelay: `${delay}s` }}
                />
                <path
                  d={piece.path}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  className="wall-border-anim-reverse"
                  style={{ animationDelay: `${delayAlt}s` }}
                />
                {/* Key light overlay */}
                <path d={piece.path} fill="url(#keyLight)" />
                {/* Rim light overlay */}
                <path d={piece.path} fill="url(#rimLight)" />
              </g>
            );
          })}
        </g>

        {/* Vignette overlay */}
        <rect x="0" y="0" width="1000" height="1400" fill="url(#vignette)" />
      </svg>
    </div>
  );
};
