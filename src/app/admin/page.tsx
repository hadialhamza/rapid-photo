import { createAdminClient } from "@/lib/supabase/admin";
import { Search, Image as ImageIcon } from "lucide-react";
import { AdminImageCard } from "@/components/admin/AdminImageCard";

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
        <form action="/admin" method="GET" className="relative max-w-xs w-full">
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

      {/* Denser Grid of uploaded images */}
      {typedImages && typedImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {typedImages.map((image) => (
            <AdminImageCard key={image.id} image={image} />
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
