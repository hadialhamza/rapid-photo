import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/rp-logo2.png"
                alt="Rapid Photo Logo"
                width={120}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted max-w-sm">
              Create official passport and visa photos in seconds. 100% free,
              secure, and high-quality print-ready layouts.
            </p>
            <div className="flex items-center gap-4 text-muted">
              <Link
                href="https://github.com/hadialhamza/rapid-photo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <span className="sr-only">GitHub</span>
                <Image
                  src="/resource/github.svg"
                  alt="GitHub"
                  width={30}
                  height={30}
                  className="w-7 h-7 opacity-70 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/features"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-muted hover:text-primary transition-colors"
                >
                  How it Works
                </Link>
              </li>
              <li>
                <Link
                  href="/formats"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Supported Formats
                </Link>
              </li>
              <li>
                <Link
                  href="/editor"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Start Editing
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-subtle text-sm">
            &copy; {new Date().getFullYear()} Rapid Photo. All rights reserved.
          </p>
          <p className="text-subtle text-sm flex items-center gap-1">
            Developed by{" "}
            <span className="font-medium text-foreground">Hadi Al Hamza</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
