import { PortfolioNav } from "@/components/PortfolioNav";
import { PortfolioHero } from "@/components/PortfolioHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { CoreFocusSection } from "@/components/sections/CoreFocusSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { JourneySection } from "@/components/sections/JourneySection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FooterSection } from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen relative bg-background grain-overlay">
      <PortfolioNav />
      <PortfolioHero />
      <AboutSection />
      <CoreFocusSection />
      <ProjectsSection />
      <SkillsSection />
      <JourneySection />
      <ContactSection />
      <FooterSection />
    </div>
  );
};

export default Index;
