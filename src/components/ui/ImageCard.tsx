"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Maximize2, Download, Loader2, Clock } from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

interface ImageCardProps {
  imageUrl: string;
  formatName: string;
  email?: string;
  daysLeft?: number;
  onDelete: () => Promise<void>;
  onDownload: () => Promise<void>;
  deleteModalTitle?: string;
  deleteModalDescription?: string;
}

export function ImageCard({
  imageUrl,
  formatName,
  email,
  daysLeft,
  onDelete,
  onDownload,
  deleteModalTitle = "Delete Photo",
  deleteModalDescription = "Are you sure you want to delete this photo? This action cannot be undone.",
}: ImageCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } catch (err) {
      console.error("Failed to download image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="relative aspect-3/4 w-full bg-neutral-950 overflow-hidden rounded-2xl border border-border group hover:border-primary/40 transition-all duration-300 shadow-lg">
        {/* Full-bleed Background Image */}
        <Image
          src={imageUrl}
          alt={formatName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />

        {/* Expiration warning badge (rendered only if daysLeft is provided) */}
        {daysLeft !== undefined && (
          <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[10px] font-medium text-neutral-300 flex items-center gap-1.5 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>{daysLeft} days remaining</span>
          </div>
        )}

        {/* Dark Bottom Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/85 to-transparent p-4 pt-12 flex flex-col gap-2.5">
          {/* Card Information */}
          <div className="text-left min-w-0">
            <p
              className="text-xs font-bold text-white truncate leading-snug"
              title={formatName}
            >
              {formatName}
            </p>
            {email && (
              <p
                className="text-[10px] text-neutral-300 truncate mt-0.5"
                title={email}
              >
                {email}
              </p>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              {/* View Link */}
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/10 text-white rounded-lg transition-all duration-300 cursor-pointer hover:scale-105"
                title="View Full Size"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </a>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-1.5 bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/10 text-white rounded-lg transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50"
                title="Download Image"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Delete trigger button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 bg-error/20 hover:bg-error/30 border border-error/20 hover:border-error/40 text-error rounded-lg transition-all duration-300 cursor-pointer hover:scale-105"
              title="Delete Image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        key={isDeleteModalOpen ? "open" : "closed"}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDelete}
        title={deleteModalTitle}
        description={deleteModalDescription}
      />
    </>
  );
}
