import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { DocumentModal } from '@/components/DocumentModal';

const defaultProjects = [
  { num: '01', title: 'AI Certificate Distribution System', description: 'Automated certificate generation and distribution system with unique ID generation, QR verification, logging & error handling, admin failure notifications, and scalable participant processing.', tech: ['Python', 'Automation Framework', 'Email APIs'], problem: '', approach: '', features: [], githubLink: '', liveLink: '', images: [], demoVideo: '' },
  { num: '02', title: 'Workflow Automation Engine', description: 'Designed structured trigger-based workflows with conditional logic, API execution, failure recovery, and monitoring dashboard.', tech: ['n8n', 'API Integrations', 'JSON Logic'], problem: '', approach: '', features: [], githubLink: '', liveLink: '', images: [], demoVideo: '' },
  { num: '03', title: 'Student Performance Analytics', description: 'Built subject-wise performance analysis system calculating pass percentages and structured data insights across multiple sections.', tech: ['Python', 'Data Analysis', 'Statistical Computation'], problem: '', approach: '', features: [], githubLink: '', liveLink: '', images: [], demoVideo: '' },
];

export const ProjectsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: projects } = usePortfolioData('projects', defaultProjects);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [docModal, setDocModal] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Selected Work</span>
        </p>
        <div className="space-y-0">
          {projects.map((project: any, i: number) => {
            const isOpen = expanded === i;
            const hasDetails = project.problem || project.approach || (project.features?.length > 0) || (project.images?.length > 0) || project.demoVideo;
            return (
              <div
                key={i}
                className={`group border-b border-border py-10 sm:py-14 transition-all duration-700 ${hasDetails ? 'cursor-pointer' : 'cursor-default'} hover:bg-[hsl(0_0%_7%)] hover:px-6 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
                onClick={() => hasDetails && setExpanded(isOpen ? null : i)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12">
                  <span className="text-xs text-muted-foreground tracking-widest font-mono shrink-0 pt-1">{project.num}</span>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-4 tracking-tight">{project.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-2xl leading-[1.8] mb-5">{project.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {(project.tech || []).map((t: string) => (
                        <span key={t} className="text-xs text-muted-foreground border-b border-border pb-0.5">{t}</span>
                      ))}
                    </div>

                    {/* Expanded details */}
                    <div className="overflow-hidden transition-all duration-500 ease-out" style={{ maxHeight: isOpen ? '800px' : '0', opacity: isOpen ? 1 : 0 }}>
                      <div className="pt-6 space-y-4">
                        {project.problem && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Problem</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{project.problem}</p>
                          </div>
                        )}
                        {project.approach && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Approach</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{project.approach}</p>
                          </div>
                        )}
                        {project.features?.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Features</p>
                            <ul className="space-y-1">
                              {project.features.map((f: string, fi: number) => (
                                <li key={fi} className="text-sm text-foreground/80 flex items-start gap-2">
                                  <span className="w-1 h-1 rounded-full bg-foreground mt-2 shrink-0" />
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {project.images?.length > 0 && (
                          <div className="flex gap-3 overflow-x-auto pt-2">
                            {project.images.map((img: string, ii: number) => (
                              <img key={ii} src={img} alt={`${project.title} screenshot ${ii + 1}`} className="h-32 rounded border border-border object-cover" loading="lazy" onError={e => (e.currentTarget.style.display = 'none')} />
                            ))}
                          </div>
                        )}
                        {project.demoVideo && (
                          <video src={project.demoVideo} controls className="w-full max-w-md rounded border border-border mt-2" />
                        )}
                        <div className="flex gap-3 pt-2">
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300">GitHub</a>
                          )}
                          {project.liveLink && (
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300">Live Demo</a>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasDetails && (
                      <div className="mt-3 text-xs text-muted-foreground">{isOpen ? '▲ Collapse' : '▼ Expand details'}</div>
                    )}
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
