import { PuzzleBackground } from "@/components/PuzzleBackground";
import { PortfolioHero } from "@/components/PortfolioHero";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <PuzzleBackground />
      <div className="relative z-10">
        <PortfolioHero />
      </div>
    </div>
  );
};

export default Index;
