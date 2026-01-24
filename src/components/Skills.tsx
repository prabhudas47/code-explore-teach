import { Database, Brain, Languages, LineChart, Code2, Layers } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SpatialCard } from "@/components/ui/spatial-card";

export const Skills = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

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
    { name: "Python", icon: Code2 },
    { name: "Data Analysis", icon: Database },
    { name: "Tableau", icon: Layers },
    { name: "Machine Learning", icon: Brain },
    { name: "Git", icon: Code2 },
    { name: "SQL", icon: Database },
    { name: "Streamlit", icon: Layers }
  ];

  return (
    <section ref={sectionRef} className="py-28 md:py-40 relative">
      {/* Ambient glows */}
      <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute right-0 bottom-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary tracking-[0.2em] uppercase bg-primary/8 border border-primary/15 rounded-full">
              Skills & Focus
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-16 text-center">
            Areas I'm{" "}
            <span className="text-gradient">passionate about.</span>
          </h2>
          
          {/* Focus Areas Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {focusAreas.map((area, index) => (
              <SpatialCard
                key={index}
                className={`reveal reveal-delay-${index + 1} p-8`}
                depth="medium"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                    <area.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </div>
              </SpatialCard>
            ))}
          </div>
          
          {/* Technologies */}
          <div className="reveal reveal-delay-4 text-center">
            <span className="text-sm text-muted-foreground font-semibold tracking-wider block mb-8">
              TECHNOLOGIES & TOOLS
            </span>
            <div className="flex flex-wrap gap-4 justify-center">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground bg-card border border-border/50 rounded-full hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.1)]"
                >
                  <tech.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
