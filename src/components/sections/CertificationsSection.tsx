import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { DocumentModal } from '@/components/DocumentModal';

const defaultCerts = [
  { title: 'AI & Data Science Fundamentals', platform: 'Coursera', date: '2024', link: '', description: 'Comprehensive introduction to AI concepts, neural networks, and data science workflows.', skillsLearned: 'Neural Networks, Data Preprocessing, Model Evaluation', relevance: 'Foundation for building AI-powered automation systems.', certificateImg: '' },
  { title: 'Python for Data Analysis', platform: 'Udemy', date: '2024', link: '', description: 'Deep dive into Python libraries for data manipulation and visualization.', skillsLearned: 'Pandas, NumPy, Matplotlib, Data Cleaning', relevance: 'Core skills used in every data analysis project.', certificateImg: '' },
  { title: 'Automation with n8n', platform: 'n8n Academy', date: '2024', link: '', description: 'Workflow automation design using n8n platform for business process optimization.', skillsLearned: 'Workflow Design, API Integration, Trigger Systems', relevance: 'Directly applied in academic automation projects.', certificateImg: '' },
  { title: 'Machine Learning Basics', platform: 'Google', date: '2025', link: '', description: 'Google\'s introductory course covering supervised and unsupervised learning techniques.', skillsLearned: 'Classification, Regression, Clustering, Feature Engineering', relevance: 'Applied in student performance prediction models.', certificateImg: '' },
];

export const CertificationsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data: certs } = usePortfolioData('certifications', defaultCerts);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [docModal, setDocModal] = useState<{ src: string; title: string } | null>(null);

  return (
    <section id="certifications" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Certifications</span>
        </p>
        <div className="space-y-0">
          {certs.map((cert: any, i: number) => {
            const isOpen = expanded === i;
            return (
              <div
                key={i}
                className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                {/* Row */}
                <div
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className={`flex items-center justify-between py-5 px-4 border-b cursor-pointer transition-all duration-300 hover:bg-accent/20 ${isOpen ? 'border-foreground/20' : 'border-border'} ${expanded !== null && expanded !== i ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-foreground tracking-tight truncate">{cert.title}</h3>
                  </div>
                  <div className="flex items-center gap-6 shrink-0 ml-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">{cert.platform}</span>
                    <span className="text-xs text-muted-foreground font-mono">{cert.date}</span>
                    <span className="text-xs text-muted-foreground">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Expanded detail */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-out"
                  style={{ maxHeight: isOpen ? '400px' : '0', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="py-5 px-4 space-y-3 bg-accent/10 border-b border-border">
                    <div className="sm:hidden mb-2">
                      <span className="text-sm text-muted-foreground">{cert.platform}</span>
                    </div>
                    {cert.description && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Description</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{cert.description}</p>
                      </div>
                    )}
                    {cert.skillsLearned && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Skills Learned</p>
                        <p className="text-sm text-foreground/80">{cert.skillsLearned}</p>
                      </div>
                    )}
                    {cert.relevance && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Relevance to AI / Data Science</p>
                        <p className="text-sm text-foreground/80">{cert.relevance}</p>
                      </div>
                    )}
                    <div className="flex gap-3 pt-2">
                      {cert.certificateImg && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setDocModal({ src: cert.certificateImg, title: cert.title }); }}
                          className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                        >
                          View Full Certificate
                        </button>
                      )}
                      {cert.link && (
                        <a
                          href={cert.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs border border-border rounded px-4 py-2 text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Verify →
                        </a>
                      )}
                      {!cert.certificateImg && !cert.link && (
                        <span className="text-xs text-muted-foreground/40">Certificate preview coming soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
