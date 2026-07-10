import { createAdminClient } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  Users,
  Image as ImageIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

export default async function AdminDashboardPage() {
  const adminClient = createAdminClient();

  // Fetch metrics in parallel using service_role client
  const [
    { count: totalUsers },
    { count: totalImages },
    { count: bannedUsers },
    { count: adminUsers },
    { data: recentProfiles },
    { data: recentImages },
  ] = await Promise.all([
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
    adminClient
      .from("user_images")
      .select("*", { count: "exact", head: true }),
    adminClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("status", "banned"),
    adminClient
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin"),
    adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    adminClient
      .from("user_images")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      description: "Registered platform users",
      icon: Users,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      title: "Total Images",
      value: totalImages || 0,
      description: "Generated passport/visa photos",
      icon: ImageIcon,
      color: "text-secondary bg-secondary/10 border-secondary/20",
    },
    {
      title: "Admins",
      value: adminUsers || 0,
      description: "System administrators",
      icon: ShieldCheck,
      color: "text-success bg-success/10 border-success/20",
    },
    {
      title: "Banned Users",
      value: bannedUsers || 0,
      description: "Banned user accounts",
      icon: ShieldAlert,
      color: "text-error bg-error/10 border-error/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-wide">
          Overview Dashboard
        </h1>
        <p className="text-sm text-muted">
          System-wide statistics and logs for Rapid Photo.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const IconComponent = metric.icon;
          return (
            <Card key={idx} className="border-border bg-surface/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {metric.title}
                </CardTitle>
                <div
                  className={`p-2.5 rounded-2xl border ${metric.color} shrink-0`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading text-foreground">
                  {metric.value}
                </div>
                <CardDescription className="text-xs mt-1">
                  {metric.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations */}
        <Card className="border-border bg-surface/50">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg text-foreground">
              Recent Signups
            </CardTitle>
            <CardDescription className="text-xs">
              Latest user registrations on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProfiles && recentProfiles.length > 0 ? (
              recentProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-surface/30"
                >
                  <div className="flex items-center gap-3">
                    {profile.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt="Avatar"
                        width={36}
                        height={36}
                        className="rounded-full object-cover border border-primary/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {profile.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate max-w-44 sm:max-w-64">
                        {profile.full_name || "New User"}
                      </p>
                      <p className="text-xs text-muted truncate max-w-44 sm:max-w-64">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      profile.role === "admin"
                        ? "bg-success/15 text-success border border-success/20"
                        : "bg-primary/15 text-primary border border-primary/20"
                    }`}
                  >
                    {profile.role}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted text-center py-6">
                No users found.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Image Generations */}
        <Card className="border-border bg-surface/50">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-lg text-foreground">
              Recent Activity
            </CardTitle>
            <CardDescription className="text-xs">
              Latest visa and passport photo generations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentImages && recentImages.length > 0 ? (
              recentImages.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-border bg-surface/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary border border-secondary/20 flex items-center justify-center font-bold">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate max-w-44 sm:max-w-64">
                        {image.format_name}
                      </p>
                      <p className="text-xs text-muted">
                        {image.dimensions} •{" "}
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {image.format_id}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted text-center py-6">
                No image generations found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
