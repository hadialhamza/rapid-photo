import type { FaceDetectionResult } from "@/lib/engine/face-detector";
import type { PhotoFormat } from "@/lib/constants/photo-formats";

// ─── Types ───────────────────────────────────────────────────
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ─── Constants ───────────────────────────────────────────────

/**
 * MediaPipe face bbox covers forehead-to-chin, but a real "head" includes
 * hair above the forehead. This factor expands the bbox to estimate full head height.
 */
const HEAD_EXPANSION_FACTOR = 1.3;

// ─── Public API ──────────────────────────────────────────────

/**
 * Calculate the optimal crop area based on face detection results and target photo format.
 *
 * Standard passport photo proportions (reference: sample passport photo):
 *   - Top margin above head: ~5%
 *   - Full head (crown to chin): ~50-55% of photo height
 *   - Neck + shoulders: ~40% of photo height
 *   - Eyes positioned at ~40% from top
 *   - Face centered horizontally
 *   - Aspect ratio locked to target format
 */
export function calculateSmartCrop(
  face: FaceDetectionResult,
  format: PhotoFormat,
  imageWidth: number,
  imageHeight: number,
): CropArea {
  const { faceBoundingBox, leftEye, rightEye } = face;
  const { aspectRatio, headRatio, eyeLineRatio } = format;

  // ── Step 1: Calculate eye center ──────────────────────────
  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const eyeCenterY = (leftEye.y + rightEye.y) / 2;

  // ── Step 2: Estimate full head height ─────────────────────
  // MediaPipe bbox ≈ forehead to chin. Expand to include hair/crown.
  const fullHeadHeight = faceBoundingBox.height * HEAD_EXPANSION_FACTOR;

  // ── Step 3: Calculate crop height ─────────────────────────
  // headRatio = fraction of crop height the full head should occupy
  // e.g. headRatio = 0.50 → head is 50% of photo, leaving 50% for body/margin
  const cropHeight = fullHeadHeight / headRatio;

  // ── Step 4: Calculate crop width from aspect ratio ────────
  const cropWidth = cropHeight * aspectRatio;

  // ── Step 5: Position the crop so eyes align at eyeLineRatio
  // eyeLineRatio = distance from TOP as fraction of crop height
  // e.g. 0.40 → eyes at 40% from top (standard passport position)
  const cropY = eyeCenterY - cropHeight * eyeLineRatio;

  // ── Step 6: Center horizontally on the face ───────────────
  const faceCenterX = faceBoundingBox.x + faceBoundingBox.width / 2;
  const cropX = faceCenterX - cropWidth / 2;

  // ── Step 7: Clamp to image bounds ─────────────────────────
  let finalWidth = Math.min(cropWidth, imageWidth);
  let finalHeight = finalWidth / aspectRatio;

  if (finalHeight > imageHeight) {
    finalHeight = imageHeight;
    finalWidth = finalHeight * aspectRatio;
  }

  const finalX = Math.max(
    0,
    Math.min(cropX, imageWidth - finalWidth),
  );
  const finalY = Math.max(
    0,
    Math.min(cropY, imageHeight - finalHeight),
  );

  return {
    x: Math.round(finalX),
    y: Math.round(finalY),
    width: Math.round(finalWidth),
    height: Math.round(finalHeight),
  };
}
