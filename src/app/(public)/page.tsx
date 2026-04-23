import Navbar from "@/features/landing/components/Navbar";
import HeroSection from "@/features/landing/components/HeroSection";
import CodexSection from "@/features/landing/components/CodexSection";
import RiteSection from "@/features/landing/components/RiteSection";
import TestimonialSection from "@/features/landing/components/TestimonialSection";
import OathSection from "@/features/landing/components/OathSection";
import Footer from "@/features/landing/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#100f0d] text-[var(--color-parchment)]">
      <Navbar />
      <HeroSection />
      <CodexSection />
      <RiteSection />
      <TestimonialSection />
      <OathSection />
      <Footer />
    </main>
  );
}
