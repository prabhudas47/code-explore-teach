import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Internships } from "@/components/Internships";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);

  const handleEnterPortfolio = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onEnterPortfolio={handleEnterPortfolio} />;
  }

  return (
    <div className="min-h-screen bg-gradient-nebula">
      <Navigation />
      
      {/* Hero Section */}
      <div className="animate-fade-in">
        <Hero />
      </div>
      
      {/* About Section */}
      <div id="about" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <About />
      </div>
      
      {/* Projects Section */}
      <div id="projects" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Projects />
      </div>
      
      {/* Skills Section */}
      <div id="skills" className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <Skills />
      </div>
      
      {/* Experience Section */}
      <div id="experience" className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <Internships />
      </div>
      
      {/* Education Section */}
      <div id="education" className="animate-fade-in" style={{ animationDelay: '1s' }}>
        <Education />
      </div>
      
      {/* Contact Section */}
      <div id="contact" className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <Contact />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;