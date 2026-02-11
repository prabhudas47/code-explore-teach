import { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';

export const PortfolioHero = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative" id="hero">
      <div
        className={`max-w-3xl mx-auto text-center px-6 transition-all duration-[2000ms] ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Glass panel */}
        <div className="glass-panel rounded-2xl p-10 md:p-16">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800 }}
          >
            DASU PRABHU KUMAR
          </h1>

          <p className="text-sm md:text-base tracking-[0.25em] uppercase text-muted-foreground mb-8">
            Computer Science Engineer &nbsp;|&nbsp; Data Science Enthusiast
          </p>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12">
            Undergraduate B.Tech student focused on technology, data science, and building impactful digital solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-foreground/20 text-foreground font-medium rounded-full hover:border-foreground/60 hover:shadow-[0_0_25px_hsl(0_0%_100%/0.1)] transition-all duration-500"
            >
              View Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-foreground/10 text-muted-foreground font-medium rounded-full hover:border-foreground/30 hover:text-foreground transition-all duration-500"
            >
              Contact Me
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1000ms' }}
      >
        <a
          href="#education"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-float" />
        </a>
      </div>
    </section>
  );
};
