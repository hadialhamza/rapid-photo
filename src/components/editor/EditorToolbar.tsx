import React from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { PhotoFormat } from "@/lib/constants/photo-formats";
import Image from "next/image";

interface EditorToolbarProps {
  selectedFormat: PhotoFormat;
  showStartOver: boolean;
  onStartOver: () => void;
}

export function EditorToolbar({
  selectedFormat,
  showStartOver,
  onStartOver,
}: EditorToolbarProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Photo Editor</h1>
        <p className="text-sm text-muted flex items-center gap-2">
          <span className="relative h-4 w-6 overflow-hidden rounded-sm border border-border/50 shadow-sm inline-block">
            <Image
              src={`https://flagcdn.com/w40/${selectedFormat.isoCode.toLowerCase()}.png`}
              alt={`${selectedFormat.country} flag`}
              fill
              className="object-cover"
              unoptimized
            />
          </span>{" "}
          {selectedFormat.country} • {selectedFormat.widthPx}×{selectedFormat.heightPx}px
        </p>
      </div>
      {showStartOver && (
        <Button
          variant="outline"
          size="sm"
          onClick={onStartOver}
          icon={<RotateCcw className="h-4 w-4" />}
        >
          Start Over
        </Button>
      )}
    </div>
  );
}
