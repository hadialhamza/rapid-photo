import { create } from "zustand";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  
  setUser: (user: User | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthModalOpen: false,

  setUser: (user) => set({ user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  signInWithGoogle: async () => {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/api/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });
    if (error) {
      console.error("Google login failed:", error.message);
      throw error;
    }
  },

  signOut: async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out failed:", error.message);
      throw error;
    }
    set({ user: null });
  },
}));
