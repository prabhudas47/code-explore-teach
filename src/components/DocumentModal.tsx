import { useEffect, useRef, useState } from 'react';

interface DocumentModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}

export const DocumentModal = ({ open, onClose, imageSrc, title }: DocumentModalProps) => {
  const [scale, setScale] = useState(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setScale(1);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    setScale(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-500"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div
        className="max-w-[90vw] max-h-[85vh] transition-transform duration-500 ease-out animate-[scaleIn_0.4s_ease-out]"
        onWheel={handleWheel}
        onClick={() => setScale(prev => prev === 1 ? 1.5 : 1)}
      >
        <p className="text-white/50 text-xs tracking-widest uppercase text-center mb-4">{title}</p>
        <img
          src={imageSrc}
          alt={title}
          className="max-h-[75vh] w-auto mx-auto rounded-lg shadow-2xl cursor-zoom-in transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
          onContextMenu={e => e.preventDefault()}
          draggable={false}
        />
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
