import { Sparkles } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border/30 relative">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} Dasu Prabhukumar
          </p>
          
          <p className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Built with precision and purpose
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
};
