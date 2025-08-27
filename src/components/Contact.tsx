import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Linkedin, Send, Sparkles, Zap } from "lucide-react";
import { useState } from "react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (formData.email && formData.message) {
      setSubmitStatus('success');
    } else {
      setSubmitStatus('error');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-surface">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Futuristic Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              <span className="text-sm uppercase tracking-widest text-primary font-semibold">Connect</span>
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
              Let's Build the Future
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to transform ideas into reality? Drop me a message and let's create something extraordinary together.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* 3D Contact Form */}
            <div className="space-y-8">
              <Card className="relative p-8 backdrop-blur-xl bg-card/50 border border-border/50 shadow-2xl hover:shadow-primary/20 transition-all duration-500 group">
                {/* Glassmorphism Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Mail className="w-6 h-6 text-background" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">Send Message</h3>
                      <p className="text-muted-foreground">Get in touch instantly</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="group">
                      <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                      <div className="relative">
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="yourname@example.com"
                          className={`h-14 bg-background/50 border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50 ${
                            submitStatus === 'error' && !formData.email ? 'border-destructive animate-shake' : ''
                          } ${submitStatus === 'success' ? 'border-success shadow-success/20' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="group">
                      <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                      <div className="relative">
                        <Input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="h-14 bg-background/50 border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div className="group">
                      <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                      <div className="relative">
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Type your message here..."
                          rows={5}
                          className={`bg-background/50 border-2 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 hover:border-primary/50 resize-none ${
                            submitStatus === 'error' && !formData.message ? 'border-destructive animate-shake' : ''
                          } ${submitStatus === 'success' ? 'border-success shadow-success/20' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Ripple Effect */}
                      <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      
                      <div className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </div>
                    </Button>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <div className="text-center text-success font-medium animate-fade-in">
                        ✨ Message sent successfully!
                      </div>
                    )}
                    {submitStatus === 'error' && (
                      <div className="text-center text-destructive font-medium animate-shake">
                        ⚠️ Please fill in all required fields
                      </div>
                    )}
                  </form>
                </div>
              </Card>
            </div>

            {/* 3D LinkedIn Button & Info */}
            <div className="space-y-8">
              {/* LinkedIn 3D Button */}
              <Card className="relative p-8 backdrop-blur-xl bg-card/50 border border-border/50 shadow-2xl hover:shadow-primary/20 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#0077B5] to-[#00A0DC] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Linkedin className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">Professional Network</h3>
                  <p className="text-muted-foreground mb-8">
                    Connect with me on LinkedIn for professional networking and industry insights.
                  </p>
                  
                  <Button
                    asChild
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#0077B5] to-[#00A0DC] hover:from-[#0077B5]/90 hover:to-[#00A0DC]/90 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#0077B5]/30 transition-all duration-300 border-2 border-transparent hover:border-[#0077B5]/30"
                  >
                    <a 
                      href="https://www.linkedin.com/in/dasu-prabhukumar-3919272a1/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <Linkedin className="w-5 h-5" />
                      Connect with me on LinkedIn
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Quick Info */}
              <Card className="relative p-8 backdrop-blur-xl bg-card/50 border border-border/50 shadow-2xl hover:shadow-primary/20 transition-all duration-500 group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Zap className="w-6 h-6 text-background" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Quick Connect</h3>
                      <p className="text-muted-foreground">Available for collaboration</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-5 h-5 text-primary" />
                      <span>Response within 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span>Open for new opportunities</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Zap className="w-5 h-5 text-primary" />
                      <span>Ready to innovate together</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};