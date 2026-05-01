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
import { UploadZone } from "@/components/editor/UploadZone";
import { FaceOverlay } from "@/components/editor/FaceOverlay";
import { CropEditor } from "@/components/editor/CropEditor";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorSidebar } from "@/components/editor/EditorSidebar";
import { FinalPreview } from "@/components/editor/FinalPreview";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { enhanceLighting } from "@/lib/engine/lighting-corrector";
import { applyNoisewareFilter } from "@/lib/engine/noiseware-filter";
import {
  ArrowLeft,
  CheckCircle2,
  Crop as CropIcon,
  AlertCircle,
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
  const [unenhancedImageUrl, setUnenhancedImageUrl] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [bgProcessing, setBgProcessing] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Phase 6 state (Auto Lighting Correction)
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Phase 9 state (Noiseware Filter)
  const [isSmoothed, setIsSmoothed] = useState(false);
  const [isSmoothing, setIsSmoothing] = useState(false);

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
    if (unenhancedImageUrl) URL.revokeObjectURL(unenhancedImageUrl);
    if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);

    setUploadedImageUrl(null);
    setCroppedImageUrl(null);
    setTransparentBlob(null);
    setUnenhancedImageUrl(null);
    setFinalImageUrl(null);
    setFaceResult(null);
    setCropArea(null);
    setImageSize(null);
    setDetectionError(null);
    setIsBgRemoved(false);
    setBgColor("#FFFFFF");
    setIsEnhanced(false);
    setIsSmoothed(false);
    setStep("upload");
  }, [uploadedImageUrl, croppedImageUrl, unenhancedImageUrl, finalImageUrl]);

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

        if (unenhancedImageUrl) URL.revokeObjectURL(unenhancedImageUrl);
        if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
        setUnenhancedImageUrl(null);
        setFinalImageUrl(null);
        setIsEnhanced(false);
        setIsSmoothed(false);

        setCroppedImageUrl(url);
        setStep("upload"); // Back to preview
      } catch (err) {
        console.error("Cropping failed:", err);
        setDetectionError("Failed to crop image. Please try again.");
        setStep("cropping");
      }
    },
    [uploadedImageUrl, croppedImageUrl, unenhancedImageUrl, finalImageUrl, selectedFormat],
  );

  // Helper to apply enhancement state
  const applyFilters = useCallback(async (baseBlob: Blob, enhancedState: boolean, smoothedState: boolean) => {
    setIsEnhancing(true);
    try {
      let currentBlob = baseBlob;
      if (enhancedState) {
        currentBlob = await enhanceLighting(currentBlob);
      }
      if (smoothedState) {
        setIsSmoothing(true);
        currentBlob = await applyNoisewareFilter(currentBlob);
        setIsSmoothing(false);
      }
      setFinalImageUrl(URL.createObjectURL(currentBlob));
    } catch (err) {
      console.error("Filter pipeline failed:", err);
      setDetectionError("Failed to apply filters. Showing original.");
      setFinalImageUrl(URL.createObjectURL(baseBlob));
      setIsSmoothing(false);
    } finally {
      setIsEnhancing(false);
    }
  }, []);

  const updateFinalImage = useCallback(async (baseBlob: Blob, enhancedState: boolean, smoothedState: boolean) => {
    const baseUrl = URL.createObjectURL(baseBlob);
    
    // Revoke old unenhanced image if it's different from the new one
    setUnenhancedImageUrl(baseUrl);

    if (enhancedState || smoothedState) {
      await applyFilters(baseBlob, enhancedState, smoothedState);
    } else {
      setFinalImageUrl(baseUrl);
    }
  }, [applyFilters]);

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

      await updateFinalImage(composited, isEnhanced, isSmoothed);
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
    startLoadingMessages,
    stopLoadingMessages,
    isEnhanced,
    isSmoothed,
    updateFinalImage,
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

        await updateFinalImage(composited, isEnhanced, isSmoothed);
      } catch (err) {
        console.error("Failed to apply background color:", err);
      }
    },
    [transparentBlob, selectedFormat, isEnhanced, isSmoothed, updateFinalImage],
  );

  // ─── Restore Original Background ────────────────────────
  const handleRestoreOriginal = useCallback(() => {
    setIsBgRemoved(false);
    setTransparentBlob(null);
    setUnenhancedImageUrl(null);
    setFinalImageUrl(null);
  }, []);

  // ─── Toggle Filters ───────────────────────────────────────
  const applyFiltersFromUrl = useCallback(async (enhancedState: boolean, smoothedState: boolean) => {
    const sourceUrl = unenhancedImageUrl || croppedImageUrl;
    if (!sourceUrl) return;

    if (!enhancedState && !smoothedState) {
      setFinalImageUrl(sourceUrl);
      return;
    }

    setIsEnhancing(true);
    setDetectionError(null);
    try {
      const response = await fetch(sourceUrl);
      const blob = await response.blob();
      
      let currentBlob = blob;
      if (enhancedState) {
        currentBlob = await enhanceLighting(currentBlob);
      }
      if (smoothedState) {
        setIsSmoothing(true);
        currentBlob = await applyNoisewareFilter(currentBlob);
        setIsSmoothing(false);
      }
      setFinalImageUrl(URL.createObjectURL(currentBlob));
    } catch (err) {
      console.error("Enhancement failed:", err);
      setDetectionError("Failed to apply filters.");
      setIsSmoothing(false);
    } finally {
      setIsEnhancing(false);
    }
  }, [unenhancedImageUrl, croppedImageUrl]);

  const handleToggleEnhance = useCallback(async (state: boolean) => {
    setIsEnhanced(state);
    await applyFiltersFromUrl(state, isSmoothed);
  }, [applyFiltersFromUrl, isSmoothed]);

  const handleToggleSmooth = useCallback(async (state: boolean) => {
    setIsSmoothed(state);
    await applyFiltersFromUrl(isEnhanced, state);
  }, [applyFiltersFromUrl, isEnhanced]);

  // ─── Determine preview image ─────────────────────────────
  const previewSrc = finalImageUrl || croppedImageUrl || uploadedImageUrl;

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="min-h-[80vh] w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {!step.includes("export") && (
          <EditorToolbar
            selectedFormat={selectedFormat}
            showStartOver={!!uploadedImageUrl}
            onStartOver={handleStartOver}
          />
        )}

        {step === "export" && previewSrc && uploadedImageUrl ? (
          <FinalPreview
            originalImageUrl={croppedImageUrl || uploadedImageUrl}
            finalImageUrl={previewSrc}
            selectedFormat={selectedFormat}
            onBack={() => setStep("upload")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ─── Sidebar ──────────────────────────────────── */}
            <div className="lg:col-span-1">
              <EditorSidebar
                selectedFormat={selectedFormat}
                onFormatSelect={setSelectedFormat}
                croppedImageUrl={croppedImageUrl}
                isBgRemoved={isBgRemoved}
                bgProcessing={bgProcessing}
                bgColor={bgColor}
                onRemoveBg={handleRemoveBg}
                onBgColorChange={handleBgColorChange}
                onRestoreOriginal={handleRestoreOriginal}
                isEnhanced={isEnhanced}
                isEnhancing={isEnhancing}
                onToggleEnhance={handleToggleEnhance}
                isSmoothed={isSmoothed}
                isSmoothing={isSmoothing}
                onToggleSmooth={handleToggleSmooth}
                onContinueToExport={() => setStep("export")}
              />
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
                      {(isEnhanced || isSmoothed) && (unenhancedImageUrl || croppedImageUrl) && finalImageUrl ? (
                        <CompareSlider
                          beforeImage={(unenhancedImageUrl || croppedImageUrl) as string}
                          afterImage={finalImageUrl}
                          className="w-full h-full"
                        />
                      ) : previewSrc ? (
                        <Image
                          src={previewSrc}
                          alt="Preview"
                          fill
                          className="object-contain"
                          unoptimized
                          priority
                        />
                      ) : null}

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
        )}
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
