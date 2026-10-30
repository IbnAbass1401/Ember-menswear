import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  key: string;
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "key" | "qty">) => void;
  change: (key: string, delta: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (item) =>
        set((s) => {
          const key = `${item.id}-${item.size ?? ""}`;
          const found = s.items.find((i) => i.key === key);
          const items = found
            ? s.items.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
            : [...s.items, { ...item, key, qty: 1 }];
          return { items, open: true };
        }),
      change: (key, delta) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.key === key ? { ...i, qty: i.qty + delta } : i))
            .filter((i) => i.qty > 0),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "ember-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ items: s.items }),
    }
  )
);