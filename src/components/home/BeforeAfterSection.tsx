import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CompareSlider } from "@/components/ui/CompareSlider";

export function BeforeAfterSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader
            title="See the difference in seconds"
            description="Our AI automatically crops, aligns, and replaces the background to meet official passport and visa requirements."
          />
        </AnimatedSection>

        <div className="mt-16 mx-auto max-w-4xl">
          <AnimatedSection delay={0.2}>
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-border shadow-2xl bg-surface p-2 sm:p-4">
              <div className="relative rounded-xl overflow-hidden aspect-square sm:aspect-4/3 md:aspect-video">
                <CompareSlider
                  // Demo images: Before is a casual photo, After is a clean studio portrait
                  beforeImage="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                  afterImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
                  className="w-full h-full rounded-xl"
                />
                
                {/* Labels */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-foreground pointer-events-none">
                  Raw Selfie
                </div>
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-primary-foreground pointer-events-none">
                  Processed
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
