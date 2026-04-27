import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/rp-logo.png"
            alt="Rapid Photo Logo"
            width={120}
            height={60}
            className="h-15 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
          <Link
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
        </nav>
      </div>
    </header>
  );
}
