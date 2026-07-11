"use client";

import React from "react";
import { deleteUserImage } from "@/app/actions/admin-actions";
import { downloadImage } from "@/lib/download";
import { ImageCard } from "@/components/ui/ImageCard";

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
  return (
    <ImageCard
      imageUrl={image.image_url}
      formatName={image.format_name}
      email={image.profiles?.email}
      onDownload={async () => {
        await downloadImage(
          image.image_url,
          `admin-download-${image.format_id}-${image.id.slice(0, 5)}.jpg`,
        );
      }}
      onDelete={async () => {
        await deleteUserImage(image.id);
      }}
      deleteModalTitle="Delete Photo"
      deleteModalDescription="Are you sure you want to delete this generated photo? This will permanently remove it from both database logs and cloud storage."
    />
  );
}
