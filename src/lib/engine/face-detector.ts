import {
  FaceDetector,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

// ─── Types ───────────────────────────────────────────────────
export interface FaceDetectionResult {
  faceBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  confidence: number;
}

export class FaceDetectionError extends Error {
  constructor(
    message: string,
    public code: "NO_FACE" | "MULTIPLE_FACES" | "LOW_CONFIDENCE" | "INIT_FAILED",
  ) {
    super(message);
    this.name = "FaceDetectionError";
  }
}

// ─── Singleton Instance ──────────────────────────────────────
let detectorInstance: FaceDetector | null = null;

async function getDetector(): Promise<FaceDetector> {
  if (detectorInstance) return detectorInstance;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
    );

    detectorInstance = await FaceDetector.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      minDetectionConfidence: 0.5,
    });

    return detectorInstance;
  } catch {
    throw new FaceDetectionError(
      "Failed to initialize face detector. Please refresh the page and try again.",
      "INIT_FAILED",
    );
  }
}

// ─── Public API ──────────────────────────────────────────────
const MIN_CONFIDENCE = 0.6;

/**
 * Detect a single face in the given image.
 * Returns bounding box, eye positions, and confidence score.
 * Throws `FaceDetectionError` if no face, multiple faces, or low confidence.
 */
export async function detectFace(
  image: HTMLImageElement,
): Promise<FaceDetectionResult> {
  const detector = await getDetector();
  const result = detector.detect(image);

  if (!result.detections || result.detections.length === 0) {
    throw new FaceDetectionError(
      "No face detected. Please upload a clear photo with your face visible.",
      "NO_FACE",
    );
  }

  if (result.detections.length > 1) {
    throw new FaceDetectionError(
      "Multiple faces detected. Please upload a photo with only one person.",
      "MULTIPLE_FACES",
    );
  }

  const detection = result.detections[0];
  const bbox = detection.boundingBox;

  if (!bbox) {
    throw new FaceDetectionError(
      "Could not determine face position. Please try a different photo.",
      "NO_FACE",
    );
  }

  const confidence = detection.categories?.[0]?.score ?? 0;
  if (confidence < MIN_CONFIDENCE) {
    throw new FaceDetectionError(
      `Low detection confidence (${Math.round(confidence * 100)}%). Please use a clearer, well-lit photo.`,
      "LOW_CONFIDENCE",
    );
  }

  // Extract eye keypoints
  // MediaPipe blaze_face_short_range keypoints:
  // 0 = right eye, 1 = left eye, 2 = nose tip, 3 = mouth, 4 = right ear, 5 = left ear
  const keypoints = detection.keypoints ?? [];
  const rightEyeKp = keypoints[0];
  const leftEyeKp = keypoints[1];

  // Pixel coordinates (MediaPipe returns normalized, but with IMAGE mode + boundingBox it gives pixel values)
  const imgWidth = image.naturalWidth;
  const imgHeight = image.naturalHeight;

  const leftEye = leftEyeKp
    ? { x: leftEyeKp.x * imgWidth, y: leftEyeKp.y * imgHeight }
    : { x: bbox.originX + bbox.width * 0.35, y: bbox.originY + bbox.height * 0.35 };

  const rightEye = rightEyeKp
    ? { x: rightEyeKp.x * imgWidth, y: rightEyeKp.y * imgHeight }
    : { x: bbox.originX + bbox.width * 0.65, y: bbox.originY + bbox.height * 0.35 };

  return {
    faceBoundingBox: {
      x: bbox.originX,
      y: bbox.originY,
      width: bbox.width,
      height: bbox.height,
    },
    leftEye,
    rightEye,
    confidence,
  };
}
