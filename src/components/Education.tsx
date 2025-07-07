import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Calendar } from "lucide-react";

export const Education = () => {
  const education = [
    {
      year: "2021–2025",
      degree: "B.Tech in [Your Branch]",
      institution: "[Your University Name]",
      status: "Final Year",
      description: "Specialized in AI/ML coursework with focus on deep learning and computer vision"
    },
    {
      year: "2019–2021", 
      degree: "Higher Secondary (Science Stream)",
      institution: "[Your School Name]",
      status: "Completed",
      description: "Mathematics, Physics, Chemistry with Computer Science"
    }
  ];

  const certifications = [
    {
      title: "Deep Learning Specialization",
      platform: "Coursera (Andrew Ng)",
      year: "2025",
      badge: "Specialist"
    },
    {
      title: "Google Data Analytics Certificate",
      platform: "Google",
      year: "2024",
      badge: "Certified"
    },
    {
      title: "Introduction to Machine Learning",
      platform: "edX",
      year: "2023",
      badge: "Verified"
    },
    {
      title: "Prompt Engineering for Developers",
      platform: "OpenAI",
      year: "2025",
      badge: "Expert"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Education & Certifications</h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education Timeline */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center text-foreground">
                <GraduationCap className="mr-3 h-6 w-6 text-primary" />
                Education Timeline
              </h3>
              
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="mr-1 h-3 w-3" />
                          {edu.year}
                        </Badge>
                        <Badge variant={edu.status === "Final Year" ? "default" : "secondary"}>
                          {edu.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{edu.degree}</CardTitle>
                      <p className="text-primary font-medium">{edu.institution}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Certifications */}
            <div>
              <h3 className="text-2xl font-bold mb-8 flex items-center text-foreground">
                <Award className="mr-3 h-6 w-6 text-primary" />
                Certifications
              </h3>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <Card key={index} className="shadow-soft hover:shadow-medium transition-all duration-300 hover:border-primary/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{cert.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{cert.platform}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="text-xs">{cert.year}</Badge>
                          <Badge variant="secondary" className="text-xs">{cert.badge}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};