"use client";

import { motion } from "motion/react";
import { Upload, Crop, Download } from "lucide-react";

const steps = [
  {
    title: "Upload",
    description: "Drag and drop any portrait photo. We accept JPEG and PNG up to 8MB.",
    icon: Upload,
  },
  {
    title: "Auto Adjust",
    description: "Our engine automatically detects your face, crops to standard sizes, and removes the background.",
    icon: Crop,
  },
  {
    title: "Download",
    description: "Preview the result, pick your background color, and download your print-ready photo.",
    icon: Download,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Get your passport photo in less than a minute.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-zinc-800 -z-10" />

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center shadow-sm mb-6 relative">
                  <step.icon className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-2 border-zinc-900 shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 font-heading text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
