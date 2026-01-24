import { MapPin, GraduationCap, Target } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SpatialCard, FloatingPanel } from "@/components/ui/spatial-card";

export const About = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

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
    <section ref={sectionRef} className="py-28 md:py-40 relative">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="reveal text-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary tracking-[0.2em] uppercase bg-primary/8 border border-primary/15 rounded-full">
              About Me
            </span>
          </div>
          
          {/* Main statement */}
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-12 text-center">
            Curious learner,{" "}
            <span className="text-gradient">steady builder.</span>
          </h2>
          
          {/* Bio - Premium floating panel */}
          <FloatingPanel className="reveal reveal-delay-2 p-10 md:p-14 mb-16">
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I'm Dasu Prabhukumar, a Computer Science undergraduate at NRI Institute of Technology. 
                I focus on understanding fundamentals deeply—data science, analytical thinking, 
                and practical problem-solving.
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I believe in clarity over complexity. Every project is an opportunity 
                to learn and contribute something meaningful.
              </p>
            </div>
          </FloatingPanel>
          
          {/* Highlights - Spatial tiles */}
          <div className="grid md:grid-cols-3 gap-6 reveal reveal-delay-3">
            {highlights.map((item, index) => (
              <SpatialCard
                key={index}
                className="p-8 text-center"
                depth="medium"
                tilt={true}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-[0.15em] block mb-2">
                  {item.label}
                </span>
                <span className="text-lg text-foreground font-semibold">
                  {item.value}
                </span>
              </SpatialCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
