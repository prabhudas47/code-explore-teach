import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Data Science Analysis Pipeline',
    description: 'End-to-end data processing and visualization pipeline built with Python and modern ML frameworks.',
  },
  {
    title: 'Telugu NLP Toolkit',
    description: 'Natural language processing tools for Telugu language text analysis and linguistic research.',
  },
  {
    title: 'Portfolio Website',
    description: 'Cinematic, puzzle-themed personal portfolio built with React, Three.js, and modern web technologies.',
  },
];

export const PortfolioProjects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-16 sm:py-32 px-4 sm:px-6 relative content-layer">
      <div className="max-w-3xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Work</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Projects
          </h2>
        </div>

        <div className="space-y-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className={`group glass-card rounded-xl p-5 sm:p-8 transition-all duration-700 hover:border-foreground/15 hover:-translate-y-1 hover:shadow-[0_8px_40px_hsl(0_0%_100%/0.04)] cursor-pointer ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-foreground/90 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                </div>
                <div className="p-2 rounded-lg border border-border/50 text-muted-foreground group-hover:text-foreground group-hover:border-foreground/20 transition-all shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
