import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultAchievements = [
  { title: 'Technical Fest Participation', icon: '🏅', description: 'Participated in inter-college technical events and coding competitions.' },
  { title: 'Paper Presentations', icon: '📄', description: 'Presented research papers on AI and automation topics.' },
  { title: 'Workshops Attended', icon: '🔧', description: 'Completed workshops on Machine Learning, Python, and Data Analysis.' },
  { title: 'Hackathon Participation', icon: '🏆', description: 'Engaged in hackathons focused on building AI-powered solutions.' },
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {achievements.map((item: any, i: number) => (
            <div
              key={i}
              className={`group relative border border-border rounded-lg p-6 transition-all duration-700 cursor-default hover:border-foreground/20 hover:bg-accent/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + i * 120}ms` }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                <div>
                  <h3 className="text-base font-semibold text-foreground tracking-tight">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
