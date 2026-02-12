import { useEffect, useRef, useState } from 'react';
import { Phone, Mail, Linkedin } from 'lucide-react';

export const PortfolioContact = () => {
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
    <section ref={sectionRef} id="contact" className="py-16 sm:py-32 px-4 sm:px-6 relative content-layer">
      <div className="max-w-2xl mx-auto text-center">
        <div className={`mb-16 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Get In Touch</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Contact
          </h2>
        </div>

        <div
          className={`glass-panel rounded-2xl p-6 sm:p-10 md:p-14 transition-all duration-1000 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="space-y-6 mb-12">
            <a
              href="tel:+916281002028"
              className="flex items-center justify-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm tracking-wide">+91 6281002028</span>
            </a>
            <a
              href="mailto:prabhudasu47@gmail.com"
              className="flex items-center justify-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm tracking-wide">prabhudasu47@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/dasu-prabhukumar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-4 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-sm tracking-wide">dasu-prabhukumar</span>
            </a>
          </div>

          <div className="w-16 h-[1px] bg-border mx-auto mb-10" />

          <p
            className="text-lg sm:text-xl md:text-2xl font-light text-muted-foreground italic"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            "Let's build something meaningful."
          </p>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground/40 text-xs mt-16 tracking-wide">
          © 2025 Dasu Prabhu Kumar. All rights reserved.
        </p>
      </div>
    </section>
  );
};
