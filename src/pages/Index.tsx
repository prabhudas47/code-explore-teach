import { useState } from "react";
import { ChessShaderBackground } from "@/components/ChessShaderBackground";
import { PuzzleReveal } from "@/components/PuzzleReveal";
import { PortfolioNav } from "@/components/PortfolioNav";
import { PortfolioHero } from "@/components/PortfolioHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { CoreFocusSection } from "@/components/sections/CoreFocusSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { CinematicSection } from "@/components/sections/CinematicSection";

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [shaderVisible, setShaderVisible] = useState(true);

  const handleFadeComplete = () => {
    // Small delay after shader fades to black, then reveal portfolio
    setTimeout(() => {
      setIntroComplete(true);
      // Remove shader from DOM after portfolio fade-in
      setTimeout(() => setShaderVisible(false), 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Shader Intro */}
      {shaderVisible && (
        <div
          className="fixed inset-0 z-50"
          style={{ opacity: introComplete ? 0 : 1, transition: 'opacity 1s ease-in-out' }}
        >
          <ChessShaderBackground onFadeComplete={handleFadeComplete} />
          <PuzzleReveal triggerAt={8} />
        </div>
      )}

      {/* Portfolio Content */}
      <div
        className={`grain-overlay transition-opacity duration-1000 ${
          introComplete ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: introComplete ? 'auto' : 'none' }}
      >
        <PortfolioNav />
        <PortfolioHero />
        <AboutSection />
        <JourneySection />
        <CoreFocusSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <CinematicSection />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
