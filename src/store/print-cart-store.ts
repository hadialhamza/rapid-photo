import { create } from "zustand";
import { PhotoFormat } from "@/lib/constants/photo-formats";

export interface CartItem {
  id: string;
  imageUrl: string; 
  format: PhotoFormat;
  copies: number;
}

interface PrintCartState {
  items: CartItem[];
  addItem: (imageUrl: string, format: PhotoFormat, copies: number) => Promise<void>;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, copies: number) => void;
  clearCart: () => void;
}

export const usePrintCartStore = create<PrintCartState>((set, get) => ({
  items: [],
  addItem: async (imageUrl, format, copies) => {
    try {
      // Fetch the blob to create a DEDICATED ObjectURL for the cart
      // This prevents the URL from being revoked when the Editor resets
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const persistentUrl = URL.createObjectURL(blob);
      
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 9),
        imageUrl: persistentUrl,
        format,
        copies,
      };

      set((state) => ({
        items: [...state.items, newItem],
      }));
    } catch (err) {
      console.error("Failed to add item to print cart:", err);
    }
  },
  removeItem: (id) => {
    const item = get().items.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.imageUrl);
    }
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },
  updateQuantity: (id, copies) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, copies } : item
      ),
    })),
  clearCart: () => {
    get().items.forEach((item) => URL.revokeObjectURL(item.imageUrl));
    set({ items: [] });
  },
}));
