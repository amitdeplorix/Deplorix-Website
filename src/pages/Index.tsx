import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import FYPSection from "@/components/FYPSection";
import WorkflowSection from "@/components/WorkflowSection";
import InternshipSection from "@/components/InternshipSection";
import ProjectsSection from "@/components/ProjectsSection";
import UpcomingProjectsSection from "@/components/UpcomingProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProjectAdvisor from "@/components/ProjectAdvisor";
import StickyContactBar from "@/components/StickyContactBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <WorkflowSection />
        <FYPSection />
        <InternshipSection />
        <UpcomingProjectsSection />
        <ProjectAdvisor />
        <ContactSection />
      </main>
      <Footer />
      <StickyContactBar />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
