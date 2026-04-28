"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to the console
    console.error("Application Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl font-heading">
        Oops! Something went wrong
      </h2>
      
      <p className="mb-8 max-w-lg text-lg text-muted">
        We encountered an unexpected issue while processing your request. Don&apos;t worry, your data is safe and local.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          onClick={() => reset()}
          variant="default"
          size="lg"
          icon={<RefreshCcw className="h-4 w-4" />}
          className="shadow-[0_0_20px_rgba(255,49,49,0.2)] hover:shadow-[0_0_30px_rgba(255,49,49,0.4)]"
        >
          Try Again
        </Button>
        
        <Link href="/" tabIndex={-1}>
          <Button
            variant="outline"
            size="lg"
            icon={<Home className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Return Home
          </Button>
        </Link>
      </div>

      {error.digest && (
        <p className="mt-8 text-xs text-subtle font-mono bg-surface px-3 py-1.5 rounded-md border border-border">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
}
