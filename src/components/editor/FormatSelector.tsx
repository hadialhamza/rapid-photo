"use client";

import { SUPPORTED_FORMATS, PhotoFormat } from "@/lib/constants/photo-formats";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

interface FormatSelectorProps {
  selectedFormatId: string;
  onSelect: (format: PhotoFormat) => void;
  className?: string;
}

export function FormatSelector({
  selectedFormatId,
  onSelect,
  className,
}: FormatSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}>
      {SUPPORTED_FORMATS.map((format) => {
        const isSelected = format.id === selectedFormatId;
        return (
          <button
            key={format.id}
            onClick={() => onSelect(format)}
            className={cn(
              "relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200",
              isSelected
                ? "border-primary bg-primary/10 ring-1 ring-primary/50"
                : "border-border bg-surface hover:border-border-hover hover:bg-elevated",
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
            <div className="relative h-6 w-8 overflow-hidden rounded-sm border border-border/50 shadow-sm mb-1">
              <Image
                src={`https://flagcdn.com/w40/${format.isoCode.toLowerCase()}.png`}
                alt={`${format.country} flag`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {format.country}
            </span>
            <span className="text-xs text-muted">{format.type} Size</span>
            <span className="text-xs text-subtle">
              {format.widthPx} × {format.heightPx} px
            </span>
          </button>
        );
      })}
    </div>
  );
}
