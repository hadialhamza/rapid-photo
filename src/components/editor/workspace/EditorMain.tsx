import React from "react";
import { UploadZone } from "@/components/editor/UploadZone";
import { CropEditor } from "@/components/editor/CropEditor";
import { PreviewBox } from "./PreviewBox";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, ArrowLeft, Crop as CropIcon } from "lucide-react";
import type { EditorStep } from "@/store/editor-store";
import type { PhotoFormat } from "@/lib/constants/photo-formats";
import type { FaceDetectionResult } from "@/lib/engine/face-detector";
import type { CropArea } from "@/lib/engine/smart-crop";
import type { Area } from "react-easy-crop";

interface EditorMainProps {
  step: EditorStep;
  setStep: (step: EditorStep) => void;
  uploadedImageUrl: string | null;
  croppedImageUrl: string | null;
  previewSrc: string | null;
  faceResult: FaceDetectionResult | null;
  cropArea: CropArea | null;
  imageSize: { width: number; height: number } | null;
  detectionError: string | null;
  selectedFormat: PhotoFormat;
  isBgRemoved: boolean;
  bgProcessing: boolean;
  loadingMsgIndex: number;
  isEnhanced: boolean;
  isSmoothed: boolean;
  finalImageUrl: string | null;
  unenhancedImageUrl: string | null;
  handleImageLoaded: (file: File, url: string) => void;
  handleCropComplete: (area: Area) => void;
  handleStartOver: () => void;
}

export function EditorMain({
  step,
  setStep,
  uploadedImageUrl,
  croppedImageUrl,
  previewSrc,
  faceResult,
  cropArea,
  imageSize,
  detectionError,
  selectedFormat,
  isBgRemoved,
  bgProcessing,
  loadingMsgIndex,
  isEnhanced,
  isSmoothed,
  finalImageUrl,
  unenhancedImageUrl,
  handleImageLoaded,
  handleCropComplete,
  handleStartOver,
}: EditorMainProps) {
  if (!uploadedImageUrl) {
    return <UploadZone onImageLoaded={handleImageLoaded} className="h-120" />;
  }

  return (
    <div className="space-y-6">
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
          <PreviewBox
            step={step}
            previewSrc={previewSrc}
            unenhancedImageUrl={unenhancedImageUrl}
            croppedImageUrl={croppedImageUrl}
            finalImageUrl={finalImageUrl}
            isEnhanced={isEnhanced}
            isSmoothed={isSmoothed}
            faceResult={faceResult}
            cropArea={cropArea}
            imageSize={imageSize}
            bgProcessing={bgProcessing}
            loadingMsgIndex={loadingMsgIndex}
          />

          {/* Result Alerts */}
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
                  Face detected successfully ({Math.round(faceResult.confidence * 100)}%)
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  onClick={() => {
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
                  onClick={() => setStep("cropping")}
                  icon={<CropIcon className="h-4 w-4" />}
                >
                  Manual Adjust
                </Button>
              </div>
            </div>
          )}

          {/* Crop applied */}
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
  );
}
