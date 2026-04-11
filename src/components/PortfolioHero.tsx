import { useEffect, useState } from 'react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const defaultHero = {
  name: 'DASU\nPrabhukumar',
  tagline: 'Data Science • AI • Automation',
  subtitle: 'I design intelligent systems, automate workflows,\nand build structured data-driven solutions.',
  profileImage: '',
  backgroundVideo: '',
};

export const PortfolioHero = () => {
  const [visible, setVisible] = useState(false);
  const { data } = usePortfolioData('hero', defaultHero);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const nameLines = (data.name || 'DASU\nPrabhukumar').split('\n');

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-6" id="hero">
      {data.backgroundVideo && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          src={data.backgroundVideo}
        />
      )}

      <div className="text-center relative z-10">
        {data.profileImage && (
          <div className={`mb-8 transition-all duration-1000 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <img
              src={data.profileImage}
              alt="Profile"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover mx-auto border-2 border-border"
              loading="lazy"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}

        <p className={`text-xs sm:text-sm tracking-[0.35em] uppercase text-muted-foreground mb-8 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {data.tagline}
        </p>

        <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-foreground leading-[0.9] mb-8 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          {nameLines.map((line, i) => (
            <span key={i}>{line}{i < nameLines.length - 1 && <br />}</span>
          ))}
        </h1>

        <p className={`text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {(data.subtitle || '').split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br className="hidden sm:block" />}</span>
          ))}
        </p>

        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a href="#projects" className="inline-flex items-center justify-center px-8 py-3.5 border border-foreground text-foreground text-sm tracking-wider uppercase hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-105">View Work</a>
          <a href="#contact" className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-muted-foreground text-sm tracking-wider uppercase hover:border-foreground hover:text-foreground transition-all duration-300 hover:scale-105">Contact</a>
          <a href="/resume.pdf" download="Resume.pdf" className="inline-flex items-center justify-center px-8 py-3.5 border border-border text-muted-foreground text-sm tracking-wider uppercase hover:border-foreground hover:text-foreground transition-all duration-300 hover:scale-105">Resume</a>
        </div>
      </div>

      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-1000 delay-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <a href="#about" className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <svg className="w-4 h-4 animate-scroll-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
};
