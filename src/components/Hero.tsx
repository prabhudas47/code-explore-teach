import { ArrowRight, ArrowDown } from "lucide-react";

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Ambient glow effects */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium mb-8 animate-fade-up opacity-0">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Open to opportunities
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6 animate-fade-up opacity-0 animate-delay-100">
            Building the future
            <br />
            <span className="text-gradient">through technology.</span>
          </h1>
          
          {/* Supporting statement */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-up opacity-0 animate-delay-200">
            Computer Science student focused on data science, 
            problem-solving, and creating meaningful solutions.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up opacity-0 animate-delay-300">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-all duration-300 shadow-medium hover:shadow-hard group card-3d"
            >
              Connect
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-500">
        <button
          onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ArrowDown className="h-4 w-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
