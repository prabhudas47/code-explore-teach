import { useEffect, useState } from 'react';

export const PortfolioHero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative px-4 sm:px-6 pt-20" id="hero">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div
          className={`transition-all duration-[1800ms] ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border text-xs text-primary tracking-widest uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Open to Opportunities
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, letterSpacing: '-0.02em' }}
          >
            DASU{' '}
            <span className="text-gradient">Prabhukumar</span>
          </h1>

          <p className="text-base sm:text-lg text-primary/80 font-medium mb-3">
            Aspiring Data Scientist | AI & Intelligent Automation Builder
          </p>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-lg">
            I design intelligent systems, automate workflows, and build scalable data-driven solutions.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold text-sm tracking-wide rounded-lg hover:shadow-[0_0_30px_hsl(185_90%_55%/0.4)] transition-all duration-300 hover:-translate-y-0.5"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-border text-foreground font-semibold text-sm tracking-wide rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Right — info card */}
        <div
          className={`transition-all duration-[2200ms] ease-out delay-300 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="glass-card rounded-xl p-6 sm:p-8 animate-float max-w-sm mx-auto lg:ml-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">B.Tech Computer Science</p>
                <p className="text-xs text-primary">(Data Science)</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Institution</span>
                <span className="text-foreground font-medium">NRI Institute of Technology</span>
              </div>
              <div className="section-divider" />
              <div className="flex justify-between text-muted-foreground">
                <span>Duration</span>
                <span className="text-foreground font-medium">2023 – 2027</span>
              </div>
              <div className="section-divider" />
              <div className="flex justify-between text-muted-foreground">
                <span>Location</span>
                <span className="text-foreground font-medium">Andhra Pradesh, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <a href="#about" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <span className="text-[10px] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
        </a>
      </div>
    </section>
  );
};
