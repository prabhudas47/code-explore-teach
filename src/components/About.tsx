import { useEffect, useRef } from "react";

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

  return (
    <section ref={sectionRef} className="py-32 bg-card">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Section label */}
          <div className="reveal">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-6 block">
              About
            </span>
          </div>
          
          {/* Main statement */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-12">
            A serious approach to learning and growth.
          </h2>
          
          {/* Bio - Short, honest, no exaggeration */}
          <div className="space-y-6 reveal reveal-delay-2">
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am Dasu Prabhukumar, a Computer Science undergraduate at NRI Institute of Technology. 
              My focus is on understanding the fundamentals deeply—data science, analytical thinking, 
              and building practical solutions.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              I believe in clarity over complexity. Every project I undertake is an opportunity 
              to learn, improve, and contribute something meaningful. I'm not looking for shortcuts—
              just steady, focused progress.
            </p>
          </div>
          
          {/* Key facts - Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-border">
            <div className="reveal reveal-delay-1">
              <span className="text-sm text-primary font-medium tracking-wide uppercase block mb-2">
                Location
              </span>
              <p className="text-foreground font-medium">Andhra Pradesh, India</p>
            </div>
            
            <div className="reveal reveal-delay-2">
              <span className="text-sm text-primary font-medium tracking-wide uppercase block mb-2">
                Focus
              </span>
              <p className="text-foreground font-medium">Data Science & Problem Solving</p>
            </div>
            
            <div className="reveal reveal-delay-3">
              <span className="text-sm text-primary font-medium tracking-wide uppercase block mb-2">
                Timeline
              </span>
              <p className="text-foreground font-medium">B.Tech 2023–2027</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
