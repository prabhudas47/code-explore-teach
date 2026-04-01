import { useScrollReveal } from '@/hooks/useScrollReveal';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultSummary = {
  statement: "Computer Science (Data Science) student focused on AI systems, automation workflows, and scalable data-driven architectures.",
  highlights: ["AI systems", "automation workflows", "scalable data-driven architectures"],
};

export const ProfessionalSummarySection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { data } = usePortfolioData('professional_summary', defaultSummary);

  const renderHighlighted = (text: string, highlights: string[]) => {
    let result: (string | JSX.Element)[] = [text];
    highlights.forEach((phrase, pi) => {
      result = result.flatMap((part) => {
        if (typeof part !== 'string') return [part];
        const idx = part.toLowerCase().indexOf(phrase.toLowerCase());
        if (idx === -1) return [part];
        return [
          part.slice(0, idx),
          <span key={pi} className="relative inline-block">
            {part.slice(idx, idx + phrase.length)}
            <span
              className="absolute bottom-0 left-0 h-px bg-foreground transition-all duration-1000 ease-out"
              style={{ width: isVisible ? '100%' : '0%', transitionDelay: `${800 + pi * 300}ms` }}
            />
          </span>,
          part.slice(idx + phrase.length),
        ];
      });
    });
    return result;
  };

  return (
    <section className="py-20 sm:py-28 relative">
      <div className="max-w-4xl mx-auto px-6 text-center" ref={ref}>
        <p
          className={`text-xs tracking-[0.3em] uppercase text-muted-foreground mb-10 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <span className="font-display text-base">Professional Summary</span>
        </p>
        <p
          className={`text-lg sm:text-xl md:text-2xl text-foreground leading-relaxed font-light tracking-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {renderHighlighted(data.statement, data.highlights)}
        </p>
      </div>
    </section>
  );
};
