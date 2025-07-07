import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Internships } from "@/components/Internships";
import { Education } from "@/components/Education";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* About Section */}
      <div id="about">
        <About />
      </div>
      
      {/* Projects Section */}
      <div id="projects">
        <Projects />
      </div>
      
      {/* Skills Section */}
      <div id="skills">
        <Skills />
      </div>
      
      {/* Experience Section */}
      <div id="experience">
        <Internships />
      </div>
      
      {/* Education Section */}
      <div id="education">
        <Education />
      </div>
      
      {/* Contact Section */}
      <div id="contact">
        <Contact />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;