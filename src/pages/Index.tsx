import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Education } from "@/components/Education";
import { Skills } from "@/components/Skills";
import { Philosophy } from "@/components/Philosophy";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ChessShaderBackground } from "@/components/ChessShaderBackground";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Cinematic Chess Shader Background */}
      <ChessShaderBackground />
      
      <Navigation />
      
      {/* Hero */}
      <Hero />
      
      {/* About */}
      <section id="about">
        <About />
      </section>
      
      {/* Education */}
      <section id="education">
        <Education />
      </section>
      
      {/* Skills */}
      <section id="skills">
        <Skills />
      </section>
      
      {/* Philosophy */}
      <Philosophy />
      
      {/* Contact */}
      <section id="contact">
        <Contact />
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
