import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { SUPPORTED_FORMATS } from "@/lib/constants/photo-formats";
import { Ruler, Maximize, PaintBucket, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SupportedFormatsSection() {
  return (
    <section id="formats" className="bg-surface/50 py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeader
            title="Global Passport & Visa Formats"
            description="We support official photo requirements for 150+ countries. Instantly crop and adjust to the exact dimensions, resolution, and background color."
          />
        </AnimatedSection>

        <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORTED_FORMATS.map((format, index) => (
            <AnimatedSection key={format.id} delay={index * 0.1}>
              <Link
                href={`/editor?preset=${format.id}`}
                className="block group"
              >
                <Card className="h-full transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(255,49,49,0.1)] group-hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <span className="text-4xl" aria-hidden="true">
                      {format.flag}
                    </span>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                        {format.country}
                      </CardTitle>
                      <p className="text-sm font-medium text-muted mt-1">
                        {format.type}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mt-4 text-sm text-subtle">
                      <div className="flex items-center gap-3">
                        <Ruler className="h-4 w-4 text-primary/70" />
                        <span>
                          {format.dimensionsMm} ({format.dimensionsInches})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Maximize className="h-4 w-4 text-secondary/70" />
                        <span>{format.resolutionPx}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PaintBucket className="h-4 w-4 text-success/70" />
                        <span>{format.bgColor} Background</span>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                      Use this preset <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.6} className="mt-12 text-center">
          <p className="text-muted">
            Can&apos;t find your country? Don&apos;t worry, you can always use
            our custom crop tool in the editor.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
