"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Formats", href: "/formats" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo/rp-logo2.png"
            alt="Rapid Photo Logo"
            width={120}
            height={60}
            className="h-15 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center p-1 rounded-full border border-border bg-surface/50 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-surface",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <Link href="/editor">
            <Button className="font-semibold h-10">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
