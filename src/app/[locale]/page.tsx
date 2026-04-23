import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SolutionsSection from "@/components/SolutionsSection";
import EcosystemSection from "@/components/EcosystemSection";
import AppExperienceSection from "@/components/AppExperienceSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <SolutionsSection />
      <EcosystemSection />
      <AppExperienceSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}

