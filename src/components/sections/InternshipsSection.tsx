import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultInternships = [
  {
    role: 'AI / Data Science Intern',
    organization: 'Upcoming Opportunity',
    duration: 'Expected 2025',
    responsibilities: ['Building ML models for data analysis', 'Developing automation pipelines', 'Creating data visualization dashboards'],
    tools: ['Python', 'TensorFlow', 'n8n', 'SQL'],
    problem: 'Automating manual data processing workflows',
    outcome: 'Actively seeking impactful internship opportunities in AI & Data Science',
  },
  {
    role: 'Academic Project Lead',
    organization: 'NRI Institute of Technology',
    duration: '2024 – Present',
    responsibilities: ['Led AI-based certificate distribution system', 'Designed workflow automation engines', 'Conducted student performance analytics'],
    tools: ['Python', 'API Integrations', 'Data Analysis'],
    problem: 'Manual academic processes consuming excessive time',
    outcome: 'Reduced manual effort by 80% through automation',
  },
];

export const InternshipsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: internships } = usePortfolioData('internships', defaultInternships);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Experience</span>
        </p>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-border origin-top transition-transform duration-[1.5s] ease-out"
            style={{ transform: isVisible ? 'scaleY(1)' : 'scaleY(0)' }}
          />
          <div className="space-y-12">
            {internships.map((item: any, i: number) => {
              const isOpen = expanded === i;
              const fromLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative pl-12 sm:pl-14 transition-all duration-700 cursor-pointer ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${fromLeft ? '-translate-x-8' : 'translate-x-8'}`}`}
                  style={{ transitionDelay: `${400 + i * 200}ms` }}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  {/* Dot */}
                  <div className="absolute left-[7px] sm:left-[11px] top-2 w-[9px] h-[9px] rounded-full bg-foreground border-2 border-background z-10 transition-all duration-300 hover:scale-[2] hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />

                  <div className="relative p-5 -m-1 rounded-lg border border-transparent transition-all duration-300 hover:border-border hover:bg-accent/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">{item.role}</h3>
                      <span className="text-xs text-muted-foreground tracking-widest font-mono">{item.duration}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.organization}</p>

                    {/* Expandable content */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-out"
                      style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}
                    >
                      <div className="pt-5 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Problem</p>
                          <p className="text-sm text-foreground/80">{item.problem}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Responsibilities</p>
                          <ul className="space-y-1">
                            {(item.responsibilities || []).map((r: string, ri: number) => (
                              <li key={ri} className="text-sm text-foreground/80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-foreground mt-2 shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tools</p>
                          <div className="flex flex-wrap gap-2">
                            {(item.tools || []).map((t: string) => (
                              <span key={t} className="text-xs text-muted-foreground border-b border-border pb-0.5">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Outcome</p>
                          <p className="text-sm text-foreground/80">{item.outcome}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      {isOpen ? '▲ Collapse' : '▼ Expand details'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
