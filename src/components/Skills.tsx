import { useEffect, useRef } from "react";
import { Database, Brain, Languages, LineChart } from "lucide-react";

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
      icon: Database,
      title: "Data Science",
      description: "Analysis, visualization, and extracting insights from complex datasets."
    },
    {
      icon: Brain,
      title: "Problem Solving",
      description: "Systematic approach to breaking down and solving challenges."
    },
    {
      icon: Languages,
      title: "Language Tools",
      description: "Building tools for linguistic analysis and communication."
    },
    {
      icon: LineChart,
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
    "SQL",
    "Streamlit"
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative">
      {/* Ambient glow */}
      <div className="absolute left-0 top-1/3 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-4">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Skills & Focus
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-foreground leading-tight mb-16 text-center">
            Areas I'm passionate about.
          </h2>
          
          {/* Focus Areas Grid - Equal tiles */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {focusAreas.map((area, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${index + 1} p-6 bg-card border border-border/50 rounded-2xl card-3d hover-glow`}
              >
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-4">
                  <area.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {area.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Technologies */}
          <div className="reveal reveal-delay-4 text-center">
            <span className="text-sm text-muted-foreground font-medium block mb-6">
              Technologies & Tools
            </span>
            <div className="flex flex-wrap gap-3 justify-center">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border/50 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
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
