import { useEffect, useRef } from "react";
import { MapPin, GraduationCap, Target } from "lucide-react";

export const About = () => {
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

  const highlights = [
    {
      icon: MapPin,
      label: "Location",
      value: "Andhra Pradesh, India"
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: "B.Tech 2023–2027"
    },
    {
      icon: Target,
      label: "Focus",
      value: "Data Science"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-4">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              About Me
            </span>
          </div>
          
          {/* Main statement */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-foreground leading-tight mb-8 text-center">
            Curious learner, steady builder.
          </h2>
          
          {/* Bio - Floating panel */}
          <div className="reveal reveal-delay-2 floating-panel border border-border/50 rounded-2xl p-8 md:p-10 mb-12">
            <div className="space-y-5 text-center max-w-2xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm Dasu Prabhukumar, a Computer Science undergraduate at NRI Institute of Technology. 
                I focus on understanding fundamentals deeply—data science, analytical thinking, 
                and practical problem-solving.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                I believe in clarity over complexity. Every project is an opportunity 
                to learn and contribute something meaningful.
              </p>
            </div>
          </div>
          
          {/* Highlights - Floating tiles */}
          <div className="grid md:grid-cols-3 gap-6 reveal reveal-delay-3">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-6 bg-card border border-border/50 rounded-2xl card-3d hover-glow text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
                  {item.label}
                </span>
                <span className="text-foreground font-semibold">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
