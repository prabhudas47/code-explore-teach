import { useEffect, useRef } from "react";

export const Philosophy = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 bg-background relative overflow-hidden">
      {/* Subtle accent glow */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-8 block">
              Philosophy
            </span>
          </div>
          
          <blockquote className="reveal reveal-delay-1">
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-foreground leading-relaxed mb-8">
              "The best way to predict the future is to learn continuously, 
              build deliberately, and stay curious."
            </p>
          </blockquote>
          
          <div className="reveal reveal-delay-2 w-12 h-px bg-primary mx-auto" />
        </div>
      </div>
    </section>
  );
};
