import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultLearning = [
  { year: '2023', milestone: 'Started Python & Data Science fundamentals' },
  { year: '2024', milestone: 'Built automation workflows and AI-based academic tools' },
  { year: '2025', milestone: 'Developing scalable AI systems and advanced data models' },
];

export const LearningTimelineSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: milestones } = usePortfolioData('learning_timeline', defaultLearning);

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Learning Journey</span>
        </p>
        <div className="relative">
          {/* Horizontal timeline line */}
          <div
            className="absolute top-4 left-0 right-0 h-px bg-border origin-left transition-transform duration-[2s] ease-out"
            style={{ transform: isVisible ? 'scaleX(1)' : 'scaleX(0)' }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {milestones.map((item: any, i: number) => (
              <div
                key={i}
                className={`relative pt-10 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${600 + i * 300}ms` }}
              >
                {/* Pulse dot */}
                <div className="absolute top-0 left-0">
                  <div className="w-[9px] h-[9px] rounded-full bg-foreground relative">
                    <span
                      className="absolute inset-0 rounded-full bg-foreground/40 animate-ping"
                      style={{ animationDuration: '2.5s', animationDelay: `${i * 400}ms` }}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-foreground tracking-tight">{item.year}</span>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
