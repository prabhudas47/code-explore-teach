import { useEffect, useRef, useState } from 'react';

const skills = [
  { name: 'Data Science', icon: '📊' },
  { name: 'Linguistic Toolbox', icon: '🔤' },
  { name: 'Telugu Language Processing', icon: '🌐' },
  { name: 'Computer Science Fundamentals', icon: '💻' },
];

export const PortfolioSkills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="py-32 px-6 relative content-layer">
      <div className="max-w-3xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Expertise</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {skills.map((skill, i) => (
            <div
              key={i}
              className={`glass-card rounded-xl p-8 text-center cursor-default transition-all duration-700 hover:border-foreground/20 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${300 + i * 150}ms`,
                boxShadow: hoveredIndex === i
                  ? '0 0 40px hsl(0 0% 100% / 0.06), inset 0 0 30px hsl(0 0% 100% / 0.02)'
                  : 'none',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="text-3xl mb-4">{skill.icon}</div>
              <h3 className="text-foreground font-semibold text-base">{skill.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
