import { useEffect, useRef } from "react";

export const Education = () => {
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

  const education = [
    {
      period: "2023 – 2027",
      degree: "B.Tech in Computer Science",
      institution: "NRI Institute of Technology",
      status: "In Progress",
      description: "Core focus on programming fundamentals, data structures, algorithms, and data science applications."
    },
    {
      period: "2020 – 2022",
      degree: "Intermediate (MPC)",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      status: "Completed",
      description: "Mathematics, Physics, Chemistry—building strong analytical foundations."
    },
    {
      period: "2020",
      degree: "Secondary School Certificate",
      institution: "Vamsi High School, Vundavalli",
      status: "Completed",
      description: "Foundational education with focus on mathematics and sciences."
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl">
          {/* Section label */}
          <div className="reveal">
            <span className="text-sm font-medium text-primary tracking-widest uppercase mb-6 block">
              Education
            </span>
          </div>
          
          {/* Heading */}
          <h2 className="reveal reveal-delay-1 text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-16">
            Building a strong foundation.
          </h2>
          
          {/* Timeline */}
          <div className="space-y-0">
            {education.map((item, index) => (
              <div
                key={index}
                className={`reveal reveal-delay-${index + 1} group`}
              >
                <div className="grid md:grid-cols-[200px_1fr] gap-6 py-10 border-t border-border hover:bg-card/50 transition-colors duration-300 -mx-6 px-6">
                  {/* Period */}
                  <div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {item.period}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.degree}
                      </h3>
                      <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full shrink-0">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground font-medium mb-2">
                      {item.institution}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
