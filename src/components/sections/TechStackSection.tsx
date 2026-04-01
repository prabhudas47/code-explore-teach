import { useState, useRef, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultTechStack = [
  {
    category: 'Programming',
    items: [
      { name: 'Python', context: 'Used across all AI/ML projects, automation scripts, and data analysis pipelines.' },
      { name: 'SQL', context: 'Database querying for analytics dashboards and student performance systems.' },
    ],
  },
  {
    category: 'Data Science',
    items: [
      { name: 'Data Analysis', context: 'Exploratory data analysis and statistical modeling for academic research.' },
      { name: 'Machine Learning', context: 'Built classification and prediction models for certificate distribution and performance analytics.' },
      { name: 'Statistics', context: 'Applied statistical methods for data-driven decision making in projects.' },
    ],
  },
  {
    category: 'Automation',
    items: [
      { name: 'n8n', context: 'Designed workflow automation engines for academic certificate distribution.' },
      { name: 'API Integration', context: 'Connected multiple services through RESTful APIs for seamless data flow.' },
      { name: 'Workflow Design', context: 'Architected end-to-end automation pipelines reducing manual effort by 80%.' },
    ],
  },
  {
    category: 'Tools',
    items: [
      { name: 'Git', context: 'Version control for all development projects and collaborative work.' },
      { name: 'GitHub', context: 'Repository management, CI/CD pipelines, and open-source contributions.' },
      { name: 'VS Code', context: 'Primary IDE for Python development, debugging, and extension-driven workflows.' },
      { name: 'Jupyter', context: 'Interactive notebooks for data exploration, visualization, and ML experiments.' },
    ],
  },
];

export const TechStackSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: stack } = usePortfolioData('tech_stack', defaultTechStack);
  const [activeSkill, setActiveSkill] = useState<{ gi: number; ii: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSkill) return;
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActiveSkill(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [activeSkill]);

  const getItem = (group: any, ii: number) => {
    const items = group.items || [];
    const item = items[ii];
    if (typeof item === 'string') return { name: item, context: '' };
    return item || { name: '', context: '' };
  };

  return (
    <section id="tech-stack" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Technology Stack</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stack.map((group: any, gi: number) => (
            <div
              key={gi}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + gi * 150}ms` }}
            >
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-mono">{group.category}</h3>
              <div className="space-y-3">
                {(group.items || []).map((_: any, ii: number) => {
                  const item = getItem(group, ii);
                  const isActive = activeSkill?.gi === gi && activeSkill?.ii === ii;
                  return (
                    <div key={ii} className="relative">
                      <div
                        onClick={() => setActiveSkill(isActive ? null : { gi, ii })}
                        className={`group relative py-3 px-4 border rounded-lg text-sm text-foreground cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:border-foreground/30 hover:shadow-[0_0_20px_hsl(var(--foreground)/0.05)] ${isActive ? 'border-foreground/40 bg-accent/40' : 'border-border'}`}
                        style={{ transitionDelay: `${gi * 100 + ii * 60}ms` }}
                      >
                        <span className="relative inline-block">
                          {item.name}
                          <span className="absolute bottom-0 left-0 h-px bg-foreground/60 transition-all duration-300 w-0 group-hover:w-full" />
                        </span>
                        <span className="absolute inset-0 rounded-lg bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Floating info panel */}
                      {isActive && item.context && (
                        <div
                          ref={panelRef}
                          className="absolute z-30 left-0 right-0 mt-2 p-4 rounded-lg border border-border bg-card shadow-xl animate-[scaleUp_0.25s_ease-out]"
                        >
                          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Where it's used</p>
                          <p className="text-sm text-foreground/80 leading-relaxed">{item.context}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
};
