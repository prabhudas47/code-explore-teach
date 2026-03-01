import { useScrollReveal } from '@/hooks/useScrollReveal';

const projects = [
  {
    title: 'AI Certificate Distribution System',
    description: 'Automated certificate generation and email distribution system with unique Certificate ID generation, QR-based verification, logging & error handling, admin notifications, and scalable participant database processing.',
    tech: ['Python', 'Automation Framework', 'Email APIs'],
  },
  {
    title: 'Workflow Automation Engine',
    description: 'Designed automated workflows for data validation, trigger-based execution, conditional branching, failure recovery logic, and monitoring dashboard.',
    tech: ['n8n', 'API Integrations', 'Structured JSON Logic'],
  },
  {
    title: 'Student Performance Analytics',
    description: 'Built data analysis model to calculate subject-wise pass percentages across multiple sections. Generated insights using structured data pipelines and visualization logic.',
    tech: ['Python', 'Data Analysis', 'Statistical Computation'],
  },
  {
    title: 'AI-Based Smart Data Assistant',
    description: 'Concept AI agent capable of data summarization, automated reporting, workflow triggering, and insight extraction from structured datasets.',
    tech: ['AI Agents', 'Data Pipelines', 'NLP'],
  },
];

export const ProjectsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="projects" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6" ref={ref}>
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-14 text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Featured <span className="text-gradient">Projects</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`glass-card rounded-xl p-6 sm:p-8 group transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {project.tech.map((t) => (
                  <span key={t} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary/80 border border-primary/10">
                    {t}
                  </span>
                ))}
              </div>
              <button className="text-xs text-primary/60 hover:text-primary transition-colors tracking-wide uppercase">
                View Case Study →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
