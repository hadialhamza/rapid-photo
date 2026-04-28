import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 text-center">
      {/* 404 Glowing Element */}
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />

        <div className="flex flex-col items-center">
          <SearchX className="h-8 w-8 text-primary mb-1" />
          <span className="font-heading text-4xl font-black text-primary leading-none">
            404
          </span>
        </div>
      </div>

      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-heading">
        Page Not Found
      </h2>

      <p className="mb-8 max-w-lg text-lg text-muted">
        The page you are looking for does not exist, has been removed, or is
        temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/" tabIndex={-1} className="w-full sm:w-auto">
          <Button
            variant="default"
            size="lg"
            icon={<Home className="h-4 w-4" />}
            className="w-full shadow-[0_0_20px_rgba(255,49,49,0.2)] hover:shadow-[0_0_30px_rgba(255,49,49,0.4)]"
          >
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
