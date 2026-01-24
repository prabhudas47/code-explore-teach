import { ArrowRight, ArrowDown, Sparkles } from "lucide-react";

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Ambient atmospheric glows */}
      <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[180px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-accent/6 rounded-full blur-[150px] pointer-events-none animate-pulse-slow animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/4 rounded-full blur-[200px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status badge with glow */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary/8 border border-primary/20 text-primary rounded-full text-sm font-medium mb-10 animate-fade-up opacity-0 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            Open to opportunities
          </div>
          
          {/* Main headline - Premium typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.05] tracking-tight mb-8 animate-fade-up opacity-0 animate-delay-100">
            Building the future
            <br />
            <span className="text-gradient inline-flex items-center gap-4">
              through technology
              <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary animate-pulse" />
            </span>
          </h1>
          
          {/* Supporting statement */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed animate-fade-up opacity-0 animate-delay-200">
            Computer Science undergraduate focused on data science, 
            analytical thinking, and building meaningful solutions.
          </p>
          
          {/* Premium CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-up opacity-0 animate-delay-300">
            <button
              onClick={scrollToContact}
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all duration-500 shadow-[0_0_40px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_60px_hsl(var(--primary)/0.4)] hover:-translate-y-1"
            >
              Connect
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            
            <button
              onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 border border-border/60 text-foreground font-semibold rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-500 backdrop-blur-sm hover:-translate-y-1"
            >
              Explore Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-600">
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group"
        >
          <span className="text-xs font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-muted-foreground/50 to-transparent group-hover:from-primary/50 transition-colors duration-300" />
        </button>
      </div>
    </section>
  );
};
