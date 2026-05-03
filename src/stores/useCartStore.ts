import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  sku: string;
  name: string;
  price: number;
  qty: number;
  imageUrl: string;
  slug: string;
  brand: string;
}

interface CartState {
  items: CartItem[];
}

interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  isInCart: (productId: number) => boolean;
}

export type CartStoreType = CartStore;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: Omit<CartItem, "qty">) =>
        set((state: CartState) => {
          const existing = state.items.find((i: CartItem) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i: CartItem) =>
                i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        }),
      removeItem: (productId: number) =>
        set((state: CartState) => ({
          items: state.items.filter((i: CartItem) => i.productId !== productId),
        })),
      updateQty: (productId: number, qty: number) =>
        set((state: CartState) => {
          if (qty <= 0) {
            return { items: state.items.filter((i: CartItem) => i.productId !== productId) };
          }
          return {
            items: state.items.map((i: CartItem) =>
              i.productId === productId ? { ...i, qty } : i
            ),
          };
        }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum: number, i: CartItem) => sum + i.qty, 0),
      totalPrice: () =>
        get().items.reduce((sum: number, i: CartItem) => sum + i.price * i.qty, 0),
      isInCart: (productId: number) => get().items.some((i: CartItem) => i.productId === productId),
    }),
    { name: "bearingpro-cart" }
  )
);
