import { create } from "zustand";
import { PhotoFormat, SUPPORTED_FORMATS } from "@/lib/constants/photo-formats";
import type { FaceDetectionResult } from "@/lib/engine/face-detector";
import type { CropArea } from "@/lib/engine/smart-crop";

export type EditorStep =
  | "upload"
  | "detecting"
  | "cropping"
  | "processing-crop"
  | "removing-bg"
  | "preview"
  | "export";

export const LOADING_MESSAGES = [
  "Analyzing image composition...",
  "Identifying subject boundaries...",
  "Separating foreground elements...",
  "Refining edge details...",
  "Applying precision masking...",
  "Generating transparent output...",
  "Optimizing image quality...",
  "Almost there...",
];

interface EditorState {
  // Selections
  selectedFormat: PhotoFormat;
  step: EditorStep;
  
  // Image URLs & Blobs
  uploadedImageUrl: string | null;
  croppedImageUrl: string | null;
  unenhancedImageUrl: string | null;
  finalImageUrl: string | null;
  transparentBlob: Blob | null;
  
  // Detection & Layout
  faceResult: FaceDetectionResult | null;
  cropArea: CropArea | null;
  imageSize: { width: number; height: number } | null;
  detectionError: string | null;
  
  // Background Removal
  isBgRemoved: boolean;
  bgProcessing: boolean;
  bgColor: string;
  loadingMsgIndex: number;
  
  // Enhancements
  isEnhanced: boolean;
  isEnhancing: boolean;
  isSmoothed: boolean;
  isSmoothing: boolean;

  // Actions
  setSelectedFormat: (format: PhotoFormat) => void;
  setStep: (step: EditorStep) => void;
  setUploadedImageUrl: (url: string | null) => void;
  setCroppedImageUrl: (url: string | null) => void;
  setUnenhancedImageUrl: (url: string | null) => void;
  setFinalImageUrl: (url: string | null) => void;
  setTransparentBlob: (blob: Blob | null) => void;
  setFaceResult: (result: FaceDetectionResult | null) => void;
  setCropArea: (area: CropArea | null) => void;
  setImageSize: (size: { width: number; height: number } | null) => void;
  setDetectionError: (error: string | null) => void;
  setIsBgRemoved: (isRemoved: boolean) => void;
  setBgProcessing: (isProcessing: boolean) => void;
  setBgColor: (color: string) => void;
  setLoadingMsgIndex: (index: number) => void;
  setIsEnhanced: (isEnhanced: boolean) => void;
  setIsEnhancing: (isEnhancing: boolean) => void;
  setIsSmoothed: (isSmoothed: boolean) => void;
  setIsSmoothing: (isSmoothing: boolean) => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  selectedFormat: SUPPORTED_FORMATS[0],
  step: "upload",
  
  uploadedImageUrl: null,
  croppedImageUrl: null,
  unenhancedImageUrl: null,
  finalImageUrl: null,
  transparentBlob: null,
  
  faceResult: null,
  cropArea: null,
  imageSize: null,
  detectionError: null,
  
  isBgRemoved: false,
  bgProcessing: false,
  bgColor: "#FFFFFF",
  loadingMsgIndex: 0,
  
  isEnhanced: false,
  isEnhancing: false,
  isSmoothed: false,
  isSmoothing: false,

  setSelectedFormat: (format) => set({ selectedFormat: format }),
  setStep: (step) => set({ step }),
  setUploadedImageUrl: (url) => set({ uploadedImageUrl: url }),
  setCroppedImageUrl: (url) => set({ croppedImageUrl: url }),
  setUnenhancedImageUrl: (url) => set({ unenhancedImageUrl: url }),
  setFinalImageUrl: (url) => set({ finalImageUrl: url }),
  setTransparentBlob: (blob) => set({ transparentBlob: blob }),
  setFaceResult: (result) => set({ faceResult: result }),
  setCropArea: (area) => set({ cropArea: area }),
  setImageSize: (size) => set({ imageSize: size }),
  setDetectionError: (error) => set({ detectionError: error }),
  setIsBgRemoved: (isRemoved) => set({ isBgRemoved: isRemoved }),
  setBgProcessing: (isProcessing) => set({ bgProcessing: isProcessing }),
  setBgColor: (color) => set({ bgColor: color }),
  setLoadingMsgIndex: (index) => set({ loadingMsgIndex: index }),
  setIsEnhanced: (isEnhanced) => set({ isEnhanced }),
  setIsEnhancing: (isEnhancing) => set({ isEnhancing }),
  setIsSmoothed: (isSmoothed) => set({ isSmoothed }),
  setIsSmoothing: (isSmoothing) => set({ isSmoothing }),

  resetEditor: () => {
    const { uploadedImageUrl, croppedImageUrl, unenhancedImageUrl, finalImageUrl } = get();
    
    if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
    if (croppedImageUrl) URL.revokeObjectURL(croppedImageUrl);
    if (unenhancedImageUrl) URL.revokeObjectURL(unenhancedImageUrl);
    if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);

    set({
      step: "upload",
      uploadedImageUrl: null,
      croppedImageUrl: null,
      unenhancedImageUrl: null,
      finalImageUrl: null,
      transparentBlob: null,
      faceResult: null,
      cropArea: null,
      imageSize: null,
      detectionError: null,
      isBgRemoved: false,
      bgColor: "#FFFFFF",
      isEnhanced: false,
      isSmoothed: false,
    });
  },
}));
