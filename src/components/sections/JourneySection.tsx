import { useScrollReveal } from '@/hooks/useScrollReveal';

const timeline = [
  {
    period: '2023 – Present',
    title: 'B.Tech Computer Science (Data Science)',
    institution: 'NRI Institute of Technology',
    focus: ['Artificial Intelligence', 'Data Science Fundamentals', 'Automation Systems'],
  },
  {
    period: '2021 – 2023',
    title: 'Intermediate (MPC)',
    institution: 'Sri Chaitanya Junior College',
    focus: ['Mathematics', 'Physics', 'Computer Science Foundations'],
  },
  {
    period: '2010 – 2021',
    title: 'Secondary Education',
    institution: 'Vamsi High School',
    focus: ['Academic Foundations', 'Early Tech Interest'],
  },
];

export const JourneySection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="journey" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Learning <span className="text-gradient">Journey</span>
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent" />

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <div
                key={item.period}
                className={`relative pl-12 sm:pl-16 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${300 + i * 200}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-2.5 sm:left-4.5 top-1 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(185_90%_55%/0.5)]" />

                <span className="text-xs text-primary tracking-widest uppercase">{item.period}</span>
                <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.institution}</p>
                <div className="flex flex-wrap gap-2">
                  {item.focus.map((f) => (
                    <span key={f} className="px-3 py-1 text-xs rounded-full bg-primary/5 text-muted-foreground border border-border">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
