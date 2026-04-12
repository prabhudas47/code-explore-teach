import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { DocumentModal } from '@/components/DocumentModal';

const defaultInternships = [
  {
    role: 'AI / Data Science Intern',
    organization: 'Upcoming Opportunity',
    duration: 'Expected 2025',
    location: '',
    responsibilities: ['Building ML models for data analysis', 'Developing automation pipelines', 'Creating data visualization dashboards'],
    tools: ['Python', 'TensorFlow', 'n8n', 'SQL'],
    contributions: 'Actively preparing through academic projects and self-study',
    learned: 'Applied ML techniques, workflow automation patterns, data pipeline design',
    problem: 'Automating manual data processing workflows',
    outcome: 'Actively seeking impactful internship opportunities in AI & Data Science',
    offerLetterImg: '',
    completionCertImg: '',
  },
  {
    role: 'Academic Project Lead',
    organization: 'NRI Institute of Technology',
    duration: '2024 – Present',
    location: 'Vijayawada, India',
    responsibilities: ['Led AI-based certificate distribution system', 'Designed workflow automation engines', 'Conducted student performance analytics'],
    tools: ['Python', 'API Integrations', 'Data Analysis'],
    contributions: 'Designed and deployed end-to-end automation system for academic processes',
    learned: 'Project leadership, system architecture, stakeholder communication',
    problem: 'Manual academic processes consuming excessive time',
    outcome: 'Reduced manual effort by 80% through automation',
    offerLetterImg: '',
    completionCertImg: '',
  },
];

export const InternshipsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: internships } = usePortfolioData('internships', defaultInternships);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [docModal, setDocModal] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="experience" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Internships & Experience</span>
        </p>
        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-border origin-top transition-transform duration-[1.5s] ease-out"
            style={{ transform: isVisible ? 'scaleY(1)' : 'scaleY(0)' }}
          />
          <div className="space-y-12">
            {internships.map((item: any, i: number) => {
              const isOpen = expanded === i;
              const fromLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative pl-12 sm:pl-14 transition-all duration-700 cursor-pointer ${isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${fromLeft ? '-translate-x-8' : 'translate-x-8'}`}`}
                  style={{ transitionDelay: `${400 + i * 200}ms` }}
                  onClick={() => setExpanded(isOpen ? null : i)}
                >
                  {/* Dot */}
                  <div className="absolute left-[7px] sm:left-[11px] top-2 w-[9px] h-[9px] rounded-full bg-foreground border-2 border-background z-10 transition-all duration-300 hover:scale-[2] hover:shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />

                  <div className="relative p-5 -m-1 rounded-lg border border-transparent transition-all duration-300 hover:border-border hover:bg-accent/30">
                    {/* Header: left company, right details */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                      <div className="flex items-start gap-3">
                        {item.companyLogo && (
                          <img src={item.companyLogo} alt={item.organization} className="w-10 h-10 rounded object-contain shrink-0 border border-border bg-accent/20" loading="lazy" />
                        )}
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">{item.role}</h3>
                          <p className="text-sm text-muted-foreground">{item.organization}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs text-muted-foreground tracking-widest font-mono block">{item.duration}</span>
                        {item.location && <span className="text-xs text-muted-foreground/60">{item.location}</span>}
                      </div>
                    </div>

                    {/* Expandable content */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-out"
                      style={{ maxHeight: isOpen ? '600px' : '0', opacity: isOpen ? 1 : 0 }}
                    >
                      <div className="pt-5 space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Responsibilities</p>
                          <ul className="space-y-1">
                            {(item.responsibilities || []).map((r: string, ri: number) => (
                              <li key={ri} className="text-sm text-foreground/80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-foreground mt-2 shrink-0" />
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tools Used</p>
                          <div className="flex flex-wrap gap-2">
                            {(item.tools || []).map((t: string) => (
                              <span key={t} className="text-xs text-muted-foreground border-b border-border pb-0.5">{t}</span>
                            ))}
                          </div>
                        </div>
                        {item.contributions && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Key Contributions</p>
                            <p className="text-sm text-foreground/80">{item.contributions}</p>
                          </div>
                        )}
                        {item.learned && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">What I Learned</p>
                            <p className="text-sm text-foreground/80">{item.learned}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Outcome</p>
                          <p className="text-sm text-foreground/80">{item.outcome}</p>
                        </div>

                        {/* Work Screenshots */}
                        {item.workScreenshots?.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Work Screenshots</p>
                            <div className="flex gap-3 overflow-x-auto">
                              {item.workScreenshots.map((img: string, si: number) => (
                                <img key={si} src={img} alt={`Work screenshot ${si + 1}`} className="h-28 rounded border border-border object-cover cursor-pointer hover:opacity-80 transition-opacity" loading="lazy" onClick={(e) => { e.stopPropagation(); setDocModal({ src: img, title: `Work Screenshot ${si + 1}` }); }} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Internship Video */}
                        {item.internshipVideo && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Video</p>
                            <video src={item.internshipVideo} controls muted className="w-full max-w-md rounded border border-border" onClick={e => e.stopPropagation()} />
                          </div>
                        )}

                        {/* Document buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                          {item.offerLetterImg && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setDocModal({ src: item.offerLetterImg, title: 'Offer Letter' }); }}
                              className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                            >
                              View Offer Letter
                            </button>
                          )}
                          {item.completionCertImg && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setDocModal({ src: item.completionCertImg, title: 'Completion Certificate' }); }}
                              className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                            >
                              View Completion Certificate
                            </button>
                          )}
                          {!item.offerLetterImg && !item.completionCertImg && (
                            <span className="text-xs text-muted-foreground/40">Documents will be available soon</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      {isOpen ? '▲ Collapse' : '▼ Expand details'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <DocumentModal
        open={!!docModal}
        onClose={() => setDocModal(null)}
        imageSrc={docModal?.src || ''}
        title={docModal?.title || ''}
      />
    </section>
  );
};
