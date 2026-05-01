"use client";

import React, { useCallback, useRef, useState } from "react";
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

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative h-full flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300",
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
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300",
            isDragOver ? "bg-primary/15" : "bg-elevated",
          )}
        >
          {isDragOver ? (
            <ImageIcon className="h-8 w-8 text-primary" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {isDragOver ? "Drop your photo here" : "Upload your photo"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Drag & drop or click to browse
          </p>
          <p className="mt-2 text-xs text-subtle">
            JPEG, PNG, or WebP • Max 15MB
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
