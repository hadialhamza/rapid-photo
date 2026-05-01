import type { Metadata } from "next";
import { AnimatedSection } from "@/components/ui/animated/AnimatedSection";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for using the Rapid Photo platform.",
};

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Rapid Photo, you accept and agree to be bound by the terms and provision of this agreement.",
    },
    {
      title: "2. Description of Service",
      content:
        "Rapid Photo provides users with tools to create, edit, and format passport and visa photos according to international standards. The service is provided 'as is' and we are not responsible for any document rejections by official authorities.",
    },
    {
      title: "3. User Responsibilities",
      content:
        "You are responsible for ensuring that the photos you upload are authentic and meet the legal requirements of the country you are applying for. You agree not to use the service for any fraudulent or illegal purposes.",
    },
    {
      title: "4. Intellectual Property",
      content:
        "All content, logos, and software used in Rapid Photo are the property of MD HADI AL HAMZA and are protected by international copyright laws.",
    },
    {
      title: "5. Limitation of Liability",
      content:
        "Rapid Photo shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.",
    },
    {
      title: "6. Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of Bangladesh.",
    },
  ];

  return (
    <main className="flex-1">
      <section className="py-20 bg-surface/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl font-extrabold sm:text-5xl mb-6">
              Terms & Conditions
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
