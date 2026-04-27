import { Upload, Crop, Download } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";

const steps = [
  {
    title: "Upload",
    description:
      "Drag and drop any portrait photo. We accept JPEG and PNG up to 8MB.",
    icon: Upload,
  },
  {
    title: "Auto Adjust",
    description:
      "Our engine automatically detects your face, crops to standard sizes, and removes the background.",
    icon: Crop,
  },
  {
    title: "Download",
    description:
      "Preview the result, pick your background color, and download your print-ready photo.",
    icon: Download,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="How it works"
          description="Get your passport photo in less than a minute."
        />

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border -z-10" />

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <AnimatedSection
                key={index}
                delay={index * 0.2}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-surface border-4 border-border flex items-center justify-center shadow-sm mb-6 relative">
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center border-2 border-background shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 font-heading text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted leading-relaxed">{step.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
