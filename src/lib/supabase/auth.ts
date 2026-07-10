import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export const getProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
  return data;
});

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth=required");
  }

  const profile = await getProfile(user.id);

  // If user profile is not found or user is banned, redirect to /?auth=banned (cleared on client)
  if (!profile || profile.status === "banned") {
    redirect("/?auth=banned");
  }

  return { user, profile };
}

export async function requireAdmin() {
  const { user, profile } = await requireUser();

  if (profile.role !== "admin") {
    redirect("/");
  }

  return { user, profile };
}
