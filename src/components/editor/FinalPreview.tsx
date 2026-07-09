"use client";

import React, { useState } from "react";
import { ArrowLeft, Download, AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { PhotoFormat } from "@/lib/constants/photo-formats";
import { downloadFinalPhoto } from "@/lib/engine/export-client";
import { usePrintCartStore } from "@/store/print-cart-store";
import { useAuthStore } from "@/store/auth-store";

interface FinalPreviewProps {
  originalImageUrl: string;
  finalImageUrl: string;
  selectedFormat: PhotoFormat;
  onBack: () => void;
  onStartOver: () => void;
}

export function FinalPreview({
  originalImageUrl,
  finalImageUrl,
  selectedFormat,
  onBack,
  onStartOver,
}: FinalPreviewProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copies, setCopies] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const user = useAuthStore((state) => state.user);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const addItem = usePrintCartStore((state) => state.addItem);

  const handleDownload = async () => {
    setIsExporting(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const response = await fetch(finalImageUrl);
      const blob = await response.blob();
      const finalBlob = await downloadFinalPhoto(
        blob,
        selectedFormat.id,
        selectedFormat.widthPx,
        selectedFormat.heightPx,
        100, // High quality JPEG
      );

      // If user is logged in, auto-save image to Cloudinary and database history
      if (user) {
        setIsSaving(true);
        const uploadData = new FormData();
        uploadData.append("image", finalBlob, `passport-photo-${selectedFormat.id}.jpg`);
        uploadData.append("formatId", selectedFormat.id);
        uploadData.append("formatName", `${selectedFormat.type} (${selectedFormat.country})`);
        uploadData.append("dimensions", `${selectedFormat.dimensionsMm} (${selectedFormat.widthPx}x${selectedFormat.heightPx}px)`);

        try {
          const saveResponse = await fetch("/api/history/save", {
            method: "POST",
            body: uploadData,
          });
          if (saveResponse.ok) {
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          } else {
            console.error("Save to cloud history failed");
          }
        } catch (saveErr) {
          console.error("Auto-save history network error:", saveErr);
        } finally {
          setIsSaving(false);
        }
      }
    } catch (err) {
      console.error("Export failed:", err);
      setError("Failed to export the photo. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddToCart = async () => {
    await addItem(finalImageUrl, selectedFormat, copies);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Editor
          </Button>
          <Button
            variant="ghost"
            onClick={onStartOver}
            className="text-muted-foreground gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Start Over
          </Button>
        </div>
        <h2 className="text-xl font-semibold">Review & Export</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Preview */}
        <div className="space-y-4">
          <div className="relative h-120 w-full rounded-2xl border border-border bg-surface overflow-hidden shadow-inner flex items-center justify-center">
            {/* Note: CompareSlider handles the object-cover stretching, we wrap it to maintain aspect ratio and containment */}
            <CompareSlider
              beforeImage={originalImageUrl}
              afterImage={finalImageUrl}
              className="w-full h-full"
            />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Drag the slider to compare with the original photo
          </p>
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-surface">
            <h3 className="text-lg font-medium mb-4">Format Details</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Format</span>
                <span className="font-medium text-foreground">
                  {selectedFormat.type} ({selectedFormat.country})
                </span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Print Size</span>
                <span className="font-medium text-foreground">
                  {selectedFormat.dimensionsMm}
                </span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Digital Size</span>
                <span className="font-medium text-foreground">
                  {selectedFormat.widthPx} × {selectedFormat.heightPx} px
                </span>
              </li>
              <li className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground">Resolution</span>
                <span className="font-medium text-foreground">
                  300 DPI (High Quality)
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Format Type</span>
                <span className="font-medium text-foreground">
                  JPEG (100% Quality)
                </span>
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button
            size="lg"
            onClick={handleDownload}
            disabled={isExporting}
            icon={<Download className="w-5 h-5" />}
          >
            {isExporting ? (
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                Processing Export...
              </div>
            ) : (
              <>Download High Quality Photo</>
            )}
          </Button>

          {isSaving && (
            <p className="text-xs text-muted text-center animate-pulse mt-2">
              ☁️ Saving to cloud history...
            </p>
          )}

          {saveSuccess && (
            <p className="text-xs text-success text-center mt-2">
              ✓ Saved to your cloud history!
            </p>
          )}

          {/* Add to Print Layout Cart */}
          <div className="pt-6 border-t border-border/50 space-y-4">
            <h3 className="text-lg font-medium">Print Layout</h3>
            <p className="text-sm text-muted-foreground">
              Add multiple photos to create a print-ready A4 PDF.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-full bg-surface h-12">
                <button
                  type="button"
                  onClick={() => setCopies(Math.max(1, copies - 1))}
                  className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-medium">{copies}</span>
                <button
                  type="button"
                  onClick={() => setCopies(Math.min(30, copies + 1))}
                  className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
              <Button
                variant="secondary"
                className="flex-1 "
                onClick={handleAddToCart}
                disabled={addedToCart}
              >
                {addedToCart ? "Added to Layout!" : "Add to Print Layout"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
