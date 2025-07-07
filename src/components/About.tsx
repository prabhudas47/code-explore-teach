import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Mic } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: Brain,
      title: "Currently Exploring",
      description: "LLMs, NLP, and prompt engineering"
    },
    {
      icon: Target,
      title: "Goal",
      description: "To become a responsible AI engineer and global educator"
    },
    {
      icon: Mic,
      title: "Teaching Impact",
      description: "Created tutorials and hosted sessions for 500+ peers"
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">About Me</h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Hey there! I'm a final-year B.Tech student passionate about{" "}
                <span className="text-primary font-semibold">Artificial Intelligence, Machine Learning, and Educational Content Design</span>.
                My mission is simple: make smart ideas simple and shareable.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                I love building intelligent systems—and equally, I love teaching others how they work.
                Teaching makes the abstract—concrete, and this is where I share what I learn.
              </p>
              
              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Badge variant="secondary" className="px-3 py-1">
                  B.Tech Final Year
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  AI Enthusiast
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Content Creator
                </Badge>
              </div>
            </div>
            
            {/* Highlights Cards */}
            <div className="space-y-4">
              {highlights.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 border-l-4 border-l-primary">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-soft p-3 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};