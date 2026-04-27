import { Button } from "@/components/ui/Button";
import { UploadCloud, CheckCircle2, FileImage } from "lucide-react";
import { ParallaxHeroImages } from "@/components/ui/ParallaxHeroImages";
import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";

const parallaxImages = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background pt-24 pb-32">
      <ParallaxHeroImages images={parallaxImages} variant="edge-focus" />
      <div className="absolute inset-0 bg-background/60 z-10 pointer-events-none" />

      <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection className="mx-auto max-w-4xl">
          <AnimatedSection
            delay={0.2}
            className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            100% Free & Local Processing
          </AnimatedSection>

          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Create Passport-Grade Photos{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted max-w-2xl mx-auto">
            No ads, no subscriptions, no privacy risks. Just perfectly cropped,
            background-removed photos ready for your visa or passport.
          </p>

          <AnimatedSection
            delay={0.4}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              variant="default"
              className="text-lg w-full sm:w-auto"
              icon={<UploadCloud />}
            >
              Upload Photo
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg w-full sm:w-auto"
              icon={<FileImage />}
            >
              View Formats
            </Button>
          </AnimatedSection>

          <AnimatedSection
            delay={0.6}
            className="mt-10 flex items-center justify-center gap-x-6 text-sm text-subtle"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Face Detection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Smart Crop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Auto Retouch</span>
            </div>
          </AnimatedSection>
        </AnimatedSection>
      </div>
    </section>
  );
}
