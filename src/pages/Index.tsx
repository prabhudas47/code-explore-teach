import { useEffect, useState } from "react";
import { ChatBot } from "@/components/ChatBot";
import { ChessShaderBackground } from "@/components/ChessShaderBackground";
import { PuzzleReveal } from "@/components/PuzzleReveal";
import { PortfolioNav } from "@/components/PortfolioNav";
import { PortfolioHero } from "@/components/PortfolioHero";
import { ProfessionalSummarySection } from "@/components/sections/ProfessionalSummarySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { InternshipsSection } from "@/components/sections/InternshipsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { CoreFocusSection } from "@/components/sections/CoreFocusSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { LearningTimelineSection } from "@/components/sections/LearningTimelineSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { CurrentlyBuildingSection } from "@/components/sections/CurrentlyBuildingSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { CinematicSection } from "@/components/sections/CinematicSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { AdminPortal } from "@/components/AdminPortal";
import { ReduceMotionToggle } from "@/components/ReduceMotionToggle";
import { BackgroundDebugOverlay } from "@/components/BackgroundDebugOverlay";
import { BackgroundModeIndicator } from "@/components/BackgroundModeIndicator";
import { LowPowerBackground } from "@/components/LowPowerBackground";
import { useIdleBgPause } from "@/hooks/useIdleBgPause";
import { useTabVisibilityPause } from "@/hooks/useTabVisibilityPause";
import { isLowPowerForced } from "@/lib/bgPerf";

const CROSSFADE_MS = 700;

const Index = () => {
  const initialLowPower = isLowPowerForced();
  const [lowPower, setLowPower] = useState(initialLowPower);
  const [shaderMounted, setShaderMounted] = useState(!initialLowPower);
  const [introComplete, setIntroComplete] = useState(initialLowPower);
  const [adminOpen, setAdminOpen] = useState(false);

  useIdleBgPause();
  useTabVisibilityPause();

  // React to low-power changes (auto-escalation or preset/toggle) with a crossfade
  useEffect(() => {
    const onLP = (e: Event) => {
      const next = !!(e as CustomEvent).detail;
      setLowPower(next);
      if (next) {
        // Fade shader out, then unmount
        setTimeout(() => setShaderMounted(false), CROSSFADE_MS);
      } else {
        // Mount shader fresh; opacity transition handles the fade-in
        setShaderMounted(true);
        // If we're past intro, ensure content stays visible
        setIntroComplete(true);
      }
    };
    window.addEventListener('bg-low-power-change', onLP);
    return () => window.removeEventListener('bg-low-power-change', onLP);
  }, []);

  const handleFadeComplete = () => {
    setTimeout(() => {
      setIntroComplete(true);
      setTimeout(() => setShaderMounted(false), 1000);
    }, 500);
  };

  return (
    <div className="min-h-screen relative bg-background">
      {/* Cheap fallback always present; opacity crossfades */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          opacity: lowPower ? 1 : 0,
          transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
        }}
      >
        <LowPowerBackground />
      </div>

      {shaderMounted && (
        <div
          className="fixed inset-0 z-50"
          style={{
            opacity: lowPower ? 0 : (introComplete ? 0 : 1),
            transition: `opacity ${introComplete ? 1000 : CROSSFADE_MS}ms ease-in-out`,
          }}
        >
          <ChessShaderBackground onFadeComplete={handleFadeComplete} />
          {!introComplete && <PuzzleReveal triggerAt={8} />}
        </div>
      )}

      <div
        className={`grain-overlay transition-opacity duration-1000 ${introComplete ? 'opacity-100' : 'opacity-0'}`}
        style={{ pointerEvents: introComplete ? 'auto' : 'none' }}
      >
        <PortfolioNav />
        <PortfolioHero />
        <ProfessionalSummarySection />
        <AboutSection />
        <InternshipsSection />
        <JourneySection />
        <CoreFocusSection />
        <CaseStudiesSection />
        <ProjectsSection />
        <TechStackSection />
        <SkillsSection />
        <CertificationsSection />
        <LearningTimelineSection />
        <AchievementsSection />
        <CurrentlyBuildingSection />
        <ContactSection />
        <CinematicSection onDoubleTab={() => setAdminOpen(true)} />
        <FooterSection />
      </div>

      {introComplete && <ChatBot />}
      {introComplete && <ReduceMotionToggle />}
      <BackgroundDebugOverlay />
      <BackgroundModeIndicator />
      <AdminPortal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
};

export default Index;
