import { useState } from "react";
import { ChessShaderBackground } from "@/components/ChessShaderBackground";
import { PuzzleBackground } from "@/components/PuzzleBackground";
import { PortfolioHero } from "@/components/PortfolioHero";
import { PortfolioNav } from "@/components/PortfolioNav";
import { PuzzleReveal } from "@/components/PuzzleReveal";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";
import "@/components/PuzzleRevealStyles.css";

const Index = () => {
  const [shaderDone, setShaderDone] = useState(false);

  return (
    <div className="min-h-screen relative bg-background">
      {/* Ocean chess shader plays first */}
      <ChessShaderBackground onFadeComplete={() => setShaderDone(true)} />

      {/* Puzzle piece rises from chess ocean before fade */}
      <PuzzleReveal triggerAt={12} />

      {/* After shader fades, puzzle wall + content fade in */}
      <div
        className="transition-opacity duration-[3000ms] ease-in"
        style={{ opacity: shaderDone ? 1 : 0 }}
      >
        <PuzzleBackground />
        <PortfolioNav />
        <div className="relative z-10">
          <PortfolioHero />
          <div className="section-divider mx-auto max-w-4xl" />
          <AboutSection />
          <div className="section-divider mx-auto max-w-4xl" />
          <SkillsSection />
          <div className="section-divider mx-auto max-w-4xl" />
          <ProjectsSection />
          <div className="section-divider mx-auto max-w-4xl" />
          <JourneySection />
          <div className="section-divider mx-auto max-w-4xl" />
          <CertificationsSection />
          <div className="section-divider mx-auto max-w-4xl" />
          <ContactSection />
          <FooterSection />
        </div>
      </div>
    </div>
  );
};

export default Index;
