"use client";

import type { FaceDetectionResult } from "@/lib/engine/face-detector";
import type { CropArea } from "@/lib/engine/smart-crop";

interface FaceOverlayProps {
  faceResult: FaceDetectionResult;
  cropArea: CropArea;
  imageWidth: number;
  imageHeight: number;
}

/**
 * Renders face detection bounding box, eye markers, and crop area
 * as SVG overlay on top of the image preview.
 */
export function FaceOverlay({
  faceResult,
  cropArea,
  imageWidth,
  imageHeight,
}: FaceOverlayProps) {
  const { faceBoundingBox, leftEye, rightEye, confidence } = faceResult;

  return (
    <svg
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      className="absolute inset-0 h-full w-full pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Dimmed area outside the crop */}
      <defs>
        <mask id="crop-mask">
          <rect width={imageWidth} height={imageHeight} fill="white" />
          <rect
            x={cropArea.x}
            y={cropArea.y}
            width={cropArea.width}
            height={cropArea.height}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width={imageWidth}
        height={imageHeight}
        fill="rgba(0,0,0,0.5)"
        mask="url(#crop-mask)"
      />

      {/* Crop area border */}
      <rect
        x={cropArea.x}
        y={cropArea.y}
        width={cropArea.width}
        height={cropArea.height}
        fill="none"
        stroke="#ff3131"
        strokeWidth={Math.max(2, imageWidth * 0.003)}
        strokeDasharray={`${imageWidth * 0.015} ${imageWidth * 0.008}`}
      />

      {/* Face bounding box */}
      <rect
        x={faceBoundingBox.x}
        y={faceBoundingBox.y}
        width={faceBoundingBox.width}
        height={faceBoundingBox.height}
        fill="none"
        stroke="#22c55e"
        strokeWidth={Math.max(1.5, imageWidth * 0.002)}
        rx={imageWidth * 0.005}
      />

      {/* Left eye marker */}
      <circle
        cx={leftEye.x}
        cy={leftEye.y}
        r={Math.max(4, imageWidth * 0.006)}
        fill="#3b82f6"
        stroke="white"
        strokeWidth={Math.max(1, imageWidth * 0.001)}
      />

      {/* Right eye marker */}
      <circle
        cx={rightEye.x}
        cy={rightEye.y}
        r={Math.max(4, imageWidth * 0.006)}
        fill="#3b82f6"
        stroke="white"
        strokeWidth={Math.max(1, imageWidth * 0.001)}
      />

      {/* Eye line (horizontal alignment reference) */}
      <line
        x1={leftEye.x}
        y1={leftEye.y}
        x2={rightEye.x}
        y2={rightEye.y}
        stroke="#3b82f6"
        strokeWidth={Math.max(1, imageWidth * 0.001)}
        strokeDasharray={`${imageWidth * 0.008} ${imageWidth * 0.005}`}
        opacity={0.6}
      />

      {/* Confidence label */}
      <text
        x={faceBoundingBox.x}
        y={faceBoundingBox.y - imageHeight * 0.01}
        fill="#22c55e"
        fontSize={Math.max(12, imageWidth * 0.018)}
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        {Math.round(confidence * 100)}%
      </text>
    </svg>
  );
}
