import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

const useWishlistStore = create(
  subscribeWithSelector(
    persist(
      (set) => ({
        items: [],
        addToWishlist: (product) =>
          set((state) => ({
            items: [
              ...state.items,
              { ...product, wishlistAddedAt: new Date().toISOString() },
            ],
          })),
        removeFromWishlist: (productId) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== productId),
          })),
        clearWishlist: () => set({ items: [] }),
      }),
      {
        name: 'wishlist-storage',
      }
    )
  )
);

export default useWishlistStore;
