"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface NoisewareToggleProps {
  isSmoothed: boolean;
  onToggle: (state: boolean) => void;
  isProcessing: boolean;
}

export function NoisewareToggle({
  isSmoothed,
  onToggle,
  isProcessing,
}: NoisewareToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-surface transition-all">
      <div className="flex items-center gap-3 pr-4">
        <div className={`p-2 rounded-lg transition-colors ${isSmoothed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <Sparkles className={`h-5 w-5 ${isProcessing ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Smooth Skin</h4>
          <p className="text-xs text-muted-foreground">Remove grain & noise</p>
        </div>
      </div>
      
      {/* Custom Switch Toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={isSmoothed}
        disabled={isProcessing}
        onClick={() => onToggle(!isSmoothed)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          isSmoothed ? 'bg-primary' : 'bg-muted-foreground/30'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isSmoothed ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
