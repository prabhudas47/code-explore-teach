import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultAchievements = [
  { text: 'Presented technical paper on AI systems at university-level event' },
  { text: 'Participated in inter-college technical fest competitions' },
  { text: 'Completed multiple AI and automation learning programs' },
  { text: 'Engaged in hackathons focused on building AI-powered solutions' },
  { text: 'Attended workshops on Machine Learning, Python, and Data Analysis' },
];

export const AchievementsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: achievements } = usePortfolioData('achievements', defaultAchievements);

  return (
    <section id="achievements" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Achievements</span>
        </p>
        <div className="space-y-0">
          {achievements.map((item: any, i: number) => {
            const text = typeof item === 'string' ? item : (item.text || item.description || item.title || '');
            return (
              <div
                key={i}
                className={`flex items-start gap-4 py-4 transition-all duration-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                <div className="w-px h-5 bg-foreground/30 shrink-0 mt-0.5" />
                <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
