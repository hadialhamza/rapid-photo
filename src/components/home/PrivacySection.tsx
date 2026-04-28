import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Lock, Trash2, Zap, ShieldCheck } from "lucide-react";

export function PrivacySection() {
  const privacyFeatures = [
    {
      title: "100% Local Processing",
      description:
        "Your photos never leave your device. All processing happens right here in your browser.",
      icon: Lock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "No Data Storage",
      description:
        "We don't save, store, or collect your photos on any server. Once you close the tab, everything is gone.",
      icon: Trash2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Instant Processing",
      description:
        "Because there's no server upload, the AI processing is lightning-fast and entirely offline capable.",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <section className="py-24 bg-surface/50 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-success/15 mb-4">
              <ShieldCheck className="w-8 h-8 text-success" />
            </div>
          </div>
          <SectionHeader
            title="Your Privacy is Guaranteed"
            description="Unlike other passport photo tools, we value your privacy. We process your biometric data completely on your device without sending it to the cloud."
          />
        </AnimatedSection>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {privacyFeatures.map((feature, index) => (
            <AnimatedSection
              key={index}
              delay={0.2 + index * 0.1}
              className="relative p-8 rounded-2xl bg-background border border-border text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6 ring-1 ring-inset ring-border">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.6} className="mt-16 max-w-3xl mx-auto">
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6 flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-surface border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted"
                >
                  U{i + 1}
                </div>
              ))}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-foreground font-semibold">
                Trusted by thousands of users
              </p>
              <p className="text-sm text-muted mt-1">
                Join the community who create safe, local passport photos.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
