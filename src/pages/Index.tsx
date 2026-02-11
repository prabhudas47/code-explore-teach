import { PuzzleBackground } from "@/components/PuzzleBackground";
import { PortfolioHero } from "@/components/PortfolioHero";
import { PortfolioEducation } from "@/components/PortfolioEducation";
import { PortfolioSkills } from "@/components/PortfolioSkills";
import { PortfolioProjects } from "@/components/PortfolioProjects";
import { PortfolioContact } from "@/components/PortfolioContact";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <PuzzleBackground />
      <div className="relative z-10">
        <PortfolioHero />
        <PortfolioEducation />
        <PortfolioSkills />
        <PortfolioProjects />
        <PortfolioContact />
      </div>
    </div>
  );
};

export default Index;
