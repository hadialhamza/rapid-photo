"use server";

import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImage } from "@/lib/cloudinary/upload";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(
  userId: string,
  status: "active" | "banned"
) {
  await requireAdmin();

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/overview");
}

export async function updateUserRole(userId: string, role: "user" | "admin") {
  await requireAdmin();

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/overview");
}

export async function deleteUserImage(imageId: string) {
  await requireAdmin();

  const adminClient = createAdminClient();

  // 1. Fetch public_id
  const { data: record, error: fetchError } = await adminClient
    .from("user_images")
    .select("public_id")
    .eq("id", imageId)
    .single();

  if (fetchError || !record) {
    throw new Error("Image not found");
  }

  // 2. Destroy in Cloudinary
  try {
    await deleteImage(record.public_id);
  } catch (cloudinaryErr) {
    console.error("Admin failed to delete Cloudinary asset:", cloudinaryErr);
  }

  // 3. Delete DB record
  const { error } = await adminClient
    .from("user_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/overview");
}
