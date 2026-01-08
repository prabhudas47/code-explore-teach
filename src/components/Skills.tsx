import { useEffect, useRef } from "react";

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => {
              el.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const focusAreas = [
    {
      title: "Data Science",
      description: "Analysis, visualization, and extracting insights from data."
    },
    {
      title: "Problem Solving",
      description: "Systematic approach to breaking down complex challenges."
    },
    {
      title: "Language Tools",
      description: "Building tools for linguistic analysis and communication."
    },
    {
      title: "Machine Learning",
      description: "Understanding patterns and building predictive models."
    }
  ];

  const technologies = [
    "Python",
    "Data Analysis",
    "Tableau",
    "Machine Learning",
    "Git",
    "SQL"
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl">
          {/* Section label */}
          <div className="reveal">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-6 block">
              Skills & Focus
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-16">
            Areas of focus.
          </h2>
          
          {/* Focus Areas - Equal Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${index + 1} p-8 bg-background border border-border rounded-sm hover-lift hover-glow`}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {area.title}
                </h3>
                <p className="text-muted-foreground">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Technologies */}
          <div className="reveal reveal-delay-4 pt-12 border-t border-border">
            <span className="text-sm text-muted-foreground font-medium block mb-6">
              Technologies & Tools
            </span>
            <div className="flex flex-wrap gap-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-secondary border border-border rounded-sm hover:border-primary/30 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
