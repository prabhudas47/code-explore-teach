import { useEffect, useRef, useState } from 'react';
import { GraduationCap } from 'lucide-react';

const educationData = [
  {
    institution: 'NRI Institute of Technology',
    degree: 'B.Tech in Computer Science',
    period: '2023 – 2027',
  },
  {
    institution: 'Sri Chaitanya Junior College',
    degree: 'Intermediate',
    period: '2021 – 2023',
  },
  {
    institution: 'Vamsi High School',
    degree: 'High School Diploma',
    period: '2010 – 2021',
  },
];

export const PortfolioEducation = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="py-16 sm:py-32 px-4 sm:px-6 relative content-layer">
      <div className="max-w-3xl mx-auto">
        <div className={`mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Background</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Education
          </h2>
        </div>

        <div className="space-y-6">
          {educationData.map((item, i) => (
            <div
              key={i}
              className={`glass-card rounded-xl p-5 sm:p-8 transition-all duration-700 hover:border-foreground/15 hover:shadow-[0_0_30px_hsl(0_0%_100%/0.04)] ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${300 + i * 200}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="p-3 rounded-lg bg-muted/50 text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{item.institution}</h3>
                  <p className="text-muted-foreground text-sm">{item.degree}</p>
                  <p className="text-muted-foreground/60 text-xs mt-2">{item.period}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
