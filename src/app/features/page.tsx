import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { 
  ScanFace, 
  ImageMinus, 
  Sparkles, 
  Printer, 
  ShieldCheck, 
  Ruler, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const detailedFeatures = [
  {
    title: "AI Face Detection & Alignment",
    description: "Our advanced engine powered by Google's MediaPipe technology automatically detects facial landmarks with sub-pixel precision. It identifies your eyes, nose, and shoulders to ensure your photo perfectly aligns with strict international standards.",
    icon: ScanFace,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    points: [
      "Sub-pixel landmark detection",
      "Automatic eye-level alignment",
      "Shoulder position verification",
      "Face tilt correction"
    ]
  },
  {
    title: "Smart Auto-Crop Engine",
    description: "Forget manual resizing. Our rule-based cropping algorithm ensures your face occupies exactly 60-70% of the photo height, with eyes positioned at the 55-60% vertical line — exactly as required by government agencies.",
    icon: Ruler,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    points: [
      "Rule-based precise cropping",
      "Aspect ratio preservation",
      "Head-to-height ratio locking",
      "Center-aligned framing"
    ]
  },
  {
    title: "Intelligent Background Removal",
    description: "Remove messy backgrounds instantly. Using the state-of-the-art RMBG-2.0 model, we extract the subject with soft-edge feathering to avoid the 'stuck-on' look. Replace it with any official color like White, Blue, or Grey.",
    icon: ImageMinus,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    points: [
      "Neural network background extraction",
      "Alpha channel edge feathering",
      "Official background color presets",
      "Custom color support"
    ]
  },
  {
    title: "Professional Studio Enhancement",
    description: "Get a studio-quality look without expensive equipment. Our auto-lighting correction balances exposure, while our subtle skin smoothing reduces noise and imperfections without altering your natural identity.",
    icon: Sparkles,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    points: [
      "Automatic exposure balancing",
      "Noise reduction (Noiseware-style)",
      "Natural skin texture preservation",
      "Contrast & Gamma optimization"
    ]
  },
  {
    title: "Print-Ready A4 PDF Layouts",
    description: "The only tool you need for physical printing. Add multiple edited photos to your cart and generate a perfectly aligned A4 PDF. We include automatic cutting marks and 3mm spacing for professional results at home.",
    icon: Printer,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    points: [
      "A4 Page auto-tiling",
      "Professional cutting marks",
      "High-resolution 300 DPI PDF",
      "Multiple format support in one page"
    ]
  },
  {
    title: "Privacy & Speed Focused",
    description: "Your security is our priority. All processing happens either in your browser or through secure, encrypted API routes. We never store your personal photos on our servers permanently.",
    icon: ShieldCheck,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    points: [
      "Encrypted data transmission",
      "No permanent image storage",
      "Deterministic local processing",
      "Secure API architecture"
    ]
  }
];

export default function FeaturesPage() {
  return (
    <main className="flex-1">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-6xl mb-6">
              Advanced <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Photography Engine</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              Explore the cutting-edge technology behind Rapid Photo that ensures your passport and visa photos are perfect every time.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/editor">
                <Button size="lg" className="font-semibold">Get Started Now</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Detailed Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {detailedFeatures.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <Card className="h-full border-border/50 bg-surface/30 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                  <CardHeader className="flex flex-row items-start gap-5 p-8 pb-4">
                    <div className={`p-4 rounded-2xl ${feature.bgColor} ${feature.color}`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold mb-2">{feature.title}</CardTitle>
                      <p className="text-muted leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {feature.points.map((point) => (
                        <div key={point} className="flex items-center gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Tech Stack Section */}
      <section className="py-20 bg-surface/20 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedSection delay={0.1}>
              <div className="text-4xl font-bold text-primary mb-2">300+</div>
              <div className="text-sm text-muted">DPI Quality</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-sm text-muted">Country Formats</div>
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <div className="text-4xl font-bold text-primary mb-2">&lt; 1s</div>
              <div className="text-sm text-muted">Detection Speed</div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted">Privacy Focused</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-3xl p-12 text-center border border-primary/20">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience the Power?</h2>
            <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
              Join thousands of users who have saved time and money using our advanced AI-powered photo engine.
            </p>
            <Link href="/editor">
              <Button size="lg" className="px-10 h-14 text-lg font-bold">Start Editing</Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
