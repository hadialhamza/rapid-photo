import React from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";
import { PhotoFormat } from "@/lib/constants/photo-formats";

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
        <p className="text-sm text-muted">
          {selectedFormat.flag} {selectedFormat.country} •{" "}
          {selectedFormat.widthPx}×{selectedFormat.heightPx}px
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
