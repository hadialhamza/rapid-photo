"use client";

import { useEffect } from "react";

/**
 * PrefetchMediaPipe fetches MediaPipe WASM and model files in the background
 * once the window load event fires and the UI thread is idle.
 */
export function PrefetchMediaPipe() {
  useEffect(() => {
    const prefetchAssets = () => {
      const runPrefetch = () => {
        const assets = [
          "/mediapipe/vision_wasm_internal.wasm",
          "/mediapipe/vision_wasm_nosimd_internal.wasm",
          "/mediapipe/blaze_face_short_range.tflite",
        ];

        assets.forEach((url) => {
          fetch(url, { priority: "low" } as RequestInit).catch(() => {});
        });
      };

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(runPrefetch);
      } else {
        setTimeout(runPrefetch, 3000);
      }
    };

    if (document.readyState === "complete") {
      prefetchAssets();
    } else {
      window.addEventListener("load", prefetchAssets);
      return () => window.removeEventListener("load", prefetchAssets);
    }
  }, []);

  return null;
}
