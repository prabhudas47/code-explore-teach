import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface LandingPageProps {
  onEnterPortfolio: () => void;
}

export const LandingPage = ({ onEnterPortfolio }: LandingPageProps) => {
  const [showQuote, setShowQuote] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => setShowQuote(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-nebula overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing Grid Background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 191, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 191, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        {/* Sparkles */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-accent rounded-full animate-sparkle"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}

        {/* 3D Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-pulse-glow leading-tight transform perspective-1000 animate-rotate3d">
            Welcome to
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-accent bg-clip-text text-transparent animate-pulse-glow mt-4 transform perspective-1000">
            Prabhu Innovative Portfolio
          </h2>
        </div>

        {/* Quote with Typewriter Effect */}
        {showQuote && (
          <div className="mb-12 max-w-4xl mx-auto animate-fade-in">
            <p className="text-xl md:text-2xl text-foreground italic animate-typewriter font-light">
              "Innovation is seeing what everybody has seen and thinking what nobody has thought."
            </p>
          </div>
        )}

        {/* 3D Enter Button */}
        <div className="animate-float">
          <Button
            onClick={onEnterPortfolio}
            className="group relative overflow-hidden px-12 py-6 text-xl font-semibold bg-gradient-primary hover:bg-gradient-accent border-2 border-primary/30 shadow-neon hover:shadow-purple transition-all duration-500 transform hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, hsl(195 100% 50%), hsl(195 100% 40%))',
              boxShadow: `
                0 0 20px hsl(195 100% 50% / 0.6),
                inset 0 2px 4px hsl(195 100% 60% / 0.3),
                inset 0 -2px 4px hsl(195 100% 30% / 0.3)
              `,
            }}
          >
            <span className="relative z-10 text-background font-bold">Enter Portfolio</span>
            
            {/* Ripple Effect */}
            <div className="absolute inset-0 bg-accent/20 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-ripple" />
            
            {/* Magnetic Hover Effect */}
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-lg" />
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-primary animate-glow" />
        </div>
      </div>

      {/* Floating Abstract Shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-primary rounded-full opacity-20 animate-float blur-xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-accent rounded-full opacity-15 animate-float blur-2xl" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-primary rounded-full opacity-25 animate-float blur-lg" style={{ animationDelay: '2s' }} />
    </div>
  );
};