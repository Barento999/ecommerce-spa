import { create } from "zustand";

export const useCartStore = create((set) => ({
  items: [], // Standardize to 'items'

  addToCart: (product) =>
    set((state) => {
      const exist = state.items.find((p) => p.id === product.id);
      if (exist) {
        return {
          items: state.items.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),

  updateQuantity: (productId, newQuantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ),
    })),

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));
