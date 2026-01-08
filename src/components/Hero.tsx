import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      
      {/* Minimal accent glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl">
          {/* Main headline - Bold, clear */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-8 animate-fade-up opacity-0">
            Building the future
            <br />
            <span className="text-primary">through technology.</span>
          </h1>
          
          {/* Supporting statement - One line, clear */}
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mb-12 animate-fade-up opacity-0 animate-delay-200">
            Computer Science undergraduate focused on Data Science, 
            problem-solving, and creating meaningful solutions.
          </p>
          
          {/* Minimal CTA */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 animate-delay-400">
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-all duration-300 group"
            >
              Connect
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-sm hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 animate-delay-500">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-primary/50" />
      </div>
    </section>
  );
};
