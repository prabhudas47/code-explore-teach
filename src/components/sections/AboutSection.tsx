import { useScrollReveal } from '@/hooks/useScrollReveal';

export const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p
          className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-12 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="font-display text-base">Who I Am</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left — bold statement */}
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            I don't just study
            <br />
            Data Science.
            <br />
            <span className="text-muted-foreground">I build intelligent</span>
            <br />
            <span className="text-muted-foreground">systems around it.</span>
          </h2>

          {/* Right — paragraph */}
          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-12 h-px bg-muted-foreground mb-8" />
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.8]">
              I am currently pursuing B.Tech in Computer Science (Data Science) at NRI Institute of Technology (2023–2027). My focus lies in Artificial Intelligence, structured automation systems, and scalable workflow architecture. I aim to create systems that reduce manual effort and transform data into decisions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
