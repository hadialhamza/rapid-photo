"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Search, ImageOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { downloadImage } from "@/lib/download";
import { ImageCard } from "@/components/ui/ImageCard";

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

  const handleDeleteDirect = async (id: string) => {
    const res = await fetch(`/api/history/delete?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setImages((prev) => prev.filter((img) => img.id !== id));
    } else {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to delete image.");
    }
  };

  const filteredImages = images.filter((img) =>
    img.format_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isLoadingImages) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 w-full max-w-md bg-surface rounded-full border border-border" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-surface border border-border rounded-2xl aspect-3/4"
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
            Start editing an uploaded photo inside the editor workspace. Your
            final processed photo will automatically save here upon download.
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredImages.map((img) => (
            <ImageCard
              key={img.id}
              imageUrl={img.image_url}
              formatName={img.format_name}
              daysLeft={img.daysLeft}
              onDownload={async () => {
                await downloadImage(
                  img.image_url,
                  `saved-photo-${img.format_id}-${img.id.slice(0, 5)}.jpg`,
                );
              }}
              onDelete={async () => {
                await handleDeleteDirect(img.id);
              }}
              deleteModalTitle="Delete Photo"
              deleteModalDescription="Are you sure you want to delete this photo from your history? This will permanently remove it from cloud storage as well."
            />
          ))}
        </div>
      )}
    </div>
  );
}
