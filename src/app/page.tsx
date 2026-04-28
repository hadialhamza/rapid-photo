import { HeroSection } from "@/components/home/HeroSection";
import { SupportedFormatsSection } from "@/components/home/SupportedFormatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <SupportedFormatsSection />
      <HowItWorksSection />
      <FeaturesSection />
    </main>
  );
}
