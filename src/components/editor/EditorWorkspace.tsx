"use client";

import React, { useState, useCallback } from "react";
import {
  PhotoFormat,
  SUPPORTED_FORMATS,
  getFormatById,
} from "@/lib/constants/photo-formats";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { UploadZone } from "@/components/editor/UploadZone";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export type EditorStep =
  | "upload"
  | "detecting"
  | "cropping"
  | "removing-bg"
  | "replacing-bg"
  | "enhancing"
  | "preview"
  | "export";

interface EditorWorkspaceProps {
  initialPresetId?: string;
}

export function EditorWorkspace({ initialPresetId }: EditorWorkspaceProps) {
  const [selectedFormat, setSelectedFormat] = useState<PhotoFormat>(
    getFormatById(initialPresetId ?? "") ?? SUPPORTED_FORMATS[0],
  );
  const [step, setStep] = useState<EditorStep>("upload");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageLoaded = useCallback((_file: File, objectUrl: string) => {
    setUploadedImageUrl(objectUrl);
    // In future phases, this will trigger face detection (step → "detecting")
    // For now, Phase 1 just shows the uploaded image preview
  }, []);

  const handleStartOver = useCallback(() => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
    setStep("upload");
  }, [uploadedImageUrl]);

  return (
    <div className="min-h-[80vh] w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Photo Editor
            </h1>
            <p className="mt-1 text-sm text-muted">
              Selected: {selectedFormat.flag} {selectedFormat.country} —{" "}
              {selectedFormat.type} ({selectedFormat.widthPx} ×{" "}
              {selectedFormat.heightPx} px)
            </p>
          </div>

          {uploadedImageUrl && (
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="h-4 w-4" />}
              onClick={handleStartOver}
            >
              Start Over
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">
                Photo Format
              </h3>
              <FormatSelector
                selectedFormatId={selectedFormat.id}
                onSelect={setSelectedFormat}
              />
            </div>
          </div>

          {/* Right Panel: Upload / Preview */}
          <div className="lg:col-span-2">
            {!uploadedImageUrl ? (
              <UploadZone onImageLoaded={handleImageLoaded} />
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded photo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Placeholder for future steps */}
                <div className="rounded-xl border border-border bg-surface/50 p-6 text-center">
                  <p className="text-sm text-muted">
                    ✅ Photo uploaded successfully. Next steps (face detection,
                    cropping, background removal) will be implemented in
                    upcoming phases.
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ArrowLeft className="h-4 w-4" />}
                  onClick={handleStartOver}
                >
                  Upload a different photo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
