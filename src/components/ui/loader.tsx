"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

export function Loader({ size = "md", className, text }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)}>
      <div className={cn("relative flex items-center justify-center", sizeClasses[size])}>
        {/* Outer glowing ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-3xl border border-primary/20 bg-primary/5"
        />
        
        {/* Pulsing inner bounding box (face focus area) */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-3 sm:inset-4 rounded-2xl border-2 border-primary/50 border-dashed"
        />

        {/* Scanning laser line */}
        <motion.div
          animate={{ top: ["15%", "85%", "15%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-2 right-2 h-0.5 bg-primary shadow-[0_0_12px_2px_rgba(255,49,49,0.6)] z-10 rounded-full"
        />

        {/* Center Icon (Face/Portrait placeholder) */}
        <User className="w-1/2 h-1/2 text-primary/60 opacity-80" strokeWidth={1.5} />
      </div>

      {text && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2"
        >
          <span className="text-sm font-semibold text-primary tracking-widest uppercase">
            {text}
          </span>
          <span className="flex gap-0.5">
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>.</motion.span>
            <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}>.</motion.span>
          </span>
        </motion.div>
      )}
    </div>
  );
}
