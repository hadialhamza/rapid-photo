"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import type { PhotoFormat } from "@/lib/constants/photo-formats";

interface BackgroundPickerProps {
  selectedFormat: PhotoFormat;
  currentBgColor: string;
  onBgColorChange: (color: string) => void;
  onRestoreOriginal: () => void;
}

const COLOR_PRESETS = [
  "#FFFFFF", // White
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#22c55e", // Green
  "#000000", // Black
  "#D3D3D3", // Light Grey
];

export function BackgroundPicker({
  selectedFormat,
  currentBgColor,
  onBgColorChange,
  onRestoreOriginal,
}: BackgroundPickerProps) {
  // Ensure the format's default color is always in the presets
  const presets = Array.from(new Set([selectedFormat.defaultBgHex, ...COLOR_PRESETS])).slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Color Presets */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
        {presets.map((color) => (
          <button
            key={color}
            title={color === selectedFormat.defaultBgHex ? "Default" : color}
            className={`relative h-10 w-full rounded-md border-2 transition-all overflow-hidden ${
              currentBgColor === color
                ? "border-primary scale-105 shadow-md z-10"
                : "border-border/50 hover:border-border hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onBgColorChange(color)}
          >
            {color === selectedFormat.defaultBgHex && (
              <span className="absolute bottom-0 right-0 text-[8px] font-bold bg-black/40 text-white px-1 leading-tight rounded-tl-sm">
                DEF
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/50 pt-2">
        <p className="text-[10px] text-muted-foreground">
          Selected:{" "}
          <span className="font-mono uppercase font-bold text-foreground">{currentBgColor}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[10px] px-2"
          onClick={onRestoreOriginal}
        >
          Restore Original
        </Button>
      </div>
    </div>
  );
}
