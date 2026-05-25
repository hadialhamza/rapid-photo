import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rapid Photo - Passport & Visa Photo Generator",
    short_name: "Rapid Photo",
    description:
      "Generate official passport and visa photos instantly with AI. Supports 150+ countries with 300 DPI print-ready quality.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    categories: ["photography", "utilities", "productivity"],
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [],
  };
}
