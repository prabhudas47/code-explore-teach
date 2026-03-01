import { useScrollReveal } from '@/hooks/useScrollReveal';

const certCategories = [
  { title: 'AI & Data Science Courses', icon: '🧠' },
  { title: 'Automation Tools Learning', icon: '⚡' },
  { title: 'Technical Workshops', icon: '🔧' },
  { title: 'Hackathons Participation', icon: '🏆' },
];

export const CertificationsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Certifications & <span className="text-gradient">Learning</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {certCategories.map((cat, i) => (
            <div
              key={cat.title}
              className={`glass-card rounded-xl p-6 text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + i * 120}ms` }}
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="text-sm font-semibold text-foreground">{cat.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
