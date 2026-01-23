import { useEffect, useRef } from "react";
import { Mail, Phone, Linkedin, ArrowUpRight } from "lucide-react";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el) => {
              el.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "prabhudasu47@gmail.com",
      href: "mailto:prabhudasu47@gmail.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 6281002028",
      href: "tel:+916281002028"
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Connect on LinkedIn",
      href: "https://www.linkedin.com/in/dasu-prabhukumar"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative">
      {/* Ambient glow */}
      <div className="absolute right-1/4 bottom-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Section label */}
          <div className="reveal mb-4">
            <span className="text-sm font-medium text-primary tracking-widest uppercase">
              Contact
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
            Let's connect.
          </h2>
          
          <p className="reveal reveal-delay-2 text-lg text-muted-foreground mb-12">
            Open for opportunities, collaborations, and conversations about 
            technology and meaningful projects.
          </p>
          
          {/* Contact Cards - Floating tiles */}
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "LinkedIn" ? "_blank" : undefined}
                rel={item.label === "LinkedIn" ? "noopener noreferrer" : undefined}
                className={`reveal reveal-delay-${index + 2} group flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl card-3d hover-glow`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs text-muted-foreground block">
                      {item.label}
                    </span>
                    <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.value}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
