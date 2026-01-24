import { GraduationCap, BookOpen, School, ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SpatialCard } from "@/components/ui/spatial-card";

export const Education = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  const education = [
    {
      icon: GraduationCap,
      period: "2023 – 2027",
      degree: "B.Tech in Computer Science",
      institution: "NRI Institute of Technology",
      status: "In Progress",
      description: "Core focus on programming fundamentals, data structures, algorithms, and data science.",
      highlight: true
    },
    {
      icon: BookOpen,
      period: "2020 – 2022",
      degree: "Intermediate (MPC)",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      status: "Completed",
      description: "Mathematics, Physics, Chemistry—building analytical foundations.",
      highlight: false
    },
    {
      icon: School,
      period: "2020",
      degree: "Secondary School Certificate",
      institution: "Vamsi High School, Vundavalli",
      status: "Completed",
      description: "Strong foundation in mathematics and sciences.",
      highlight: false
    }
  ];

  return (
    <section ref={sectionRef} className="py-28 md:py-40 relative">
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[180px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary tracking-[0.2em] uppercase bg-primary/8 border border-primary/15 rounded-full">
              Education
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-16 text-center">
            Strong foundations,{" "}
            <span className="text-gradient">steady growth.</span>
          </h2>
          
          {/* Education Cards - Timeline */}
          <div className="space-y-8">
            {education.map((item, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${index + 1}`}
              >
                <SpatialCard
                  className={`p-8 md:p-10 ${item.highlight ? 'border-primary/30' : ''}`}
                  depth={item.highlight ? "deep" : "medium"}
                  glowColor={item.highlight ? "primary" : "accent"}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${item.highlight ? 'bg-gradient-to-br from-primary/20 to-primary/5' : 'bg-primary/10'} border border-primary/20 rounded-2xl flex items-center justify-center shrink-0`}>
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                        <h3 className="text-2xl font-bold text-foreground">
                          {item.degree}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full w-fit ${item.highlight ? 'text-primary bg-primary/15 border border-primary/25' : 'text-muted-foreground bg-muted/50 border border-border/50'}`}>
                          {item.highlight && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                          {item.status}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground font-medium text-lg mb-3 flex items-center gap-2">
                        {item.institution}
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground/70">{item.period}</span>
                      </p>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </SpatialCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
