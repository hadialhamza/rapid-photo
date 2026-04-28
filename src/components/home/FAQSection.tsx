import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Accordion } from "@/components/ui/accordion";
import { FAQ_DATA } from "@/lib/constants/faq-data";

export function FAQSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader
            title="Frequently Asked Questions"
            description="Everything you need to know about creating the perfect passport photo."
          />
        </AnimatedSection>
        
        <div className="mt-16 max-w-3xl mx-auto">
          <AnimatedSection delay={0.2}>
            <Accordion items={FAQ_DATA} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
