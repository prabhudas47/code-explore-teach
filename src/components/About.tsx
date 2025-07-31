import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Database, GraduationCap, MapPin, Calendar } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: Brain,
      title: "Data Science",
      description: "Specialized in machine learning, data analysis, and AI model development"
    },
    {
      icon: Code,
      title: "AI Development",
      description: "Building chatbots, image classification models, and intelligent systems"
    },
    {
      icon: Database,
      title: "Data Analytics",
      description: "Creating insightful dashboards and performance metrics using Tableau"
    }
  ];

  const education = [
    {
      year: "2022 - 2026",
      degree: "B.Tech, Data Science",
      status: "Currently pursuing 3rd Year",
      institution: "NRI Institute of Technology (NRIIT), Guntur",
      location: "Near Visadala"
    },
    {
      year: "2020 - 2022",
      degree: "Intermediate, MPC",
      status: "Completed",
      institution: "Sri Chaitanya Junior College",
      location: "Vijayawada"
    },
    {
      year: "2020",
      degree: "SSC (10th Class)",
      status: "Completed",
      institution: "Vamsi High School",
      location: "Vundavalli Center, near Tadepalli"
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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Bio and Highlights */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  As a <span className="text-primary font-semibold">Data Science student</span> and technology enthusiast, I am passionate about leveraging data to create meaningful insights and intelligent solutions. My journey spans across various domains of artificial intelligence, from developing image classification models to building interactive chatbots.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Through hands-on internships and practical projects, I've gained experience in machine learning, data analytics, and web development. I believe in the power of technology to solve real-world problems and am constantly seeking opportunities to apply my skills in innovative ways.
                </p>
                
                {/* Status Badges */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    B.Tech 3rd Year
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    Data Science
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    AI Developer
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
            
            {/* Education Timeline */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Education Timeline</h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index} className="hover:shadow-medium transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-primary mb-1">{edu.degree}</CardTitle>
                          <Badge variant="outline" className="mb-2">{edu.status}</Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {edu.year}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-foreground font-medium">
                          <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                          {edu.institution}
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-2" />
                          {edu.location}
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