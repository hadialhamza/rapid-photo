"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  PhotoFormat,
  SUPPORTED_FORMATS,
  getFormatById,
} from "@/lib/constants/photo-formats";
import {
  detectFace,
  FaceDetectionError,
  type FaceDetectionResult,
} from "@/lib/engine/face-detector";
import { calculateSmartCrop, type CropArea } from "@/lib/engine/smart-crop";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { UploadZone } from "@/components/editor/UploadZone";
import { FaceOverlay } from "@/components/editor/FaceOverlay";
import { ArrowLeft, RotateCcw, AlertCircle, Loader2 } from "lucide-react";
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

  // Phase 2 state
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(
    null,
  );
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const hiddenImgRef = useRef<HTMLImageElement | null>(null);

  const runFaceDetection = useCallback(
    async (objectUrl: string) => {
      setStep("detecting");
      setDetectionError(null);
      setFaceResult(null);
      setCropArea(null);

      try {
        // Load image into a plain HTMLImageElement for MediaPipe
        const img = document.createElement("img");
        img.crossOrigin = "anonymous";
        hiddenImgRef.current = img;

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = objectUrl;
        });

        const size = { width: img.naturalWidth, height: img.naturalHeight };
        setImageSize(size);

        // Run face detection
        const result = await detectFace(img);
        setFaceResult(result);

        // Calculate smart crop
        const crop = calculateSmartCrop(
          result,
          selectedFormat,
          size.width,
          size.height,
        );
        setCropArea(crop);

        // Move to cropping step (Phase 3 will handle the crop UI)
        setStep("cropping");
      } catch (err) {
        if (err instanceof FaceDetectionError) {
          setDetectionError(err.message);
        } else {
          setDetectionError(
            "An unexpected error occurred during face detection.",
          );
        }
        setStep("upload");
      }
    },
    [selectedFormat],
  );

  const handleImageLoaded = useCallback(
    (_file: File, objectUrl: string) => {
      setUploadedImageUrl(objectUrl);
      runFaceDetection(objectUrl);
    },
    [runFaceDetection],
  );

  const handleStartOver = useCallback(() => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
    setFaceResult(null);
    setCropArea(null);
    setImageSize(null);
    setDetectionError(null);
    setStep("upload");
  }, [uploadedImageUrl]);

  const handleRetryDetection = useCallback(() => {
    if (uploadedImageUrl) {
      runFaceDetection(uploadedImageUrl);
    }
  }, [uploadedImageUrl, runFaceDetection]);

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
              <div className="space-y-4">
                <UploadZone onImageLoaded={handleImageLoaded} />

                {/* Detection error (shown after Start Over) */}
                {detectionError && (
                  <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p>{detectionError}</p>
                      <p className="mt-1 text-xs text-error/70">
                        Try uploading a different photo.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview with Face Overlay */}
                <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="relative aspect-4/3 w-full">
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded photo"
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      unoptimized
                    />

                    {/* Face detection overlay */}
                    {faceResult && cropArea && imageSize && (
                      <FaceOverlay
                        faceResult={faceResult}
                        cropArea={cropArea}
                        imageWidth={imageSize.width}
                        imageHeight={imageSize.height}
                      />
                    )}

                    {/* Detecting state overlay */}
                    {step === "detecting" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-foreground">
                          Detecting face...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detection result info */}
                {faceResult && (
                  <div className="rounded-xl border border-success/30 bg-success/10 p-4">
                    <p className="text-sm font-medium text-success">
                      ✅ Face detected with{" "}
                      {Math.round(faceResult.confidence * 100)}% confidence
                    </p>
                    {cropArea && (
                      <p className="mt-1 text-xs text-success/70">
                        Smart crop calculated: {cropArea.width} ×{" "}
                        {cropArea.height} px at ({cropArea.x}, {cropArea.y})
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted">
                      Next steps (manual crop adjustment, background removal)
                      will be implemented in upcoming phases.
                    </p>
                  </div>
                )}

                {/* Detection error (shown with image still visible) */}
                {detectionError && step !== "detecting" && (
                  <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="flex-1">
                      <p>{detectionError}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-error hover:text-error"
                        onClick={handleRetryDetection}
                      >
                        Retry Detection
                      </Button>
                    </div>
                  </div>
                )}

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
