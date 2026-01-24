import { Mail, Phone, Linkedin, ArrowUpRight, MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { SpatialCard, FloatingPanel } from "@/components/ui/spatial-card";

export const Contact = () => {
  const sectionRef = useScrollReveal<HTMLElement>();

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
    <section ref={sectionRef} className="py-28 md:py-40 relative">
      {/* Ambient glows */}
      <div className="absolute right-1/4 bottom-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute left-0 top-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section label */}
          <div className="reveal mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-primary tracking-[0.2em] uppercase bg-primary/8 border border-primary/15 rounded-full">
              <MessageCircle className="h-3.5 w-3.5" />
              Contact
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Let's{" "}
            <span className="text-gradient">connect.</span>
          </h2>
          
          <p className="reveal reveal-delay-2 text-lg md:text-xl text-muted-foreground mb-14 leading-relaxed">
            Open for opportunities, collaborations, and conversations about 
            technology and meaningful projects.
          </p>
          
          {/* Contact Cards */}
          <div className="space-y-5">
            {contactInfo.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target={item.label === "LinkedIn" ? "_blank" : undefined}
                rel={item.label === "LinkedIn" ? "noopener noreferrer" : undefined}
                className={`reveal reveal-delay-${index + 2} block`}
              >
                <SpatialCard className="p-6 group" depth="medium">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase block mb-1">
                          {item.label}
                        </span>
                        <span className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.value}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </SpatialCard>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
