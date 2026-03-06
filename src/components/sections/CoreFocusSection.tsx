import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultFocuses = [
  { num: '01', title: 'Artificial Intelligence', desc: 'Designing intelligent systems using machine learning principles and automation logic.' },
  { num: '02', title: 'Data Science', desc: 'Data analysis, structured computation, and statistical problem solving.' },
  { num: '03', title: 'Automation Systems', desc: 'Building workflow-based solutions using tools like n8n and API integrations.' },
];

export const CoreFocusSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: focuses } = usePortfolioData('core_focus', defaultFocuses);

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Core Focus</span>
        </p>
        <div className="space-y-0">
          {focuses.map((item: any, i: number) => (
            <div key={i} className={`group border-b border-border py-10 sm:py-14 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12 transition-all duration-700 cursor-default ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${200 + i * 150}ms` }}>
              <span className="text-xs text-muted-foreground tracking-widest font-mono shrink-0 pt-1">{item.num}</span>
              <div className="transition-transform duration-500 group-hover:translate-x-3">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
