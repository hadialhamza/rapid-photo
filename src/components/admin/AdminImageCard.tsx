"use client";

import React, { useState, useTransition } from "react";
import { Card } from "@/components/ui/Card";
import { deleteUserImage } from "@/app/actions/admin-actions";
import { downloadImage } from "@/lib/download";
import { Trash2, Maximize2, Download, Loader2 } from "lucide-react";
import Image from "next/image";

interface UserImage {
  id: string;
  user_id: string;
  image_url: string;
  public_id: string;
  format_id: string;
  format_name: string;
  dimensions: string;
  created_at: string;
  updated_at: string;
  profiles: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface AdminImageCardProps {
  image: UserImage;
}

export function AdminImageCard({ image }: AdminImageCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadImage(
        image.image_url,
        `admin-download-${image.format_id}-${image.id.slice(0, 5)}.jpg`
      );
    } catch (err) {
      console.error("Failed to download image:", err);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this generated image? This will permanently delete it from Supabase Database logs and Cloudinary storage."
    );

    if (confirmed) {
      startTransition(async () => {
        try {
          await deleteUserImage(image.id);
        } catch (err) {
          console.error("Failed to delete image:", err);
          alert("Failed to delete image. Please try again.");
        }
      });
    }
  };

  return (
    <Card className="border-border bg-surface/50 overflow-hidden flex flex-col justify-between group shadow-md hover:border-primary/30 transition-all duration-300">
      {/* Image Preview Container */}
      <div className="relative aspect-3/4 bg-neutral-950 flex items-center justify-center p-2 border-b border-border/30 overflow-hidden">
        <Image
          src={image.image_url}
          alt={image.format_name}
          width={150}
          height={200}
          className="h-full w-auto object-contain rounded-md border border-border/50 shadow-sm group-hover:scale-[1.03] transition-transform duration-500"
          unoptimized
        />
      </div>

      {/* Minimal Footer Info & Action Bar */}
      <div className="p-3.5 space-y-3 bg-surface/30">
        <div className="text-left min-w-0">
          <p
            className="text-[11px] font-bold text-foreground truncate leading-snug"
            title={image.format_name}
          >
            {image.format_name}
          </p>
          <p
            className="text-[9px] text-muted truncate mt-0.5"
            title={image.profiles?.email || "Unknown User"}
          >
            {image.profiles?.email || "Unknown Email"}
          </p>
        </div>

        {/* Actions Button Row */}
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1.5">
            {/* View Full Size link */}
            <a
              href={image.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-elevated/50 border border-border/50 hover:border-foreground/30 text-muted hover:text-foreground rounded-xl transition-all duration-300 cursor-pointer hover:scale-105"
              title="View Full Size"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </a>

            {/* Direct Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 bg-elevated/50 border border-border/50 hover:border-primary/30 text-muted hover:text-primary rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50"
              title="Download Image"
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Delete Action button */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 bg-error/10 hover:bg-error/20 border border-error/20 hover:border-error/40 text-error rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 disabled:opacity-50"
            title="Delete Image"
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
}
