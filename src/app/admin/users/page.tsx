import { createAdminClient } from "@/lib/supabase/admin";
import {
  updateUserStatus,
  updateUserRole,
} from "@/app/actions/admin-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import Image from "next/image";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  const adminClient = createAdminClient();
  let query = adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(
      `email.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`
    );
  }

  const { data: profiles, error } = await query;

  if (error) {
    console.error("Fetch profiles error:", error);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-wide">
            Manage Users
          </h1>
          <p className="text-sm text-muted">
            Search, edit roles, or toggle user status.
          </p>
        </div>

        {/* Search Box */}
        <form
          action="/admin/users"
          method="GET"
          className="relative max-w-xs w-full"
        >
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name or email..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-surface/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted"
          />
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Users Card List */}
      <Card className="border-border bg-surface/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="font-heading font-bold text-lg text-foreground">
            System Profiles
          </CardTitle>
          <CardDescription className="text-xs">
            Showing {profiles?.length || 0} registered user profiles.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border/50">
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 hover:bg-surface/30 transition-colors"
              >
                {/* Profile Meta info */}
                <div className="flex items-center gap-4">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Avatar"
                      width={44}
                      height={44}
                      className="rounded-full object-cover border border-primary/20 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                      {profile.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate max-w-40 sm:max-w-72">
                        {profile.full_name || "Anonymous User"}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase border shrink-0 ${
                          profile.role === "admin"
                            ? "bg-success/15 text-success border-success/20"
                            : "bg-primary/15 text-primary border-primary/20"
                        }`}
                      >
                        {profile.role}
                      </span>
                      {profile.status === "banned" && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-error/15 text-error border border-error/20 shrink-0">
                          Banned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate max-w-48 sm:max-w-72 mt-0.5">
                      {profile.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Joined: {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Profile Control Actions */}
                <div className="flex items-center gap-3">
                  {/* Change Role Action */}
                  <form
                    action={updateUserRole.bind(
                      null,
                      profile.id,
                      profile.role === "admin" ? "user" : "admin"
                    )}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-xs font-semibold px-4 border border-border hover:bg-elevated cursor-pointer"
                    >
                      {profile.role === "admin" ? "Demote" : "Promote to Admin"}
                    </Button>
                  </form>

                  {/* Change Status (Ban/Unban) Action */}
                  <form
                    action={updateUserStatus.bind(
                      null,
                      profile.id,
                      profile.status === "active" ? "banned" : "active"
                    )}
                  >
                    <Button
                      type="submit"
                      variant={
                        profile.status === "active"
                          ? "destructive"
                          : "outline"
                      }
                      size="sm"
                      className="text-xs font-semibold px-4 cursor-pointer"
                    >
                      {profile.status === "active" ? "Ban User" : "Unban User"}
                    </Button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-sm text-muted">
              No profiles found matching search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
