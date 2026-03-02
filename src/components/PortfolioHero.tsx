import { useEffect, useState } from 'react';

export const PortfolioHero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6" id="hero">
      <div className="text-center relative z-10">
        {/* Tagline */}
        <p
          className={`text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-8 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Data Science • AI • Automation
        </p>

        {/* Name */}
        <h1
          className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-[0.9] mb-8 transition-all duration-1000 delay-200 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          DASU
          <br />
          Prabhukumar
        </h1>

        {/* Subtext */}
        <p
          className={`text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          I design intelligent systems, automate workflows,
          <br className="hidden sm:block" />
          and build structured data-driven solutions.
        </p>

        {/* Buttons */}
        <div
          className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-foreground text-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-105"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-muted-foreground text-sm tracking-wider uppercase hover:border-foreground hover:text-foreground transition-all duration-300 hover:scale-105"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-1000 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <a href="#about" className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-scroll-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
};
