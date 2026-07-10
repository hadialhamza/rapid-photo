"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import { AuthModal } from "@/components/auth/AuthModal";
import React, { useEffect, useState, useRef } from "react";
import { LogOut, LayoutDashboard, Sliders, AlertCircle, ShieldAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const isLoading = useAuthStore((state) => state.isLoading);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const signOut = useAuthStore((state) => state.signOut);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBannedModalOpen, setIsBannedModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Sync auth state on mount and listen to changes
  useEffect(() => {
    const supabase = createClient();

    const fetchRole = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();
      setUserRole(data?.role ?? null);
    };

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });

    // Listen for auth state transitions
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setUserRole(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setIsLoading]);

  // Check for banned user redirect query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("auth") === "banned") {
        signOut().then(() => {
          setIsBannedModalOpen(true);
          // Clean the query parameter from the URL
          const url = new URL(window.location.href);
          url.searchParams.delete("auth");
          window.history.replaceState({}, "", url.pathname + url.search);
        });
      }
    }
  }, [signOut, pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "How it Works", href: "/how-it-works" },
    { name: "Formats", href: "/formats" },
  ];

  // Include Dashboard and Admin links if authenticated
  const visibleLinks = [...navLinks];
  if (user) {
    if (userRole === "admin") {
      visibleLinks.push({ name: "Admin", href: "/admin" });
    } else {
      visibleLinks.push({ name: "Dashboard", href: "/dashboard" });
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      if (pathname.startsWith("/editor") || pathname.startsWith("/dashboard")) {
        router.replace("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
              {visibleLinks.map((link) => {
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

            <div className="flex items-center gap-4">
              {isLoading ? (
                // Skeletal Loader to prevent layout shifts
                <div className="h-10 w-28 bg-surface rounded-full border border-border animate-pulse" />
              ) : user ? (
                // Authenticated View
                <div className="flex items-center gap-4">
                  <Link href="/editor" className="hidden sm:block">
                    <Button
                      variant="outline"
                      className="font-semibold h-10 text-xs px-4 bg-primary text-white hover:bg-primary-hover border-transparent hover:shadow-lg active:scale-95 transition-all duration-300 flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Go to Editor
                    </Button>
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full border border-border bg-surface/50 hover:bg-surface transition-all duration-300 active:scale-95"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="User Avatar"
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-8 h-8 border border-primary/20"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-border/50">
                          <p className="text-xs text-muted">Signed in as</p>
                          <p className="text-sm font-semibold truncate text-foreground mt-0.5">
                            {user.user_metadata?.full_name || user.email}
                          </p>
                        </div>
                        <div className="p-1 space-y-0.5">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-elevated/50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/editor"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex sm:hidden items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-elevated/50 transition-colors"
                          >
                            <Sliders className="w-4 h-4" />
                            Go to Editor
                          </Link>
                          {userRole === "admin" && (
                            <Link
                              href="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-elevated/50 transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4 text-secondary animate-pulse" />
                              Admin Console
                            </Link>
                          )}
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 transition-colors text-left cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Guest View
                <div className="flex items-center gap-2">
                  <button
                    onClick={openAuthModal}
                    className="px-4 py-2 text-sm font-semibold text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <Button
                    onClick={openAuthModal}
                    className="font-semibold h-10"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <React.Suspense fallback={null}>
        <AuthModal />
      </React.Suspense>

      <Modal isOpen={isBannedModalOpen} onClose={() => setIsBannedModalOpen(false)}>
        <div className="text-center space-y-4 mt-4">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">
            Account Banned
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            Your account has been banned. If you believe this is a mistake, please contact support.
          </p>
          <Button
            variant="default"
            size="lg"
            className="w-full mt-2 cursor-pointer"
            onClick={() => setIsBannedModalOpen(false)}
          >
            Okay
          </Button>
        </div>
      </Modal>
    </>
  );
}
