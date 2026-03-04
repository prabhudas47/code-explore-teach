import { useScrollReveal } from '@/hooks/useScrollReveal';

const leftSkills = ['Python', 'SQL', 'Data Structures', 'Machine Learning Foundations'];
const rightSkills = ['n8n Automation', 'API Integrations', 'Data Analysis', 'Technical Documentation'];

export const SkillsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p
          className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-display text-base">Capabilities</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-0">
          {[leftSkills, rightSkills].map((col, ci) => (
            <div key={ci} className="space-y-0">
              {col.map((skill, si) => (
                <div
                  key={skill}
                  className={`group border-b border-border py-6 transition-all duration-600 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${200 + (ci * 4 + si) * 100}ms` }}
                >
                  <span className="text-base sm:text-lg text-foreground font-medium tracking-tight relative inline-block">
                    {skill}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-foreground transition-all duration-500 group-hover:w-full" />
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
