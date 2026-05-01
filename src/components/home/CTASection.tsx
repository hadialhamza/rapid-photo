import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { Button } from "@/components/ui/Button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
        <AnimatedSection>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Ready to create your perfect passport photo?
          </h2>
          <p className="mt-6 text-xl leading-8 text-muted max-w-2xl mx-auto">
            Join thousands of users who have successfully generated their
            official documents in seconds.
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.2}
          className="mt-10 flex flex-col items-center justify-center gap-6"
        >
          <Link href="/editor">
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-6 w-full sm:w-auto"
              icon={<ArrowRight />}
            >
              Get Started Now
            </Button>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-8 text-sm font-medium text-subtle">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>No Sign Up Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-success" />
              <span>Instant Local Processing</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
