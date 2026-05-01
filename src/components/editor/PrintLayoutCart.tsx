"use client";

import React, { useState } from "react";
import { usePrintCartStore } from "@/store/print-cart-store";
import { Button } from "@/components/ui/Button";
import { Printer, X, Trash2, FileDown, Loader2 } from "lucide-react";
import { generatePrintLayoutPdf, downloadPdf } from "@/lib/engine/pdf-generator";
import Image from "next/image";

export function PrintLayoutCart() {
  const { items, removeItem, updateQuantity, clearCart } = usePrintCartStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalPhotos = items.reduce((sum, item) => sum + item.copies, 0);

  if (items.length === 0) return null;

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      const pdfBlob = await generatePrintLayoutPdf(items);
      downloadPdf(pdfBlob, "passport-print-layout.pdf");
      setIsOpen(false);
      clearCart();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform font-medium"
      >
        <div className="relative">
          <Printer className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-primary">
            {totalPhotos}
          </span>
        </div>
        Print Layout
      </button>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold">Print Layout Cart</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalPhotos} photos ready to be printed on A4
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-border rounded-xl bg-background"
                >
                  <div className="relative w-16 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt="Print item"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{item.format.country}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.format.dimensionsMm} • {item.format.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded-lg bg-surface h-10">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.copies - 1))}
                        className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.copies}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, Math.min(30, item.copies + 1))}
                        className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-border bg-surface/50 rounded-b-2xl">
              <Button
                size="lg"
                className="w-full h-14 text-lg font-medium shadow-lg"
                onClick={handleGeneratePdf}
                disabled={isGenerating || items.length === 0}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating A4 Layout...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5 mr-2" />
                    Download A4 Print PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
