import { useScrollReveal } from '@/hooks/useScrollReveal';

const projects = [
  {
    num: '01',
    title: 'AI Certificate Distribution System',
    description: 'Automated certificate generation and distribution system with unique ID generation, QR verification, logging & error handling, admin failure notifications, and scalable participant processing.',
    tech: ['Python', 'Automation Framework', 'Email APIs'],
  },
  {
    num: '02',
    title: 'Workflow Automation Engine',
    description: 'Designed structured trigger-based workflows with conditional logic, API execution, failure recovery, and monitoring dashboard.',
    tech: ['n8n', 'API Integrations', 'JSON Logic'],
  },
  {
    num: '03',
    title: 'Student Performance Analytics',
    description: 'Built subject-wise performance analysis system calculating pass percentages and structured data insights across multiple sections.',
    tech: ['Python', 'Data Analysis', 'Statistical Computation'],
  },
];

export const ProjectsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p
          className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-16 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Selected Work
        </p>

        <div className="space-y-0">
          {projects.map((project, i) => (
            <div
              key={project.num}
              className={`group border-b border-border py-10 sm:py-14 transition-all duration-700 hover:bg-[hsl(0_0%_7%)] hover:px-6 cursor-default ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-12">
                <span className="text-xs text-muted-foreground tracking-widest font-mono shrink-0 pt-1">
                  {project.num}
                </span>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground mb-4 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl leading-[1.8] mb-5">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs text-muted-foreground border-b border-border pb-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
