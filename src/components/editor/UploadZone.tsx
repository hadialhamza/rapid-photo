"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

interface UploadZoneProps {
  onImageLoaded: (file: File, objectUrl: string) => void;
  className?: string;
}

export function UploadZone({ onImageLoaded, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndLoad = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, and WebP files are supported.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size must be under 15MB.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      onImageLoaded(file, objectUrl);
    },
    [onImageLoaded],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndLoad(file);
    },
    [validateAndLoad],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndLoad(file);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [validateAndLoad],
  );

  const handleDemoImage = async (url: string, name: string) => {
    try {
      setError(null);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], `${name}.jpg`, { type: "image/jpeg" });
      const objectUrl = URL.createObjectURL(file);
      onImageLoaded(file, objectUrl);
    } catch (err) {
      console.error("Failed to load demo image:", err);
      setError("Failed to load demo image. Please check your internet connection.");
    }
  };

  const demoImages = [
    {
      name: "Demo 1",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Demo 2",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Demo 3",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      fullUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <div className={cn("w-full space-y-8", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 transition-all duration-300 min-h-[400px]",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-surface hover:border-border-hover hover:bg-elevated",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-4 cursor-pointer w-full h-full justify-center"
        >
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-2xl transition-colors duration-300",
              isDragOver ? "bg-primary/15" : "bg-elevated",
            )}
          >
            {isDragOver ? (
              <ImageIcon className="h-10 w-10 text-primary" />
            ) : (
              <UploadCloud className="h-10 w-10 text-muted" />
            )}
          </div>

          <div className="text-center">
            <p className="text-xl font-bold text-foreground">
              {isDragOver ? "Drop your photo here" : "Upload your photo"}
            </p>
            <p className="mt-1 text-muted">
              Drag & drop or click to browse from device
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-subtle">
              <span className="px-2 py-1 rounded-md bg-surface border border-border">JPEG</span>
              <span className="px-2 py-1 rounded-md bg-surface border border-border">PNG</span>
              <span className="px-2 py-1 rounded-md bg-surface border border-border">WEBP</span>
              <span className="text-primary">• Max 15MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Images Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <p className="text-sm font-bold text-muted uppercase tracking-widest">
            Try with Demo Photos
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {demoImages.map((img) => (
            <button
              key={img.name}
              onClick={() => handleDemoImage(img.fullUrl, img.name)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Image
                src={img.url}
                alt={img.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur-sm">
                  Use This
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
