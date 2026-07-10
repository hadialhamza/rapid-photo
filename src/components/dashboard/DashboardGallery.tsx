"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Trash2,
  Search,
  ImageOff,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { downloadImage } from "@/lib/download";

interface SavedImage {
  id: string;
  image_url: string;
  format_id: string;
  format_name: string;
  dimensions: string;
  created_at: string;
  daysLeft: number;
}

export function DashboardGallery() {
  const [images, setImages] = useState<SavedImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Fetch image history on mount
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/history/list");
        if (res.ok) {
          const data = await res.json();
          setImages(data.images || []);
        } else {
          console.error("Failed to fetch image list");
        }
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, []);

  const handleDownload = async (imageUrl: string, formatId: string, id: string) => {
    setDownloadingId(id);
    try {
      await downloadImage(imageUrl, `saved-photo-${formatId}-${id.slice(0, 5)}.jpg`);
    } catch (err) {
      console.error("Failed to download image:", err);
      alert("Failed to download image. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo from your history? This will remove it from cloud storage as well.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/delete?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete image.");
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
      alert("Failed to delete. Please check your connection.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredImages = images.filter((img) =>
    img.format_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingImages) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-full max-w-md bg-surface rounded-full border border-border" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-surface border border-border rounded-2xl h-96"
            />
          ))}
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 bg-surface/30 border border-border border-dashed rounded-3xl p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <ImageOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-heading text-foreground">
            No Photos Saved Yet
          </h2>
          <p className="text-muted text-sm max-w-md">
            Start editing an uploaded photo inside the editor workspace. Your final processed photo will automatically save here upon download.
          </p>
        </div>
        <Link href="/editor">
          <Button variant="default" icon={<ArrowRight className="w-4 h-4" />}>
            Create Passport Photo
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Filtering */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
        <input
          type="text"
          placeholder="Search by country or format..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-full border border-border bg-surface/50 text-sm placeholder-muted focus:outline-none focus:border-primary transition-colors duration-300"
        />
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p className="text-base">No saved photos match your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <Card
              key={img.id}
              className="overflow-hidden group hover:border-primary/40 transition-colors duration-300 flex flex-col bg-surface/40 backdrop-blur-sm shadow-md"
            >
              {/* Image Preview Container */}
              <div className="relative h-64 bg-background overflow-hidden flex items-center justify-center shrink-0 border-b border-border/50">
                <Image
                  src={img.image_url}
                  alt={img.format_name}
                  fill
                  sizes="(max-w-768px) 100vw, 300px"
                  className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-500"
                />

                {/* Expiration warning badge */}
                <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md border border-border rounded-full px-2.5 py-1 text-[10px] font-medium text-muted-foreground flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span>{img.daysLeft} days remaining</span>
                </div>
              </div>

              {/* Card Description */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
                    {img.format_id.split("-")[0]} standard
                  </span>
                  <h3 className="font-semibold text-base leading-snug line-clamp-1 text-foreground">
                    {img.format_name}
                  </h3>
                  <p className="text-xs text-muted truncate">
                    {img.dimensions}
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2">
                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(img.image_url, img.format_id, img.id)}
                    disabled={downloadingId !== null}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white h-10 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {downloadingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    Download
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId !== null}
                    className="flex items-center justify-center border border-border hover:border-error/30 hover:bg-error/10 text-muted hover:text-error w-10 h-10 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Delete photo"
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
