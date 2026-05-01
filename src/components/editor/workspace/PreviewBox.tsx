import Image from "next/image";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { FaceOverlay } from "@/components/editor/FaceOverlay";
import { LoadingOverlay } from "./LoadingOverlay";
import { LOADING_MESSAGES } from "@/store/editor-store";
import type { EditorStep } from "@/store/editor-store";
import type { FaceDetectionResult } from "@/lib/engine/face-detector";
import type { CropArea } from "@/lib/engine/smart-crop";

interface PreviewBoxProps {
  step: EditorStep;
  previewSrc: string | null;
  unenhancedImageUrl: string | null;
  croppedImageUrl: string | null;
  finalImageUrl: string | null;
  isEnhanced: boolean;
  isSmoothed: boolean;
  faceResult: FaceDetectionResult | null;
  cropArea: CropArea | null;
  imageSize: { width: number; height: number } | null;
  bgProcessing: boolean;
  loadingMsgIndex: number;
}

export function PreviewBox({
  step,
  previewSrc,
  unenhancedImageUrl,
  croppedImageUrl,
  finalImageUrl,
  isEnhanced,
  isSmoothed,
  faceResult,
  cropArea,
  imageSize,
  bgProcessing,
  loadingMsgIndex,
}: PreviewBoxProps) {
  return (
    <div className="relative h-120 w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-inner">
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
      {!croppedImageUrl && faceResult && cropArea && imageSize && (
        <FaceOverlay
          faceResult={faceResult}
          cropArea={cropArea}
          imageWidth={imageSize.width}
          imageHeight={imageSize.height}
        />
      )}

      {/* Loading Overlays */}
      {step === "detecting" && <LoadingOverlay message="Detecting face..." />}
      {step === "processing-crop" && <LoadingOverlay message="Resizing to target dimensions..." />}
      {bgProcessing && (
        <LoadingOverlay message={LOADING_MESSAGES[loadingMsgIndex]} showPulse />
      )}
    </div>
  );
}
