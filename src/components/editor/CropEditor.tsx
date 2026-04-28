"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";
import type { CropArea } from "@/lib/engine/smart-crop";
import { Button } from "@/components/ui/Button";
import { RotateCcw, Check, ZoomIn, ZoomOut, X } from "lucide-react";

interface CropEditorProps {
  imageSrc: string;
  initialCropArea: CropArea;
  aspectRatio: number;
  onCropComplete: (croppedAreaPixels: Area) => void;
  onCancel: () => void;
}

export function CropEditor({
  imageSrc,
  initialCropArea,
  aspectRatio,
  onCropComplete,
  onCancel,
}: CropEditorProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Track initial crop area for "Reset to Auto" feature
  const [initialAreaPixels] = useState<Area>({
    x: initialCropArea.x,
    y: initialCropArea.y,
    width: initialCropArea.width,
    height: initialCropArea.height,
  });

  const onCropChange = useCallback(
    (_croppedArea: Area, croppedAreaPx: Area) => {
      setCroppedAreaPixels(croppedAreaPx);
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  }, [croppedAreaPixels, onCropComplete]);

  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleUseAutoCrop = useCallback(() => {
    onCropComplete(initialAreaPixels);
  }, [initialAreaPixels, onCropComplete]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CropIcon className="h-5 w-5 text-primary" />
          Adjust Crop
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-surface rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-muted" />
        </button>
      </div>

      {/* Crop Container */}
      <div className="relative h-[50vh] min-h-87.5 w-full overflow-hidden rounded-2xl border border-border bg-black shadow-2xl">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropChange}
          cropShape="rect"
          showGrid={true}
          minZoom={0.5}
          maxZoom={5}
          style={{
            containerStyle: {
              backgroundColor: "#000",
            },
            cropAreaStyle: {
              border: "2px solid white",
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.7)",
            },
          }}
        />
      </div>

      {/* Controls */}
      <div className="space-y-4 bg-surface p-4 rounded-xl border border-border">
        <div className="flex items-center gap-4">
          <ZoomOut className="h-4 w-4 text-muted" />
          <input
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <ZoomIn className="h-4 w-4 text-muted" />
          <span className="text-xs font-mono text-muted w-8">
            {zoom.toFixed(1)}x
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Reset
            </Button>
            <Button variant="ghost" size="sm" onClick={handleUseAutoCrop}>
              Use Auto Crop
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={handleConfirm}
            disabled={!croppedAreaPixels}
            icon={<Check className="h-4 w-4" />}
          >
            Confirm Crop
          </Button>
        </div>
      </div>
    </div>
  );
}

// Internal icon for this file
function CropIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2v14a2 2 0 0 0 2 2h14" />
      <path d="M18 22V8a2 2 0 0 0-2-2H2" />
    </svg>
  );
}
