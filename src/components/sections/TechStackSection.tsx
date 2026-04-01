import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultTechStack = [
  { category: 'Programming', items: ['Python', 'SQL'] },
  { category: 'AI / Data', items: ['Machine Learning', 'Data Analysis'] },
  { category: 'Automation', items: ['n8n', 'APIs', 'Workflow Systems'] },
  { category: 'Tools', items: ['GitHub', 'VS Code', 'Jupyter'] },
];

export const TechStackSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: stack } = usePortfolioData('tech_stack', defaultTechStack);

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
                {(group.items || []).map((item: string, ii: number) => (
                  <div
                    key={ii}
                    className="group relative py-3 px-4 border border-border rounded-lg text-sm text-foreground transition-all duration-300 hover:scale-[1.03] hover:border-foreground/30 hover:shadow-[0_0_20px_hsl(var(--foreground)/0.05)] cursor-default"
                  >
                    {item}
                    <span className="absolute inset-0 rounded-lg bg-foreground/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
