import { useEffect, useState } from 'react';

export const PortfolioHero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 sm:px-6" id="hero">
      <div
        className={`w-full max-w-3xl mx-auto text-center transition-all duration-[1800ms] ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-3 sm:mb-5 text-foreground"
          style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' }}
        >
          Dasu Prabhu Kumar
        </h1>

        <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase text-muted-foreground mb-8 sm:mb-14">
          Computer Science Engineer &nbsp;|&nbsp; Data Science Enthusiast
        </p>

        <a
          href="#projects"
          className="inline-flex items-center justify-center px-6 sm:px-10 py-3 sm:py-4 bg-foreground text-background font-medium text-xs sm:text-sm tracking-wide uppercase rounded-none hover:bg-background hover:text-foreground border border-foreground transition-all duration-300"
        >
          View Projects
        </a>
      </div>
    </section>
  );
};
