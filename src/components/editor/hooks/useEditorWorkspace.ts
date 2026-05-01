import { useCallback, useRef, useEffect } from "react";
import { getFormatById } from "@/lib/constants/photo-formats";
import { detectFace, FaceDetectionError } from "@/lib/engine/face-detector";
import { calculateSmartCrop } from "@/lib/engine/smart-crop";
import { cropAndResizeToTarget } from "@/lib/engine/crop-utils";
import { refineEdges } from "@/lib/engine/edge-refiner";
import { replaceBackground } from "@/lib/engine/bg-replacer";
import { removeBackground } from "@/lib/engine/bg-removal-client";
import { enhanceLighting } from "@/lib/engine/lighting-corrector";
import { applyNoisewareFilter } from "@/lib/engine/noiseware-filter";
import type { Area } from "react-easy-crop";
import { useEditorStore, LOADING_MESSAGES } from "@/store/editor-store";

export function useEditorWorkspace(initialPresetId?: string) {
  const store = useEditorStore();
  const isMounted = useRef(false);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize format if provided
  useEffect(() => {
    if (initialPresetId) {
      const format = getFormatById(initialPresetId);
      if (format) store.setSelectedFormat(format);
    }
  }, [initialPresetId, store]); // Only on mount/id change

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, []);

  const startLoadingMessages = useCallback(() => {
    store.setLoadingMsgIndex(0);
    loadingTimerRef.current = setInterval(() => {
      const currentIndex = useEditorStore.getState().loadingMsgIndex;
      if (currentIndex < LOADING_MESSAGES.length - 1) {
        store.setLoadingMsgIndex(currentIndex + 1);
      }
    }, 3000);
  }, [store]);

  const stopLoadingMessages = useCallback(() => {
    if (loadingTimerRef.current) {
      clearInterval(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  }, []);

  const runFaceDetection = useCallback(
    async (objectUrl: string) => {
      store.setStep("detecting");
      store.setDetectionError(null);
      store.setFaceResult(null);
      store.setCropArea(null);
      store.setCroppedImageUrl(null);

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
        store.setImageSize(size);

        const result = await detectFace(img);
        store.setFaceResult(result);

        const crop = calculateSmartCrop(
          result,
          store.selectedFormat,
          size.width,
          size.height
        );
        store.setCropArea(crop);
        store.setStep("upload");
      } catch (err) {
        if (!isMounted.current) return;
        console.error("Detection failed:", err);
        if (err instanceof FaceDetectionError) {
          store.setDetectionError(err.message);
        } else {
          store.setDetectionError("An unexpected error occurred during face detection.");
        }
        store.setStep("upload");
      }
    },
    [store]
  );

  const handleImageLoaded = useCallback(
    (_file: File, objectUrl: string) => {
      store.setUploadedImageUrl(objectUrl);
      runFaceDetection(objectUrl);
    },
    [runFaceDetection, store]
  );

  const applyFilters = useCallback(async (baseBlob: Blob, enhancedState: boolean, smoothedState: boolean) => {
    store.setIsEnhancing(true);
    try {
      let currentBlob = baseBlob;
      if (enhancedState) {
        currentBlob = await enhanceLighting(currentBlob);
      }
      if (smoothedState) {
        store.setIsSmoothing(true);
        currentBlob = await applyNoisewareFilter(currentBlob);
        store.setIsSmoothing(false);
      }
      store.setFinalImageUrl(URL.createObjectURL(currentBlob));
    } catch (err) {
      console.error("Filter pipeline failed:", err);
      store.setDetectionError("Failed to apply filters. Showing original.");
      store.setFinalImageUrl(URL.createObjectURL(baseBlob));
      store.setIsSmoothing(false);
    } finally {
      store.setIsEnhancing(false);
    }
  }, [store]);

  const updateFinalImage = useCallback(async (baseBlob: Blob, enhancedState: boolean, smoothedState: boolean) => {
    const baseUrl = URL.createObjectURL(baseBlob);
    store.setUnenhancedImageUrl(baseUrl);

    if (enhancedState || smoothedState) {
      await applyFilters(baseBlob, enhancedState, smoothedState);
    } else {
      store.setFinalImageUrl(baseUrl);
    }
  }, [applyFilters, store]);

  const handleCropComplete = useCallback(
    async (croppedAreaPixels: Area) => {
      if (!store.uploadedImageUrl) return;

      store.setStep("processing-crop");
      store.setDetectionError(null);

      try {
        const croppedBlob = await cropAndResizeToTarget(
          store.uploadedImageUrl,
          croppedAreaPixels,
          store.selectedFormat.widthPx,
          store.selectedFormat.heightPx
        );
        const url = URL.createObjectURL(croppedBlob);

        if (store.croppedImageUrl) URL.revokeObjectURL(store.croppedImageUrl);
        if (store.unenhancedImageUrl) URL.revokeObjectURL(store.unenhancedImageUrl);
        if (store.finalImageUrl) URL.revokeObjectURL(store.finalImageUrl);
        
        store.setUnenhancedImageUrl(null);
        store.setFinalImageUrl(null);
        store.setIsEnhanced(false);
        store.setIsSmoothed(false);

        store.setCroppedImageUrl(url);
        store.setStep("upload");
      } catch (err) {
        console.error("Cropping failed:", err);
        store.setDetectionError("Failed to crop image. Please try again.");
        store.setStep("cropping");
      }
    },
    [store]
  );

  const handleRemoveBg = useCallback(async () => {
    if (!store.croppedImageUrl) return;

    store.setBgProcessing(true);
    store.setDetectionError(null);
    startLoadingMessages();

    try {
      const croppedResponse = await fetch(store.croppedImageUrl);
      const croppedBlob = await croppedResponse.blob();
      const transparentResult = await removeBackground(croppedBlob);

      if (!isMounted.current) return;

      const refinedResult = await refineEdges(transparentResult);
      store.setTransparentBlob(refinedResult);
      store.setIsBgRemoved(true);

      const composited = await replaceBackground(
        refinedResult,
        store.bgColor,
        store.selectedFormat.widthPx,
        store.selectedFormat.heightPx
      );

      await updateFinalImage(composited, store.isEnhanced, store.isSmoothed);
    } catch (err: unknown) {
      console.error("Background removal failed:", err);
      const message = err instanceof Error ? err.message : "Background removal failed.";
      store.setDetectionError(message);
    } finally {
      store.setBgProcessing(false);
      stopLoadingMessages();
    }
  }, [store, startLoadingMessages, stopLoadingMessages, updateFinalImage]);

  const handleBgColorChange = useCallback(
    async (color: string) => {
      store.setBgColor(color);
      if (!store.transparentBlob) return;

      try {
        const composited = await replaceBackground(
          store.transparentBlob,
          color,
          store.selectedFormat.widthPx,
          store.selectedFormat.heightPx
        );
        await updateFinalImage(composited, store.isEnhanced, store.isSmoothed);
      } catch (err) {
        console.error("Failed to apply background color:", err);
      }
    },
    [store, updateFinalImage]
  );

  const handleRestoreOriginal = useCallback(() => {
    store.setIsBgRemoved(false);
    store.setTransparentBlob(null);
    store.setUnenhancedImageUrl(null);
    store.setFinalImageUrl(null);
  }, [store]);

  const applyFiltersFromUrl = useCallback(async (enhancedState: boolean, smoothedState: boolean) => {
    const sourceUrl = store.unenhancedImageUrl || store.croppedImageUrl;
    if (!sourceUrl) return;

    if (!enhancedState && !smoothedState) {
      store.setFinalImageUrl(sourceUrl);
      return;
    }

    store.setIsEnhancing(true);
    store.setDetectionError(null);
    try {
      const response = await fetch(sourceUrl);
      const blob = await response.blob();
      
      let currentBlob = blob;
      if (enhancedState) {
        currentBlob = await enhanceLighting(currentBlob);
      }
      if (smoothedState) {
        store.setIsSmoothing(true);
        currentBlob = await applyNoisewareFilter(currentBlob);
        store.setIsSmoothing(false);
      }
      store.setFinalImageUrl(URL.createObjectURL(currentBlob));
    } catch (err) {
      console.error("Enhancement failed:", err);
      store.setDetectionError("Failed to apply filters.");
      store.setIsSmoothing(false);
    } finally {
      store.setIsEnhancing(false);
    }
  }, [store]);

  const handleToggleEnhance = useCallback(async (state: boolean) => {
    store.setIsEnhanced(state);
    await applyFiltersFromUrl(state, store.isSmoothed);
  }, [applyFiltersFromUrl, store]);

  const handleToggleSmooth = useCallback(async (state: boolean) => {
    store.setIsSmoothed(state);
    await applyFiltersFromUrl(store.isEnhanced, state);
  }, [applyFiltersFromUrl, store]);

  const previewSrc = store.finalImageUrl || store.croppedImageUrl || store.uploadedImageUrl;

  return {
    ...store,
    previewSrc,
    handleImageLoaded,
    handleStartOver: store.resetEditor,
    handleCropComplete,
    handleRemoveBg,
    handleBgColorChange,
    handleRestoreOriginal,
    handleToggleEnhance,
    handleToggleSmooth,
  };
}
