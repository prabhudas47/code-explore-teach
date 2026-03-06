import { useEffect, useRef, useState, useCallback } from 'react';

interface CinematicSectionProps {
  onDoubleTab?: () => void;
}

export const CinematicSection = ({ onDoubleTab }: CinematicSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasPlayedRef = useRef(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          videoRef.current?.play().catch(() => {});
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 400) {
      onDoubleTab?.();
    }
    lastTapRef.current = now;
  }, [onDoubleTab]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '70vh' }}
      onContextMenu={(e) => e.preventDefault()}
      onClick={handleTap}
      onTouchEnd={handleTap}
    >
      <div
        className="absolute inset-0 transition-all duration-[800ms] ease-in-out"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(1.05)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <video ref={videoRef} muted playsInline preload="auto" className="w-full h-full object-cover" style={{ display: 'block' }}>
          <source src="/videos/prabhu_spirit.mp4" type="video/mp4" />
        </video>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.95) 100%)' }}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-12 sm:pb-16">
        <p
          className="text-foreground text-lg sm:text-xl md:text-2xl tracking-wider text-center px-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1.2s ease-in-out 0.5s, transform 1.2s ease-in-out 0.5s',
          }}
        >
          Driven by Vision. Powered by Intelligence.
        </p>
      </div>
    </section>
  );
};
