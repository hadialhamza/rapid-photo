import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { ScanFace, ImageMinus, Sparkles, Printer } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";

const features = [
  {
    title: "Auto Face Detection",
    description:
      "Powered by MediaPipe to perfectly align your eyes, face, and shoulders to official standards.",
    icon: ScanFace,
    color: "text-primary",
    bgColor: "bg-primary/15",
  },
  {
    title: "Smart Background Removal",
    description:
      "Removes messy backgrounds directly in your browser without any paid APIs or watermarks.",
    icon: ImageMinus,
    color: "text-secondary",
    bgColor: "bg-secondary/15",
  },
  {
    title: "Premium Skin & Lighting",
    description:
      "Advanced Noiseware-style smoothing and auto-lighting for a professional studio look.",
    icon: Sparkles,
    color: "text-warning",
    bgColor: "bg-warning/15",
  },
  {
    title: "Print-Ready A4 Layout",
    description:
      "Arrange multiple photos in a single A4 PDF with automatic cutting marks and 300 DPI.",
    icon: Printer,
    color: "text-success",
    bgColor: "bg-success/15",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 bg-surface/30 border-y border-border"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Everything you need for the perfect photo"
          description="Our intelligent pipeline ensures your photo meets strict government requirements instantly."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 0.1}>
              <Card className="h-full border-border bg-surface/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bgColor}`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
