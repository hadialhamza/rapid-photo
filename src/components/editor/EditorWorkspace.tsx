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
import { cropAndResizeToTarget } from "@/lib/engine/crop-utils";
import { refineEdges } from "@/lib/engine/edge-refiner";
import { replaceBackground } from "@/lib/engine/bg-replacer";
import { removeBackground } from "@/lib/engine/bg-removal-client";
import { FormatSelector } from "@/components/editor/FormatSelector";
import { UploadZone } from "@/components/editor/UploadZone";
import { FaceOverlay } from "@/components/editor/FaceOverlay";
import { CropEditor } from "@/components/editor/CropEditor";
import { BackgroundPicker } from "@/components/editor/BackgroundPicker";
import {
  ArrowLeft,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Crop as CropIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import type { Area } from "react-easy-crop";

// ─── Types ───────────────────────────────────────────────────
export type EditorStep =
  | "upload"
  | "detecting"
  | "cropping"
  | "processing-crop"
  | "removing-bg"
  | "preview"
  | "export";

interface EditorWorkspaceProps {
  initialPresetId?: string;
}

// ─── Loading Messages for BG Removal ────────────────────────
const LOADING_MESSAGES = [
  "Analyzing image composition...",
  "Identifying subject boundaries...",
  "Separating foreground elements...",
  "Refining edge details...",
  "Applying precision masking...",
  "Generating transparent output...",
  "Optimizing image quality...",
  "Almost there...",
];

// ─── Component ───────────────────────────────────────────────
export function EditorWorkspace({ initialPresetId }: EditorWorkspaceProps) {
  const [selectedFormat, setSelectedFormat] = useState<PhotoFormat>(
    getFormatById(initialPresetId ?? "") ?? SUPPORTED_FORMATS[0],
  );
  const [step, setStep] = useState<EditorStep>("upload");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  // Phase 2 state (Face Detection)
  const [faceResult, setFaceResult] = useState<FaceDetectionResult | null>(
    null,
  );
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  // Phase 4 state (Background Removal — HF API)
  const [isBgRemoved, setIsBgRemoved] = useState(false);
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [transparentBlob, setTransparentBlob] = useState<Blob | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [bgProcessing, setBgProcessing] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const isMounted = useRef(false);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, []);

  // ─── Loading Message Cycler ──────────────────────────────
  const startLoadingMessages = useCallback(() => {
    setLoadingMsgIndex(0);
    loadingTimerRef.current = setInterval(() => {
      setLoadingMsgIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev,
      );
    }, 3000);
  }, []);

  const stopLoadingMessages = useCallback(() => {
    if (loadingTimerRef.current) {
      clearInterval(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  // ─── Face Detection ──────────────────────────────────────
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

        setStep("upload"); // Back to preview to show detection results
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

  // ─── Image Upload Handler ────────────────────────────────
  const handleImageLoaded = useCallback(
    (_file: File, objectUrl: string) => {
      setUploadedImageUrl(objectUrl);
      runFaceDetection(objectUrl);
    },
    [runFaceDetection],
  );

  // ─── Start Over ──────────────────────────────────────────
  const handleStartOver = useCallback(() => {
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);

    setUploadedImageUrl(null);
    setCroppedImageUrl(null);
    setTransparentBlob(null);
    setFinalImageUrl(null);
    setFaceResult(null);
    setCropArea(null);
    setImageSize(null);
    setDetectionError(null);
    setIsBgRemoved(false);
    setBgColor("#FFFFFF");
    setStep("upload");
  }, [uploadedImageUrl, croppedImageUrl, finalImageUrl]);

  // ─── Crop Complete Handler ───────────────────────────────
  const handleCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!uploadedImageUrl) return;

      setStep("processing-crop");
      setDetectionError(null);

      try {
        // Crop AND resize to the target format dimensions
        const croppedBlob = await cropAndResizeToTarget(
          uploadedImageUrl,
          croppedAreaPixels,
          selectedFormat.widthPx,
          selectedFormat.heightPx,
        );
        const url = URL.createObjectURL(croppedBlob);

        if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);

        // Reset bg state when re-cropping
        setTransparentBlob(null);
        setIsBgRemoved(false);
        if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
        setFinalImageUrl(null);

        setCroppedImageUrl(url);
        setStep("upload"); // Back to preview
      } catch (err) {
        console.error("Cropping failed:", err);
        setDetectionError("Failed to crop image. Please try again.");
        setStep("cropping");
      }
    },
    [uploadedImageUrl, croppedImageUrl, finalImageUrl, selectedFormat],
  );

  // ─── Background Removal (HF API) ────────────────────────
  const handleRemoveBg = useCallback(async () => {
    if (!croppedImageUrl) return;

    setBgProcessing(true);
    setDetectionError(null);
    startLoadingMessages();

    try {
      // Fetch the cropped image as blob
      const croppedResponse = await fetch(croppedImageUrl);
      const croppedBlob = await croppedResponse.blob();

      // Call server API → remove.bg
      const transparentResult = await removeBackground(croppedBlob);

      if (!isMounted.current) return;

      // Refine edges
      const refinedResult = await refineEdges(transparentResult);

      // Cache transparent blob for color changes
      setTransparentBlob(refinedResult);
      setIsBgRemoved(true);

      // Apply default background color
      const composited = await replaceBackground(
        refinedResult,
        bgColor,
        selectedFormat.widthPx,
        selectedFormat.heightPx,
      );

      if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
      setFinalImageUrl(URL.createObjectURL(composited));
    } catch (err: unknown) {
      console.error("Background removal failed:", err);
      const message =
        err instanceof Error ? err.message : "Background removal failed.";
      setDetectionError(message);
    } finally {
      setBgProcessing(false);
      stopLoadingMessages();
    }
  }, [
    croppedImageUrl,
    bgColor,
    selectedFormat,
    finalImageUrl,
    startLoadingMessages,
    stopLoadingMessages,
  ]);

  // ─── Background Color Change ─────────────────────────────
  const handleBgColorChange = useCallback(
    async (color: string) => {
      setBgColor(color);

      if (!transparentBlob) return;

      try {
        const composited = await replaceBackground(
          transparentBlob,
          color,
          selectedFormat.widthPx,
          selectedFormat.heightPx,
        );

        if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
        setFinalImageUrl(URL.createObjectURL(composited));
      } catch (err) {
        console.error("Failed to apply background color:", err);
      }
    },
    [transparentBlob, selectedFormat, finalImageUrl],
  );

  // ─── Restore Original Background ────────────────────────
  const handleRestoreOriginal = useCallback(() => {
    setIsBgRemoved(false);
    setTransparentBlob(null);
    if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
    setFinalImageUrl(null);
  }, [finalImageUrl]);

  // ─── Determine preview image ─────────────────────────────
  const previewSrc = finalImageUrl || croppedImageUrl || uploadedImageUrl;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Photo Editor</h1>
            <p className="text-sm text-muted">
              {selectedFormat.flag} {selectedFormat.country} •{" "}
              {selectedFormat.widthPx}×{selectedFormat.heightPx}px
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
          {/* ─── Sidebar ──────────────────────────────────── */}
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

            {/* Background Settings — shown after crop */}
            {croppedImageUrl && (
              <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase text-muted">
                    Background
                  </h3>
                  {isBgRemoved && (
                    <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className="space-y-4 rounded-xl border border-border bg-surface p-4">
                  {!isBgRemoved ? (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={handleRemoveBg}
                      disabled={bgProcessing}
                      icon={<Sparkles className="h-4 w-4" />}
                    >
                      Remove Background
                    </Button>
                  ) : (
                    <BackgroundPicker
                      selectedFormat={selectedFormat}
                      currentBgColor={bgColor}
                      onBgColorChange={handleBgColorChange}
                      onRestoreOriginal={handleRestoreOriginal}
                    />
                  )}
                </div>
              </section>
            )}
          </div>

          {/* ─── Editor Main ──────────────────────────────── */}
          <div className="lg:col-span-2">
            {!uploadedImageUrl ? (
              <UploadZone
                onImageLoaded={handleImageLoaded}
                className="min-h-100"
              />
            ) : (
              <div className="space-y-6">
                {/* ─── Crop Mode ──────────────────────────── */}
                {step === "cropping" && cropArea ? (
                  <CropEditor
                    imageSrc={uploadedImageUrl}
                    initialCropArea={cropArea}
                    aspectRatio={selectedFormat.aspectRatio}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setStep("upload")}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* ─── Preview Box ──────────────────── */}
                    <div className="relative aspect-4/3 w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-inner">
                      {previewSrc && (
                        <Image
                          src={previewSrc}
                          alt="Preview"
                          fill
                          className="object-contain"
                          unoptimized
                          priority
                        />
                      )}

                      {/* Face Overlay (only on original image) */}
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

                      {/* ─── Loading Overlays ────────────── */}
                      {step === "detecting" && (
                        <LoadingOverlay message="Detecting face..." />
                      )}

                      {step === "processing-crop" && (
                        <LoadingOverlay message="Resizing to target dimensions..." />
                      )}

                      {bgProcessing && (
                        <LoadingOverlay
                          message={LOADING_MESSAGES[loadingMsgIndex]}
                          showPulse
                        />
                      )}
                    </div>

                    {/* ─── Result Alerts ──────────────────── */}
                    {detectionError && (
                      <div className="p-4 rounded-xl border border-error/20 bg-error/5 flex gap-3 text-error text-sm">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{detectionError}</p>
                      </div>
                    )}

                    {/* Face detected — show manual adjust button */}
                    {faceResult && !croppedImageUrl && (
                      <div className="p-4 rounded-xl border border-success/20 bg-success/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-success">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium text-sm">
                            Face detected successfully (
                            {Math.round(faceResult.confidence * 100)}%)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="lg"
                            onClick={() => {
                              // Auto crop with smart-crop area directly
                              if (cropArea) {
                                handleCropComplete({
                                  x: cropArea.x,
                                  y: cropArea.y,
                                  width: cropArea.width,
                                  height: cropArea.height,
                                });
                              }
                            }}
                            icon={<CheckCircle2 className="h-4 w-4" />}
                          >
                            Auto Crop
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setStep("cropping")}
                            icon={<CropIcon className="h-4 w-4" />}
                          >
                            Manual Adjust
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Crop applied — show bg removal option */}
                    {croppedImageUrl && !bgProcessing && (
                      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium text-sm">
                            {isBgRemoved
                              ? "Background removed & replaced"
                              : `Cropped to ${selectedFormat.widthPx}×${selectedFormat.heightPx}px`}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStep("cropping")}
                            icon={<CropIcon className="h-4 w-4" />}
                          >
                            Adjust Crop
                          </Button>
                        </div>
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

// ─── Loading Overlay Sub-Component ───────────────────────────
function LoadingOverlay({
  message,
  showPulse = false,
}: {
  message: string;
  showPulse?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/70 backdrop-blur-md transition-all">
      {/* Animated spinner */}
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        {showPulse && (
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary/10 animate-ping" />
        )}
      </div>

      {/* Message with fade transition */}
      <p className="font-medium text-sm text-foreground animate-in fade-in duration-500 text-center px-4">
        {message}
      </p>
      <p className="text-xs text-muted mt-2">Please wait...</p>
    </div>
  );
}
