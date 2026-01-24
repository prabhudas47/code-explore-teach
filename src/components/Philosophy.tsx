import { Quote, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { FloatingPanel } from "@/components/ui/spatial-card";

export const Philosophy = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="py-28 md:py-40 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/6 rounded-full blur-[220px] pointer-events-none" />
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Premium quote panel */}
          <FloatingPanel className="p-12 md:p-16 lg:p-20 text-center">
            <div className="reveal">
              <div className="relative w-20 h-20 mx-auto mb-10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-full flex items-center justify-center">
                  <Quote className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            
            <blockquote className="reveal reveal-delay-1">
              <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-relaxed mb-10">
                "The best way to predict the future is to{" "}
                <span className="text-gradient">learn continuously</span>, 
                build deliberately, and stay curious."
              </p>
            </blockquote>
            
            <div className="reveal reveal-delay-2 flex items-center justify-center gap-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground font-semibold tracking-wider">
                MY GUIDING PRINCIPLE
              </span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </FloatingPanel>
        </div>
      </div>
    </section>
  );
};
