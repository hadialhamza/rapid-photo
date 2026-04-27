"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            100% Free & Local Processing
          </motion.div>

          <h1 className="font-heading text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Create Passport-Grade Photos{" "}
            <span className="text-blue-500">Instantly</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
            No ads, no subscriptions, no privacy risks. Just perfectly cropped,
            background-removed photos ready for your visa or passport.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all group"
            >
              <UploadCloud className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
              Upload Photo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg w-full sm:w-auto bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800 hover:text-white"
            >
              View Supported Formats
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Face Detection</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Smart Crop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Auto Retouch</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
