import { useEffect, useRef, useState } from 'react';

export const CinematicSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: '70vh' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Video */}
      <div
        className="absolute inset-0 transition-all duration-[800ms] ease-in-out"
        style={{
          transform: isVisible ? 'scale(1)' : 'scale(1.05)',
          opacity: isVisible ? 1 : 0,
        }}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        >
          <source src="/videos/prabhu_spirit.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.95) 100%)',
        }}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="text-foreground text-lg sm:text-xl md:text-2xl tracking-wider text-center px-6 transition-all duration-1000 delay-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease-in-out 0.3s, transform 1s ease-in-out 0.3s',
          }}
        >
          Driven by Vision. Powered by Intelligence.
        </p>
      </div>
    </section>
  );
};
