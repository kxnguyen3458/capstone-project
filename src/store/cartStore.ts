// src/store/cartStore.ts
import { create } from "zustand";
import type { AxiosInstance } from "axios";
import {
  fetchCartByCustomer,
  createCartItem,
  updateCartItem,
  deleteCartItemAPI,
} from "@/services/cartService";

export type CartItem = {
  clientId: string;      // id of item in FE
  id?: string;           // id of item in BE
  preferredDate: Date;
  preferredTime: string;
  service_id: string;
  vendor_id: string;

  name: string;
  description: string;
  price: string;  
  duration: number;
};

type CartStore = {
  cart: CartItem[];
  isUpdating: boolean;

  loadCart: (api: AxiosInstance) => Promise<void>;

  addOrUpdateItem: (
    api: AxiosInstance,
    item: Partial<CartItem> & {
      clientId?: string;
      id?: string;
      preferredDate: Date;
      preferredTime: string;
      service_id: string;
      vendor_id: string;
    }
  ) => Promise<void>;

  deleteItem: (api: AxiosInstance, clientId: string) => Promise<void>;

  clearCart: (api: AxiosInstance) => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],
  isUpdating: false,

  loadCart: async (api) => {
    if (!api) return;

    set({ isUpdating: true });

    try {
      const items = await fetchCartByCustomer(api);
      if (items) {
        set({ cart: items });
      }
    } finally {
      set({ isUpdating: false });
    }
  },

  addOrUpdateItem: async (api, item) => {
    if (!api) return;

    const isEdit = !!item.id;
    const state = get();
    const fallback = state.cart;

    set({ isUpdating: true });

    const clientId = item.clientId ?? crypto.randomUUID();

    let newCart: CartItem[];

    if (isEdit) {
      newCart = state.cart.map((it) =>
        it.id === item.id
          ? {
              ...it,
              ...item,
              clientId,
            }
          : it
      );
    } else {
      newCart = [
        ...state.cart,
        {
          ...item,
          clientId,
        } as CartItem,
      ];
    }

    set({ cart: newCart });

    try {
      let serverItem;

      if (isEdit) {
        serverItem = await updateCartItem(api, item.id!, item as any);
      } else {
        serverItem = await createCartItem(api, item as any);
      }

      serverItem.clientId = clientId;

      set({
        cart: get().cart.map((it) =>
          it.clientId === clientId ? serverItem : it
        ),
      });
    } catch (e) {
      console.error("Failed to sync item:", e);
      set({ cart: fallback });
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteItem: async (api, clientId: string) => {
    if (!api) return;

    const state = get();
    const fallback = state.cart;

    const item = state.cart.find((c) => c.clientId === clientId);
    if (!item) return;

    set({
      cart: state.cart.filter((c) => c.clientId !== clientId),
    });

    try {
      if (item.id) {
        await deleteCartItemAPI(api, item.id);
      }
    } catch (e) {
      console.error("Delete sync failed:", e);
      set({ cart: fallback });
    }
  },

  clearCart: async (api) => {
    const currentCart = get().cart;

    set({ cart: [], isUpdating: true });

    if (!api) {
      set({ isUpdating: false });
      return;
    }

    try {
      await Promise.all(
        currentCart
          .filter((item) => item.id)
          .map((item) => deleteCartItemAPI(api, item.id!))
      );
    } catch (e) {
      console.error("Failed to clear cart on server:", e);
    } finally {
      set({ isUpdating: false });
    }
  },
}));
