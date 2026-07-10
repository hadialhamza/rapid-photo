import { createAdminClient } from "@/lib/supabase/admin";
import { deleteUserImage } from "@/app/actions/admin-actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, Image as ImageIcon, Trash2, Calendar, Maximize2 } from "lucide-react";
import Image from "next/image";

export default async function AdminImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";

  const adminClient = createAdminClient();
  let query = adminClient
    .from("user_images")
    .select(`
      *,
      profiles:user_id (
        email,
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.ilike("format_name", `%${searchQuery}%`);
  }

  const { data: images, error } = await query;

  if (error) {
    console.error("Fetch admin images error:", error);
  }

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

  // Cast join type properly
  const typedImages = (images || []) as UserImage[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-wide">
            Image Logs
          </h1>
          <p className="text-sm text-muted">
            Monitor and delete visa/passport photos generated on the platform.
          </p>
        </div>

        {/* Search Box */}
        <form
          action="/admin/images"
          method="GET"
          className="relative max-w-xs w-full"
        >
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by format (e.g. Visa)..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-surface/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted"
          />
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Grid of uploaded images */}
      {typedImages && typedImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {typedImages.map((image) => (
            <Card
              key={image.id}
              className="border-border bg-surface/50 overflow-hidden flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video bg-neutral-950 flex items-center justify-center p-4 border-b border-border/50 group/img">
                <Image
                  src={image.image_url}
                  alt={image.format_name}
                  width={200}
                  height={150}
                  className="max-h-36 w-auto object-contain rounded-lg border border-border shadow-md group-hover/img:scale-[1.03] transition-transform duration-300"
                  unoptimized // Bypasses optimization constraints for dynamic images
                />
                
                {/* External Preview Link Button overlay */}
                <a
                  href={image.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-2 bg-background/80 hover:bg-background text-foreground hover:text-primary rounded-xl border border-border backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-all duration-300 hover:scale-105"
                  title="View full image"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>

              {/* Image details */}
              <CardHeader className="py-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-secondary/15 text-secondary border border-secondary/20 rounded-full uppercase">
                    {image.format_id}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(image.created_at).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="font-heading font-bold text-base text-foreground mt-2">
                  {image.format_name}
                </CardTitle>
                <CardDescription className="text-xs">
                  Dimensions: {image.dimensions}
                </CardDescription>
              </CardHeader>

              {/* Owner and Actions bar */}
              <CardContent className="pt-2 border-t border-border/30 flex items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-2 min-w-0">
                  {image.profiles?.avatar_url ? (
                    <Image
                      src={image.profiles.avatar_url}
                      alt="Owner Avatar"
                      width={28}
                      height={28}
                      className="rounded-full object-cover border border-primary/20 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {image.profiles?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate max-w-28 sm:max-w-44">
                      {image.profiles?.full_name || "User"}
                    </p>
                    <p className="text-[10px] text-muted truncate max-w-28 sm:max-w-44">
                      {image.profiles?.email || "Unknown Email"}
                    </p>
                  </div>
                </div>

                {/* Delete button */}
                <form action={deleteUserImage.bind(null, image.id)}>
                  <Button
                    type="submit"
                    variant="destructive"
                    size="sm"
                    className="h-8 rounded-xl px-3 flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-surface/10 text-muted">
          <ImageIcon className="w-10 h-10 text-muted-foreground/35 mx-auto mb-3" />
          <p className="text-sm">No uploaded images found in database logs.</p>
        </div>
      )}
    </div>
  );
}
