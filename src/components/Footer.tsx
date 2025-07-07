import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Let's Build the Future Together</h3>
            <p className="text-background/80 mb-6">
              Passionate about AI, education, and making complex ideas accessible to everyone.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-background hover:text-primary hover:bg-background/10">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="border-t border-background/20 pt-8">
            <p className="text-background/60 text-sm mb-4">
              © 2025 Dasu prabhu kumar. All rights reserved.
            </p>
            <p className="text-background/60 text-sm flex items-center justify-center">
              Built with <Heart className="h-4 w-4 mx-1 text-red-400" /> using{" "}
              <a href="https://lovable.so" target="_blank" rel="noopener noreferrer" className="ml-1 hover:text-primary transition-colors underline">
                Lovable.so
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};