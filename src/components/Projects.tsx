import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Camera, GraduationCap, ExternalLink, Github } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      icon: Bot,
      title: "AI Career Chatbot",
      description: "Guided students toward tech career paths using NLP-powered Q&A system with intelligent conversation flow.",
      tech: ["Python", "GPT-3.5", "Streamlit"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Camera,
      title: "Smart Attendance System", 
      description: "Real-time face recognition model deployed for smart classrooms with 95%+ accuracy rate.",
      tech: ["OpenCV", "face_recognition", "Flask"],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: GraduationCap,
      title: "ML Crash Course for Freshers",
      description: "Designed & delivered a 3-day bootcamp with interactive notebooks & explainer videos for 100+ students.",
      tech: ["Jupyter", "YouTube", "Canva"],
      gradient: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Idea Labs & Projects</h2>
            <p className="text-xl text-muted-foreground">Turning prototypes into proof</p>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-4"></div>
          </div>
          
          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group hover:shadow-hard transition-all duration-300 hover:-translate-y-2 border-0 shadow-soft">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <project.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <CardDescription className="text-muted-foreground leading-relaxed min-h-[60px]">
                    {project.description}
                  </CardDescription>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1 group/btn">
                      <Github className="h-4 w-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                      Code
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 group/btn">
                      <ExternalLink className="h-4 w-4 mr-2 group-hover/btn:translate-x-1 transition-transform" />
                      Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};