import { requireAdmin } from "@/lib/supabase/auth";
import Link from "next/link";
import {
  Users,
  Image as ImageIcon,
  LayoutDashboard,
  ArrowLeft,
} from "lucide-react";

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

        <nav className="flex flex-col gap-1.5 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-elevated/50 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-elevated/50 transition-all"
          >
            <Users className="w-4 h-4" />
            Manage Users
          </Link>
          <Link
            href="/admin/images"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-elevated/50 transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            Image History
          </Link>
        </nav>

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
            <Link href="/admin" className="text-muted hover:text-foreground">
              Overview
            </Link>
            <Link
              href="/admin/users"
              className="text-muted hover:text-foreground"
            >
              Users
            </Link>
            <Link
              href="/admin/images"
              className="text-muted hover:text-foreground"
            >
              Images
            </Link>
          </div>
        </div>

        <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
