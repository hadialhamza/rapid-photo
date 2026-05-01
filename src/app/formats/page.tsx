import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SUPPORTED_FORMATS } from "@/lib/constants/photo-formats";
import { Ruler, Maximize, PaintBucket, ArrowRight, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FormatsPage() {
  return (
    <main className="flex-1">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden border-b border-border bg-surface/10">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="font-heading text-4xl font-extrabold text-foreground sm:text-6xl mb-6">
              Supported <span className="text-primary">Photo Formats</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
              We support official photo requirements for 150+ countries.
              Instantly crop and adjust to the exact dimensions, resolution, and
              background color.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Formats Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SUPPORTED_FORMATS.map((format, index) => (
              <AnimatedSection key={format.id} delay={index * 0.05}>
                <Link
                  href={`/editor?preset=${format.id}`}
                  className="block group"
                >
                  <Card className="h-full transition-all duration-300 border-border/50 bg-surface/30 backdrop-blur-sm hover:border-primary/50 hover:shadow-[0_0_25px_rgba(255,49,49,0.1)] group-hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border/50">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-border/50 shadow-sm">
                        <Image
                          src={`https://flagcdn.com/w80/${format.isoCode.toLowerCase()}.png`}
                          alt={`${format.country} flag`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                          {format.country}
                        </CardTitle>
                        <p className="text-sm font-medium text-muted mt-0.5">
                          {format.type} Size
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-subtle uppercase tracking-wider">
                            <Ruler className="w-3 h-3" />
                            Dimensions
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {format.dimensionsMm}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-subtle uppercase tracking-wider">
                            <Maximize className="w-3 h-3" />
                            Resolution
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {format.resolutionPx}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-subtle uppercase tracking-wider">
                            <PaintBucket className="w-3 h-3" />
                            Background
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            {format.bgColor}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-subtle uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            Quality
                          </div>
                          <div className="text-sm font-medium text-foreground">
                            300 DPI
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center justify-between text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Create Now
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Global Coverage Info */}
      <section className="py-24 bg-surface/20 border-y border-border overflow-hidden relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl font-bold mb-6">Need a Custom Format?</h2>
            <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
              Our editor allows you to manually crop and adjust photos if your
              specific requirement isn&apos;t listed yet. We are constantly
              adding new presets for global standards.
            </p>
            <Link href="/editor">
              <Button
                size="lg"
                variant="outline"
                className="px-10 font-semibold border-primary/20 hover:bg-primary/5"
              >
                Go to Editor
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
