import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, Calendar } from "lucide-react";

export const Education = () => {
  const education = [
    {
      year: "2022–2026",
      degree: "B.Tech, Data Science",
      institution: "NRI Institute of Technology (NRIIT), Guntur",
      status: "3rd Year",
      description: "Pursuing comprehensive coursework in data science, machine learning, and artificial intelligence"
    },
    {
      year: "2020–2022", 
      degree: "Intermediate, MPC",
      institution: "Sri Chaitanya Junior College, Vijayawada",
      status: "Completed",
      description: "Mathematics, Physics, Chemistry - Strong foundation in analytical and scientific thinking"
    },
    {
      year: "2020",
      degree: "SSC (10th Class)",
      institution: "Vamsi High School, Vundavalli",
      status: "Completed",
      description: "Completed secondary education with focus on mathematics and sciences"
    }
  ];

  const certifications = [
    {
      title: "Virtual Internship on leveraging Tableau for metrics and data analysis",
      platform: "Deloitte",
      year: "2024",
      badge: "Completed"
    },
    {
      title: "Virtual Internship on Artificial Intelligence",
      platform: "AIMERS Indian Servers",
      year: "2024",
      badge: "Completed"
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