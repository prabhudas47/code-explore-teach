import { useEffect, useRef } from "react";
import { Quote } from "lucide-react";

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
    <section ref={sectionRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Quote className="h-5 w-5 text-primary" />
            </div>
          </div>
          
          <blockquote className="reveal reveal-delay-1">
            <p className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed mb-8">
              "The best way to predict the future is to learn continuously, 
              build deliberately, and stay curious."
            </p>
          </blockquote>
          
          <div className="reveal reveal-delay-2">
            <span className="text-sm text-muted-foreground font-medium">
              — My guiding principle
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
