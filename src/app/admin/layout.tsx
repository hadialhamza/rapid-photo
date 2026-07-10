import { requireAdmin } from "@/lib/supabase/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(); // Secure layout (Edge proxy handles session, this checks role)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-border bg-surface/50 p-6 flex-col gap-6 shrink-0">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-heading text-foreground tracking-wide">
            Admin Console
          </h2>
          <p className="text-xs text-muted">
            Manage users, images and system logs.
          </p>
        </div>

        <AdminSidebarNav />

        <div className="border-t border-border/50 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation Header */}
        <div className="flex md:hidden items-center justify-between border-b border-border bg-surface/50 px-6 py-4">
          <span className="font-heading font-bold text-lg">Admin Panel</span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/admin/overview" className="text-muted hover:text-foreground">
              Overview
            </Link>
            <Link
              href="/admin"
              className="text-muted hover:text-foreground"
            >
              Gallery
            </Link>
            <Link
              href="/admin/users"
              className="text-muted hover:text-foreground"
            >
              Users
            </Link>
          </div>
        </div>

        <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
