import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultCerts = [
  { title: 'AI & Data Science Fundamentals', platform: 'Coursera', date: '2024', link: '' },
  { title: 'Python for Data Analysis', platform: 'Udemy', date: '2024', link: '' },
  { title: 'Automation with n8n', platform: 'n8n Academy', date: '2024', link: '' },
  { title: 'Machine Learning Basics', platform: 'Google', date: '2025', link: '' },
];

export const CertificationsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: certs } = usePortfolioData('certifications', defaultCerts);

  return (
    <section id="certifications" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Certifications</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {certs.map((cert: any, i: number) => (
            <div
              key={i}
              className={`group border border-border rounded-lg p-6 transition-all duration-700 cursor-default hover:border-foreground/20 hover:bg-accent/30 hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(var(--foreground)/0.04)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${200 + i * 120}ms`, transformStyle: 'preserve-3d' }}
            >
              <h3 className="text-base font-semibold text-foreground tracking-tight mb-2">{cert.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{cert.platform}</span>
                <span className="text-xs text-muted-foreground font-mono">{cert.date}</span>
              </div>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs text-muted-foreground border-b border-border pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Verify →
                </a>
              )}
              {!cert.link && (
                <span className="inline-block mt-3 text-xs text-muted-foreground/50">Verify coming soon</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
