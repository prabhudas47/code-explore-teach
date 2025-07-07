import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code, Lightbulb, Users, Clock } from "lucide-react";

export const Skills = () => {
  const technicalSkills = [
    { name: "Python", level: 90 },
    { name: "Machine Learning", level: 85 },
    { name: "Deep Learning", level: 80 },
    { name: "NLP", level: 75 },
    { name: "TensorFlow/PyTorch", level: 85 },
    { name: "OpenCV", level: 70 }
  ];

  const softSkills = [
    {
      icon: Lightbulb,
      title: "Public Speaking & Tech Talks",
      description: "Delivered presentations to 500+ peers"
    },
    {
      icon: Users,
      title: "Educational Design & Storytelling",
      description: "Created engaging learning experiences"
    },
    {
      icon: Users,
      title: "Team Collaboration & Leadership",
      description: "Led cross-functional project teams"
    },
    {
      icon: Clock,
      title: "Time Management & Adaptability",
      description: "Balanced academics with content creation"
    }
  ];

  const technologies = [
    "Python", "C/C++", "HTML/CSS/JS", "NumPy", "Pandas", "Matplotlib", 
    "scikit-learn", "TensorFlow", "PyTorch", "OpenCV", "Streamlit"
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Skills & Expertise</h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Technical Skills */}
            <Card className="shadow-medium hover:shadow-hard transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Code className="mr-3 h-6 w-6 text-primary" />
                  Technical Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {technicalSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
                
                {/* Technologies */}
                <div className="pt-6 border-t border-border">
                  <h4 className="font-semibold mb-4 text-foreground">Technologies & Libraries</h4>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Soft Skills */}
            <Card className="shadow-medium hover:shadow-hard transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Users className="mr-3 h-6 w-6 text-primary" />
                  Soft Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {softSkills.map((skill, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary-soft p-2 rounded-lg flex-shrink-0">
                      <skill.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{skill.title}</h4>
                      <p className="text-muted-foreground text-sm">{skill.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};