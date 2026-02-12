import { useState } from "react";
import { ChessShaderBackground } from "@/components/ChessShaderBackground";
import { PuzzleBackground } from "@/components/PuzzleBackground";
import { PortfolioHero } from "@/components/PortfolioHero";

const Index = () => {
  const [shaderDone, setShaderDone] = useState(false);

  return (
    <div className="min-h-screen relative bg-black">
      {/* Ocean chess shader plays first */}
      <ChessShaderBackground onFadeComplete={() => setShaderDone(true)} />

      {/* After shader fades to black, puzzle wall + hero fade in */}
      <div
        className="transition-opacity duration-[3000ms] ease-in"
        style={{ opacity: shaderDone ? 1 : 0 }}
      >
        <PuzzleBackground />
        <div className="relative z-10">
          <PortfolioHero />
        </div>
      </div>
    </div>
  );
};

export default Index;
