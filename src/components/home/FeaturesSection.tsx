"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScanFace, ImageMinus, SunMedium, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Auto Face Detection",
    description: "Powered by MediaPipe to perfectly align your eyes, face, and shoulders to official standards.",
    icon: ScanFace,
    color: "text-blue-400",
    bgColor: "bg-blue-900/30",
  },
  {
    title: "Smart Background Removal",
    description: "Removes messy backgrounds directly in your browser without any paid APIs or watermarks.",
    icon: ImageMinus,
    color: "text-purple-400",
    bgColor: "bg-purple-900/30",
  },
  {
    title: "Perfect Lighting Correction",
    description: "Automatically adjusts brightness and contrast without altering your actual identity or skin.",
    icon: SunMedium,
    color: "text-amber-400",
    bgColor: "bg-amber-900/30",
  },
  {
    title: "100% Private & Local",
    description: "Your photos never leave your device during processing. Fast, deterministic, and secure.",
    icon: ShieldCheck,
    color: "text-green-400",
    bgColor: "bg-green-900/30",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-zinc-900/30 border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need for the perfect photo
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Our intelligent pipeline ensures your photo meets strict government requirements instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-zinc-800 bg-zinc-900/50 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bgColor}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-400">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
