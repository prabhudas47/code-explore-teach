import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultCaseStudies = [
  {
    name: 'AI Certificate Distribution System',
    problem: 'Manual certificate generation for large participant groups was error-prone and time-consuming.',
    approach: 'Built an automated pipeline with unique ID generation, QR verification, and batch email delivery with failure recovery.',
    technologies: ['Python', 'Email APIs', 'QR Generation', 'Automation Framework'],
    features: ['Unique certificate IDs', 'QR code verification', 'Admin failure notifications', 'Scalable batch processing'],
    outcome: 'Reduced certificate distribution time from days to minutes with zero manual errors.',
  },
  {
    name: 'Workflow Automation Engine',
    problem: 'Repetitive business processes needed a structured, trigger-based automation system.',
    approach: 'Designed conditional logic workflows with API execution, failure recovery mechanisms, and real-time monitoring.',
    technologies: ['n8n', 'API Integrations', 'JSON Logic', 'Webhooks'],
    features: ['Trigger-based execution', 'Conditional branching', 'Error recovery', 'Monitoring dashboard'],
    outcome: 'Created reusable workflow templates reducing setup time for new automations by 70%.',
  },
  {
    name: 'Student Performance Analytics',
    problem: 'Lack of structured insights into subject-wise student performance across sections.',
    approach: 'Built a data analysis system calculating pass percentages, identifying weak areas, and generating structured reports.',
    technologies: ['Python', 'Pandas', 'Statistical Computation', 'Data Visualization'],
    features: ['Subject-wise analysis', 'Section comparison', 'Trend identification', 'Automated reporting'],
    outcome: 'Enabled data-driven academic decisions with clear performance visibility.',
  },
];

export const CaseStudiesSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: studies } = usePortfolioData('case_studies', defaultCaseStudies);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="case-studies" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Project Case Studies</span>
        </p>
        <div className="space-y-6">
          {studies.map((study: any, i: number) => {
            const isOpen = expanded === i;
            return (
              <div
                key={i}
                className={`group border border-border rounded-lg transition-all duration-700 cursor-pointer hover:border-foreground/20 hover:shadow-[0_0_30px_hsl(var(--foreground)/0.03)] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground tracking-widest font-mono">CASE {String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-xl sm:text-2xl font-semibold text-foreground mt-2 tracking-tight">{study.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{study.problem}</p>
                    </div>
                    <span className="text-muted-foreground text-lg transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                  </div>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{ maxHeight: isOpen ? '600px' : '0', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border mt-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Approach</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{study.approach}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Key Features</p>
                        <ul className="space-y-1.5">
                          {(study.features || []).map((f: string, fi: number) => (
                            <li key={fi} className="text-sm text-foreground/80 flex items-start gap-2">
                              <span className="w-1 h-1 rounded-full bg-foreground mt-2 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Technologies</p>
                        <div className="flex flex-wrap gap-2">
                          {(study.technologies || []).map((t: string) => (
                            <span key={t} className="text-xs px-3 py-1 border border-border rounded-full text-muted-foreground">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Outcome</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{study.outcome}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
