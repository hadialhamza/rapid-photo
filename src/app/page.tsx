import { HeroSection } from "@/components/home/HeroSection";
import { SupportedFormatsSection } from "@/components/home/SupportedFormatsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { BeforeAfterSection } from "@/components/home/BeforeAfterSection";
import { PrivacySection } from "@/components/home/PrivacySection";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <SupportedFormatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <BeforeAfterSection />
      <PrivacySection />
    </main>
  );
}
