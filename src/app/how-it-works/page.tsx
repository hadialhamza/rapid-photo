import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { 
  Upload, 
  Scan, 
  Scissors, 
  Palette, 
  Download, 
  Printer, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const detailedSteps = [
  {
    number: "01",
    title: "Select Format & Upload",
    description: "Start by selecting your target country and photo type (Passport, Visa, or Stamp). Our system supports 150+ countries. Once selected, drag and drop your photo or browse from your device.",
    icon: Upload,
    color: "text-blue-500",
    details: [
      "Auto-validation of file formats",
      "Support for JPEG, PNG, and WebP",
      "Instant client-side image compression",
      "Real-time preset dimension loading"
    ]
  },
  {
    number: "02",
    title: "AI Face Alignment",
    description: "Our AI immediately analyzes your photo using MediaPipe. It identifies key facial landmarks and calculates the exact tilt and position of your head to ensure it meets biometric standards.",
    icon: Scan,
    color: "text-purple-500",
    details: [
      "Sub-pixel biometric analysis",
      "Automatic head tilt detection",
      "Eye-level horizontal alignment",
      "Shoulder position verification"
    ]
  },
  {
    number: "03",
    title: "Smart Auto-Cropping",
    description: "Based on the official requirements of your selected country, our engine automatically crops the image. It ensures your head takes up the correct percentage of the frame and eyes are at the right height.",
    icon: Scissors,
    color: "text-pink-500",
    details: [
      "Rule-based smart cropping",
      "Aspect ratio locking",
      "Head-to-height ratio adjustment",
      "Manual adjustment tools available"
    ]
  },
  {
    number: "04",
    title: "Background & Enhancements",
    description: "Remove messy backgrounds with one click. Replace them with solid official colors. You can also enable 'Auto-Enhance' to smooth skin and optimize lighting for a professional look.",
    icon: Palette,
    color: "text-amber-500",
    details: [
      "Neural background removal (RMBG-2.0)",
      "Official background color presets",
      "Noiseware-style skin smoothing",
      "Automatic lighting normalization"
    ]
  },
  {
    number: "05",
    title: "Final Review & Download",
    description: "Compare your edited photo with the original using our slider. Once you're satisfied, download your high-quality 300 DPI JPEG file instantly.",
    icon: Download,
    color: "text-emerald-500",
    details: [
      "Interactive before/after slider",
      "DPI metadata injection (300 DPI)",
      "High-quality JPEG export (95% quality)",
      "Instant file generation"
    ]
  },
  {
    number: "06",
    title: "Print-Ready Layout (Optional)",
    description: "Need to print? Add your photo to the Print Cart. You can combine multiple photos on a single A4 page with cutting marks, ready to be printed at home or a local shop.",
    icon: Printer,
    color: "text-cyan-500",
    details: [
      "Multi-photo cart system",
      "Automatic A4 page tiling",
      "Professional cutting marks",
      "Print-ready PDF export"
    ]
  }
];

export default function HowItWorksPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-surface/10">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-6xl mb-6">
              How it <span className="text-primary">Works</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              Transform your ordinary selfie into a professional passport photo in just a few simple steps.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Detailed Steps */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-24">
            {detailedSteps.map((step, index) => (
              <AnimatedSection key={step.number} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
                {/* Visual Part */}
                <div className="flex-1 w-full max-w-md">
                  <div className={`relative aspect-square rounded-3xl bg-surface/50 border border-border flex items-center justify-center group overflow-hidden shadow-2xl`}>
                    <div className={`absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <step.icon className={`w-32 h-32 ${step.color} transition-transform duration-500 group-hover:scale-110`} />
                    <div className="absolute top-6 left-6 text-6xl font-black text-foreground/5 select-none leading-none">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content Part */}
                <div className="flex-1 text-center lg:text-left">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6`}>
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Step {step.number}
                  </div>
                  <h2 className="text-3xl font-bold mb-6 font-heading">{step.title}</h2>
                  <p className="text-lg text-muted mb-8 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3 text-sm text-foreground/80 justify-center lg:justify-start">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-surface/30 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Experience the Magic Yourself</h2>
            <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
              Our intelligent pipeline handles all the hard work while you get the perfect photo in seconds.
            </p>
            <Link href="/editor">
              <Button size="lg" className="px-12 h-14 text-lg font-bold group">
                Try it Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
