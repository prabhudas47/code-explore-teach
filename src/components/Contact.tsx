import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, Send, Linkedin, MessageSquare, Sparkles, Zap, ExternalLink } from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (formData.email && formData.password && formData.message) {
      setIsSubmitted(true);
    }
    setIsSubmitting(false);
  };

  const handleLinkedInClick = () => {
    window.open('https://www.linkedin.com/in/dasu-prabhukumar-3919272a1/', '_blank');
  };

  return (
    <section className="relative min-h-screen py-20 bg-gradient-nebula overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Large Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Tech Grid Background */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 191, 255, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(160, 32, 240, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Futuristic Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 rounded-full mb-6 backdrop-blur-sm shadow-neon">
              <Zap className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-primary font-semibold">Contact Interface</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-pulse-glow">
              Connect & Collaborate
            </h2>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Ready to build something extraordinary together? Drop me a message or connect on LinkedIn.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Send Message Card */}
            <Card className="p-8 bg-card/30 backdrop-blur-xl border-primary/30 shadow-neon hover:shadow-purple transition-all duration-500 group transform hover:scale-105">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full mb-4 shadow-glow">
                  <MessageSquare className="h-5 w-5 text-primary animate-pulse" />
                  <span className="text-primary font-medium">Send Message</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Get In Touch</h3>
                <p className="text-foreground/70">Let's discuss your next innovative project</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="group relative">
                    <Input
                      type="email"
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`bg-background/20 border-primary/40 focus:border-primary focus:ring-primary/30 text-foreground placeholder:text-foreground/50 transition-all duration-300 hover:bg-background/30 backdrop-blur-sm shadow-glow hover:shadow-neon ${
                        submitted && !formData.email ? 'animate-shake border-destructive' : isSubmitted ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''
                      }`}
                      style={{
                        boxShadow: submitted && formData.email ? '0 0 20px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(0, 191, 255, 0.3)',
                      }}
                      required
                    />
                  </div>
                  
                  <div className="group relative">
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`bg-background/20 border-primary/40 focus:border-primary focus:ring-primary/30 text-foreground placeholder:text-foreground/50 transition-all duration-300 hover:bg-background/30 backdrop-blur-sm shadow-glow hover:shadow-neon ${
                        submitted && !formData.password ? 'animate-shake border-destructive' : isSubmitted ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''
                      }`}
                      style={{
                        boxShadow: submitted && formData.password ? '0 0 20px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(0, 191, 255, 0.3)',
                      }}
                      required
                    />
                  </div>
                  
                  <div className="group relative">
                    <Textarea
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className={`bg-background/20 border-primary/40 focus:border-primary focus:ring-primary/30 text-foreground placeholder:text-foreground/50 min-h-[120px] transition-all duration-300 hover:bg-background/30 backdrop-blur-sm shadow-glow hover:shadow-neon ${
                        submitted && !formData.message ? 'animate-shake border-destructive' : isSubmitted ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''
                      }`}
                      style={{
                        boxShadow: submitted && formData.message ? '0 0 20px rgba(34, 197, 94, 0.5)' : '0 0 10px rgba(0, 191, 255, 0.3)',
                      }}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-gradient-accent text-background font-bold py-4 px-8 transition-all duration-300 hover:scale-105 shadow-neon hover:shadow-purple group relative overflow-hidden border-2 border-primary/30"
                  style={{
                    background: 'linear-gradient(145deg, hsl(195 100% 50%), hsl(195 100% 40%))',
                    boxShadow: `
                      0 0 20px hsl(195 100% 50% / 0.6),
                      inset 0 2px 4px hsl(195 100% 60% / 0.3),
                      inset 0 -2px 4px hsl(195 100% 30% / 0.3)
                    `,
                  }}
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </>
                    )}
                  </span>
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 bg-accent/20 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-ripple" />
                </Button>

                {/* Status Message */}
                {isSubmitted && (
                  <div className="text-center text-green-400 font-medium animate-fade-in">
                    ✨ Message sent successfully!
                  </div>
                )}
              </form>
            </Card>

            {/* LinkedIn Connection Card */}
            <Card className="p-8 bg-card/30 backdrop-blur-xl border-accent/30 shadow-purple hover:shadow-neon transition-all duration-500 group transform hover:scale-105">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4 shadow-purple">
                  <Linkedin className="h-5 w-5 text-accent animate-pulse" />
                  <span className="text-accent font-medium">Professional Network</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent mb-2">Connect on LinkedIn</h3>
                <p className="text-foreground/70">Let's expand our professional network</p>
              </div>

              <Button 
                onClick={handleLinkedInClick}
                className="w-full bg-gradient-accent hover:bg-gradient-primary text-background font-bold py-4 px-8 transition-all duration-300 hover:scale-110 shadow-purple hover:shadow-neon mb-6 border-2 border-accent/30 relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(145deg, hsl(280 100% 53%), hsl(280 100% 43%))',
                  boxShadow: `
                    0 0 20px hsl(280 100% 53% / 0.6),
                    inset 0 2px 4px hsl(280 100% 63% / 0.3),
                    inset 0 -2px 4px hsl(280 100% 33% / 0.3)
                  `,
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  Connect with me on LinkedIn
                  <ExternalLink className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
                
                {/* Magnetic Hover Effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-ripple" />
              </Button>

              {/* Quick Connect Card */}
              <Card className="p-6 bg-background/20 border-accent/20 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-background" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">Quick Connect</h4>
                    <p className="text-foreground/60 text-sm">Available for collaboration</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-sm">Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm">Open for new opportunities</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/80">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Ready to innovate together</span>
                  </div>
                </div>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};