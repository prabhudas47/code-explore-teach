import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultAbout = {
  heading: "I don't just study\nData Science.\nI build intelligent\nsystems around it.",
  description: "I am currently pursuing B.Tech in Computer Science (Data Science) at NRI Institute of Technology (2023–2027). My focus lies in Artificial Intelligence, structured automation systems, and scalable workflow architecture. I aim to create systems that reduce manual effort and transform data into decisions.",
};

export const AboutSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data } = usePortfolioData('about', defaultAbout);

  const headingLines = data.heading.split('\n');

  return (
    <section id="about" className="py-24 sm:py-32 relative">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        <p className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-12 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="font-display text-base">Who I Am</span>
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-foreground transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {headingLines.map((line, i) => (
              <span key={i}>
                {i >= 2 ? <span className="text-muted-foreground">{line}</span> : line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="w-12 h-px bg-muted-foreground mb-8" />
            <p className="text-sm sm:text-base text-muted-foreground leading-[1.8]">{data.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
