import { useScrollReveal } from '@/hooks/useScrollReveal';

const timeline = [
  {
    period: '2023 — 2027',
    title: 'B.Tech Computer Science (Data Science)',
    institution: 'NRI Institute of Technology',
  },
  {
    period: '2021 — 2023',
    title: 'Intermediate',
    institution: 'Sri Chaitanya Junior College',
  },
];

export const JourneySection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="education" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p
          className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Education
        </p>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-16">
            {timeline.map((item, i) => (
              <div
                key={item.period}
                className={`group relative pl-10 transition-all duration-700 cursor-default ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${300 + i * 200}ms` }}
              >
                {/* Timeline dot with pulse on hover */}
                <div className="absolute left-[-3px] top-2 w-[7px] h-[7px] rounded-full bg-foreground transition-all duration-300 group-hover:scale-[2.2] group-hover:bg-primary group-hover:shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
                
                {/* Hover highlight bar */}
                <div className="absolute left-0 top-0 bottom-0 w-px bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                <div className="relative p-4 -m-4 rounded-lg transition-all duration-300 group-hover:bg-accent/50 group-hover:translate-x-2">
                  <span className="text-xs text-muted-foreground tracking-widest font-mono transition-colors duration-300 group-hover:text-primary">{item.period}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mt-2 tracking-tight transition-all duration-300 group-hover:tracking-normal">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 transition-colors duration-300 group-hover:text-foreground/70">{item.institution}</p>
                  
                  {/* Underline reveal */}
                  <div className="h-px bg-primary/30 mt-4 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
