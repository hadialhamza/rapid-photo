"use client";

import { useEffect } from "react";

/**
 * PWARegistration registers the service worker (/sw.js) on the client side.
 * It runs on browser load event to avoid blocking the initial page render.
 * This component is rendered in the root layout and has no visible UI.
 */
export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });
          console.log("[PWA] Service Worker registered:", registration.scope);
        } catch (err) {
          console.error("[PWA] Service Worker registration failed:", err);
        }
      };

      // Register after window load to not compete with critical resources
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  return null;
}
