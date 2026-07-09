import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardGallery } from "@/components/dashboard/DashboardGallery";
import Image from "next/image";

export default async function DashboardPage() {
  // 1. Authenticate user on the server
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Secure Server-side redirection for guests
  if (!user) {
    redirect("/?auth=required");
  }

  const name = user.user_metadata?.full_name || user.email || "User";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-wide">
            My Saved Photos
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Manage your generated passport/visa photos. Saved photos are kept on secure cloud servers for up to 30 days.
          </p>
        </div>

        {/* User Badge Info */}
        <div className="flex items-center gap-3 p-3 bg-surface/50 border border-border rounded-2xl w-fit">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover w-10 h-10 border border-primary/25"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left">
            <p className="text-xs text-muted">Signed in as</p>
            <p className="text-sm font-semibold truncate max-w-44 text-foreground">
              {name}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Gallery (Leaf Component) */}
      <DashboardGallery />
    </main>
  );
}
