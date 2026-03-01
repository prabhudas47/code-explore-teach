import { useScrollReveal } from '@/hooks/useScrollReveal';

const skillGroups = [
  {
    category: 'Programming',
    skills: ['Python', 'SQL', 'Data Structures (Foundations)'],
  },
  {
    category: 'Data Science',
    skills: ['Data Analysis', 'Machine Learning', 'Statistics & Probability'],
  },
  {
    category: 'Automation & Tools',
    skills: ['n8n Workflow Automation', 'Git & GitHub', 'API Integration', 'Data Visualization'],
  },
  {
    category: 'Professional',
    skills: ['Presentation & Communication', 'Strategic Thinking', 'Technical Documentation'],
  },
];

export const SkillsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="skills" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Technical <span className="text-gradient">Skills</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {skillGroups.map((group, gi) => (
            <div
              key={group.category}
              className={`glass-card rounded-xl p-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + gi * 150}ms` }}
            >
              <h3 className="text-sm font-semibold text-primary tracking-widest uppercase mb-5">{group.category}</h3>
              <div className="space-y-3">
                {group.skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_hsl(185_90%_55%/0.5)] transition-all duration-300" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">{skill}</span>
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
