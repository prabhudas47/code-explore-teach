import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, ArrowRight } from "lucide-react";

export const Internships = () => {
  const internships = [
    {
      title: "Virtual Intern, AI",
      company: "AIMERS Indian Servers",
      period: "2024",
      status: "Completed",
      achievements: [
        "Developed and trained image classification models for practical applications",
        "Engineered and deployed functional AI and Telegram chatbots from the ground up",
        "Built interactive data-driven websites and web applications using the Streamlit framework"
      ],
      skills: ["Python", "Machine Learning", "Image Classification", "Telegram Bot API", "Streamlit"]
    },
    {
      title: "Virtual Intern, Data Analysis",
      company: "Deloitte",
      period: "2024",
      status: "Completed",
      achievements: [
        "Gained hands-on experience using Tableau to analyze data and create insightful performance metrics dashboards",
        "Developed comprehensive analytics solutions for business intelligence",
        "Mentored by Deloitte's analytics team on industry best practices"
      ],
      skills: ["Tableau", "Data Analysis", "Dashboard Creation", "Business Intelligence", "Performance Metrics"]
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Professional Experience</h2>
            <p className="text-xl text-muted-foreground">Building expertise through hands-on experience</p>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-4"></div>
          </div>
          
          {/* Internships */}
          <div className="space-y-8">
            {internships.map((internship, index) => (
              <Card key={index} className="shadow-medium hover:shadow-hard transition-all duration-300 border-l-4 border-l-primary">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-soft p-3 rounded-lg">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{internship.title}</CardTitle>
                        <p className="text-primary font-semibold">{internship.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-2">
                        {internship.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {internship.period}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Achievements */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Key Achievements</h4>
                    <div className="space-y-2">
                      {internship.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start space-x-3">
                          <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-muted-foreground">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Skills */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Technologies & Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
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