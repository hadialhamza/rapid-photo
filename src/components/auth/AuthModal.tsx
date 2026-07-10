"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useSearchParams } from "next/navigation";

export function AuthModal() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isOpen = useAuthStore((state) => state.isAuthModalOpen);
  const openModal = useAuthStore((state) => state.openAuthModal);
  const closeModal = useAuthStore((state) => state.closeAuthModal);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading) return;

    if (searchParams?.get("auth") === "required") {
      if (!user) {
        openModal();
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("auth");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, [searchParams, openModal, user, isLoading]);

  const handleGoogleLogin = async () => {
    setIsPending(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setIsPending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {/* Content */}
      <div className="text-center space-y-3 mt-4">
        <h2 className="text-2xl font-bold font-heading bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to Rapid Photo
        </h2>
        <p className="text-sm text-muted">
          Create official passport & visa photos. Log in with Google to
          access the editor and save your photo history.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-destructive/10 text-destructive rounded-xl flex items-start gap-3 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed">{error}</p>
        </div>
      )}

      {/* Google Sign In Button */}
      <div className="mt-8">
        <Button
          variant="default"
          size="lg"
          className="w-full text-sm font-semibold flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 border-transparent hover:border-transparent py-4 shadow-lg active:scale-[0.98]"
          onClick={handleGoogleLogin}
          disabled={isPending}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
              Connecting to Google...
            </div>
          ) : (
            <>
              {/* Google G Icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>

      {/* Privacy details */}
      <div className="mt-8 text-center">
        <span className="text-[11px] text-muted-foreground leading-normal">
          By logging in, you agree to our privacy policy. Your data is
          stored on secure cloud services and processed in compliance with
          official identity guidelines.
        </span>
      </div>
    </Modal>
  );
}
