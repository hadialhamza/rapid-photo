import type { Metadata } from "next";
import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read how Rapid Photo handles your data with absolute privacy and secure processing.",
};

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to Rapid Photo. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at hamzaglory@gmail.com.",
    },
    {
      title: "2. Information We Collect",
      content:
        "We collect very minimal information. Since Rapid Photo processes images primarily on your device (client-side), your photos are not permanently stored on our servers. We use temporary secure API routes for background removal and final exporting, but these images are deleted immediately after processing.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "We use the information we collect or receive to: \n- Facilitate the creation of passport and visa photos.\n- Ensure compliance with official document standards.\n- Improve our AI models and user experience.",
    },
    {
      title: "4. Third-Party Services",
      content:
        "We use third-party services like Google MediaPipe for face detection and external APIs for background removal. These services may process your data temporarily according to their own privacy policies.",
    },
    {
      title: "5. Data Security",
      content:
        "We implement a variety of security measures to maintain the safety of your personal information. Your images are transmitted over secure HTTPS connections and are never shared with unauthorized third parties.",
    },
    {
      title: "6. Changes to This Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.",
    },
  ];

  return (
    <main className="flex-1">
      <section className="py-20 bg-surface/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted">Last updated: May 01, 2026</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <AnimatedSection key={section.title} delay={index * 0.1}>
                <h2 className="text-2xl font-bold mb-4 text-foreground">
                  {section.title}
                </h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
