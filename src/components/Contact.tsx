import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, ExternalLink, MessageSquare, Quote } from "lucide-react";

export const Contact = () => {
  const testimonials = [
    {
      quote: "One of the sharpest and most empathetic student mentors I've worked with.",
      author: "Mentor @ EdTech Intern Company",
      role: "Industry Mentor"
    },
    {
      quote: "Clear, concise, and creative—his ML tutorial series helped our entire cohort.",
      author: "Peer Reviewer",
      role: "Student Peer"
    }
  ];

  const blogPosts = [
    {
      title: "Backprop Simplified",
      platform: "YouTube",
      type: "Video Series",
      icon: "🎥"
    },
    {
      title: "AI for Beginners: Neural Networks in 5 Minutes",
      platform: "Medium",
      type: "Article",
      icon: "✍️"
    },
    {
      title: "Prompt Engineering 101",
      platform: "Self-Paced",
      type: "Mini Course",
      icon: "🎓"
    }
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Let's Connect</h2>
            <p className="text-xl text-muted-foreground">Building the future of AI, one conversation at a time</p>
            <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-medium hover:shadow-hard transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Get In Touch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="mailto:your.email@example.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email Me
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://linkedin.com/in/yourhandle" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://github.com/yourhandle" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Blog Section */}
              <Card className="shadow-medium hover:shadow-hard transition-all duration-300">
                <CardHeader>
                  <CardTitle>Blog & Micro-Courses</CardTitle>
                  <p className="text-sm text-muted-foreground">Teaching makes the abstract—concrete</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {blogPosts.map((post, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <span className="text-lg">{post.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">{post.platform}</Badge>
                          <Badge variant="secondary" className="text-xs">{post.type}</Badge>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            
            {/* Testimonials */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-6 flex items-center text-foreground">
                <Quote className="mr-3 h-6 w-6 text-primary" />
                What People Say
              </h3>
              
              <div className="grid gap-6">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="shadow-medium hover:shadow-hard transition-all duration-300 border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <blockquote className="text-lg text-muted-foreground italic mb-4 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                        <Quote className="h-8 w-8 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* CTA */}
              <Card className="mt-8 bg-gradient-hero border-0 shadow-hard">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-foreground">Ready to Collaborate?</h3>
                  <p className="text-muted-foreground mb-6">
                    Whether it's AI research, educational content, or just a chat about the future of technology—I'd love to connect!
                  </p>
                  <Button variant="hero" size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Start a Conversation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};