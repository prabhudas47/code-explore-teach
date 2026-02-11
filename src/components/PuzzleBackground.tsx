import { useEffect, useRef, useState } from 'react';

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  delay: number;
  offsetX: number;
  offsetY: number;
}

export const PuzzleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cols = 8;
    const rows = 12;
    const generated: PuzzlePiece[] = [];
    let id = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        generated.push({
          id: id++,
          x: (col / cols) * 100,
          y: (row / rows) * 100,
          width: 100 / cols,
          height: 100 / rows,
          delay: Math.random() * 2000 + 500,
          offsetX: (Math.random() - 0.5) * 60,
          offsetY: (Math.random() - 0.5) * 60,
        });
      }
    }
    setPieces(generated);

    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setMousePos({ x: e.touches[0].clientX / window.innerWidth, y: e.touches[0].clientY / window.innerHeight });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: 0, background: '#000' }}
    >
      {/* Puzzle pieces */}
      {pieces.map((piece) => {
        const distX = (mousePos.x - (piece.x + piece.width / 2) / 100);
        const distY = (mousePos.y - (piece.y + piece.height / 2) / 100);
        const dist = Math.sqrt(distX * distX + distY * distY);
        const lightIntensity = Math.max(0, 1 - dist * 3);

        return (
          <div
            key={piece.id}
            className="absolute transition-all duration-[2000ms] ease-out"
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: `${piece.width}%`,
              height: `${piece.height}%`,
              opacity: loaded ? 1 : 0,
              transform: loaded
                ? `translate(0, 0) scale(1)`
                : `translate(${piece.offsetX}px, ${piece.offsetY}px) scale(0.85)`,
              transitionDelay: `${piece.delay}ms`,
            }}
          >
            <div
              className="w-full h-full relative"
              style={{
                background: `linear-gradient(135deg, hsl(0 0% ${3 + lightIntensity * 4}%), hsl(0 0% ${2 + lightIntensity * 2}%))`,
                border: `1px solid hsl(0 0% ${8 + lightIntensity * 15}% / ${0.3 + lightIntensity * 0.4})`,
                boxShadow: lightIntensity > 0.1
                  ? `inset 0 1px 0 hsl(0 0% 100% / ${lightIntensity * 0.1}), 0 4px 20px hsl(0 0% 0% / 0.5), 0 0 ${lightIntensity * 30}px hsl(0 0% 100% / ${lightIntensity * 0.05})`
                  : `inset 0 1px 0 hsl(0 0% 100% / 0.03), 0 4px 20px hsl(0 0% 0% / 0.5)`,
                transition: 'background 0.6s ease, border 0.6s ease, box-shadow 0.6s ease',
              }}
            />
          </div>
        );
      })}

      {/* Cinematic light sweep */}
      <div
        ref={sweepRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 0%, transparent 40%, hsl(0 0% 100% / 0.02) 45%, hsl(0 0% 100% / 0.04) 50%, hsl(0 0% 100% / 0.02) 55%, transparent 60%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'lightSweep 12s ease-in-out infinite',
        }}
      />

      {/* Depth fog overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, hsl(0 0% 0% / 0.4) 100%)',
        }}
      />
    </div>
  );
};
