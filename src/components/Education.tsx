import { useEffect, useRef } from "react";
import { GraduationCap, BookOpen, School } from "lucide-react";

export const Education = () => {
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

  const education = [
    {
      icon: GraduationCap,
      period: "2023 – 2027",
      degree: "B.Tech in Computer Science",
      institution: "NRI Institute of Technology",
      status: "In Progress",
      description: "Core focus on programming fundamentals, data structures, algorithms, and data science."
    },
    {
      icon: BookOpen,
      period: "2020 – 2022",
      degree: "Intermediate (MPC)",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      status: "Completed",
      description: "Mathematics, Physics, Chemistry—building analytical foundations."
    },
    {
      icon: School,
      period: "2020",
      degree: "Secondary School Certificate",
      institution: "Vamsi High School, Vundavalli",
      status: "Completed",
      description: "Strong foundation in mathematics and sciences."
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative">
      {/* Ambient glow */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-4">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Education
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-foreground leading-tight mb-16 text-center">
            Strong foundations, steady growth.
          </h2>
          
          {/* Education Cards - Floating timeline */}
          <div className="space-y-6">
            {education.map((item, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${index + 1} group`}
              >
                <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 card-3d hover-glow">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Icon */}
                    <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.degree}
                        </h3>
                        <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full w-fit">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-muted-foreground font-medium mb-2">
                        {item.institution}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                      <span className="text-xs text-muted-foreground/70 font-medium">
                        {item.period}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
