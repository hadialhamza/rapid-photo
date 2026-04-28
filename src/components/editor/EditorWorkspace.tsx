"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { getCroppedImage } from "@/lib/engine/crop-utils";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { UploadZone } from "@/components/editor/UploadZone";
import { FaceOverlay } from "@/components/editor/FaceOverlay";
import { CropEditor } from "@/components/editor/CropEditor";
import {
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Crop as CropIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import type { Area } from "react-easy-crop";

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
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

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

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const runFaceDetection = useCallback(
    async (objectUrl: string) => {
      setStep("detecting");
      setDetectionError(null);
      setFaceResult(null);
      setCropArea(null);
      setCroppedImageUrl(null);

      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = objectUrl;
        });

        if (!isMounted.current) return;

        const size = { width: img.naturalWidth, height: img.naturalHeight };
        setImageSize(size);

        const result = await detectFace(img);
        setFaceResult(result);

        const crop = calculateSmartCrop(
          result,
          selectedFormat,
          size.width,
          size.height,
        );
        setCropArea(crop);

        setStep("upload"); // Success - back to preview to show results
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Detection failed:", err);
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
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);

    setUploadedImageUrl(null);
    setCroppedImageUrl(null);
    setFaceResult(null);
    setCropArea(null);
    setImageSize(null);
    setDetectionError(null);
    setStep("upload");
  }, [uploadedImageUrl, croppedImageUrl]);

  const handleCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!uploadedImageUrl) return;

      setStep("removing-bg"); // Intermediate step for processing

      try {
        const croppedBlob = await getCroppedImage(
          uploadedImageUrl,
          croppedAreaPixels,
        );
        const url = URL.createObjectURL(croppedBlob);

        if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);

        setCroppedImageUrl(url);
        setStep("upload"); // Go back to show the result
      } catch (err) {
        console.error("Cropping failed:", err);
        setStep("cropping");
      }
    },
    [uploadedImageUrl, croppedImageUrl],
  );

  return (
    <div className="min-h-[80vh] w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Photo Editor</h1>
            <p className="text-sm text-muted">
              {selectedFormat.flag} {selectedFormat.country} •{" "}
              {selectedFormat.widthPx}x{selectedFormat.heightPx}px
            </p>
          </div>
          {uploadedImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartOver}
              icon={<RotateCcw className="h-4 w-4" />}
            >
              Start Over
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-semibold uppercase text-muted mb-3">
                Target Format
              </h3>
              <FormatSelector
                selectedFormatId={selectedFormat.id}
                onSelect={setSelectedFormat}
              />
            </section>
          </div>

          {/* Editor Main */}
          <div className="lg:col-span-2">
            {!uploadedImageUrl ? (
              <UploadZone
                onImageLoaded={handleImageLoaded}
                className="min-h-100"
              />
            ) : (
              <div className="space-y-6">
                {step === "cropping" && imageSize && cropArea ? (
                  <CropEditor
                    imageSrc={uploadedImageUrl}
                    imageWidth={imageSize.width}
                    imageHeight={imageSize.height}
                    initialCropArea={cropArea}
                    aspectRatio={selectedFormat.aspectRatio}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setStep("upload")}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Preview Box */}
                    <div className="relative aspect-4/3 w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-inner">
                      <Image
                        src={croppedImageUrl || uploadedImageUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                        priority
                      />

                      {/* Face Overlay (only on original) */}
                      {!croppedImageUrl &&
                        faceResult &&
                        cropArea &&
                        imageSize && (
                          <FaceOverlay
                            faceResult={faceResult}
                            cropArea={cropArea}
                            imageWidth={imageSize.width}
                            imageHeight={imageSize.height}
                          />
                        )}

                      {/* Overlays for processing states */}
                      {(step === "detecting" || step === "removing-bg") && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm transition-all">
                          <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
                          <p className="font-medium">
                            {step === "detecting"
                              ? "Detecting face..."
                              : "Processing crop..."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Result Alerts */}
                    {detectionError && (
                      <div className="p-4 rounded-xl border border-error/20 bg-error/5 flex gap-3 text-error text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{detectionError}</p>
                      </div>
                    )}

                    {faceResult && !croppedImageUrl && (
                      <div className="p-4 rounded-xl border border-success/20 bg-success/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium text-sm">
                            Face detected successfully (
                            {Math.round(faceResult.confidence * 100)}%)
                          </span>
                        </div>
                        <Button
                          variant="default"
                          size="lg"
                          className="self-start"
                          onClick={() => setStep("cropping")}
                          icon={<CropIcon className="h-4 w-4" />}
                        >
                          Manual Adjust
                        </Button>
                      </div>
                    )}

                    {croppedImageUrl && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium text-sm">
                            Custom crop applied
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="self-start"
                          onClick={() => setStep("cropping")}
                          icon={<CropIcon className="h-4 w-4" />}
                        >
                          Adjust Again
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStartOver}
                  icon={<ArrowLeft className="h-4 w-4" />}
                >
                  Upload different photo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
