import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultBuilding = [
  { title: 'AI Agent Systems', progress: 40, description: 'Exploring autonomous agent architectures for task automation.' },
  { title: 'Workflow Automation Platforms', progress: 65, description: 'Building scalable automation pipelines with advanced trigger logic.' },
  { title: 'Data Visualization Dashboards', progress: 30, description: 'Creating interactive dashboards for real-time data insights.' },
];

export const CurrentlyBuildingSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: projects } = usePortfolioData('currently_building', defaultBuilding);

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Currently Building</span>
        </p>
        <div className="space-y-8">
          {projects.map((item: any, i: number) => (
            <div
              key={i}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${200 + i * 200}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">{item.title}</h3>
                <span className="text-xs text-muted-foreground font-mono">{item.progress}%</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
              <div className="relative h-1 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-foreground rounded-full transition-all duration-[1.5s] ease-out"
                  style={{ width: isVisible ? `${item.progress}%` : '0%', transitionDelay: `${400 + i * 200}ms` }}
                />
                {/* Pulse indicator at the end */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-foreground shadow-[0_0_8px_hsl(var(--foreground)/0.4)] transition-all duration-[1.5s] ease-out"
                  style={{ left: isVisible ? `calc(${item.progress}% - 4px)` : '0%', transitionDelay: `${400 + i * 200}ms` }}
                >
                  <span className="absolute inset-0 rounded-full bg-foreground/40 animate-ping" style={{ animationDuration: '2s' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
