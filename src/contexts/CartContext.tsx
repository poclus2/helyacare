"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;           // line_item id from Medusa
  variant_id: string;
  product_id: string;
  title: string;
  subtitle?: string;    // e.g. "Abonnement mensuel"
  thumbnail?: string;
  quantity: number;
  unit_price: number;   // in cents / smallest unit
  currency_code: string;
}

export interface CartState {
  id: string | null;
  items: CartItem[];
  total: number;
  subtotal: number;
  currency_code: string;
  region_id?: string;
}

interface CartContextType {
  cart: CartState;
  itemCount: number;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (params: AddItemParams) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

export interface AddItemParams {
  variantId: string;
  quantity: number;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  unit_price: number;
  currency_code?: string;
}

// ─── Defaults ──────────────────────────────────────────────────────────────

const emptyCart: CartState = {
  id: null,
  items: [],
  total: 0,
  subtotal: 0,
  currency_code: "XOF",
};

const CartContext = createContext<CartContextType>({
  cart: emptyCart,
  itemCount: 0,
  isOpen: false,
  isLoading: false,
  openCart: () => {},
  closeCart: () => {},
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  clearCart: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────

const CART_ID_KEY = "helyacare_cart_id";
const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

const medusaHeaders = {
  "Content-Type": "application/json",
  ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Restore cart from Medusa on mount ──────────────────────────────────
  useEffect(() => {
    const savedCartId = typeof window !== "undefined" ? localStorage.getItem(CART_ID_KEY) : null;
    if (savedCartId) {
      fetchCart(savedCartId);
    }
  }, []);

  const fetchCart = async (cartId: string) => {
    try {
      const res = await fetch(`${BACKEND}/store/carts/${cartId}`, { headers: medusaHeaders });
      if (res.ok) {
        const data = await res.json();
        setCart(mapMedusaCart(data.cart));
      } else {
        // Cart expired or not found → reset
        localStorage.removeItem(CART_ID_KEY);
        setCart(emptyCart);
      }
    } catch {
      // Offline or backend not available → use local state
    }
  };

  const createCart = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${BACKEND}/store/carts`, {
        method: "POST",
        headers: medusaHeaders,
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const data = await res.json();
        const id = data.cart.id;
        localStorage.setItem(CART_ID_KEY, id);
        return id;
      }
    } catch {}
    return null;
  };

  const getOrCreateCartId = async (): Promise<string | null> => {
    if (cart.id) return cart.id;
    const savedId = localStorage.getItem(CART_ID_KEY);
    if (savedId) return savedId;
    return createCart();
  };

  // ── Map Medusa cart to our CartState ──────────────────────────────────
  const mapMedusaCart = (medusaCart: any): CartState => ({
    id: medusaCart.id,
    currency_code: medusaCart.currency_code || "XOF",
    total: medusaCart.total || 0,
    subtotal: medusaCart.subtotal || 0,
    region_id: medusaCart.region_id,
    items: (medusaCart.items || []).map((item: any) => ({
      id: item.id,
      variant_id: item.variant_id,
      product_id: item.product_id,
      title: item.title,
      subtitle: item.subtitle || item.variant?.title || undefined,
      thumbnail: item.thumbnail,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency_code: medusaCart.currency_code || "XOF",
    })),
  });

  // ── Add item ──────────────────────────────────────────────────────────
  const addItem = useCallback(async (params: AddItemParams) => {
    setIsLoading(true);
    try {
      const cartId = await getOrCreateCartId();
      if (!cartId) {
        // Fallback: add locally without Medusa
        addItemLocally(params);
        setIsOpen(true);
        return;
      }

      const res = await fetch(`${BACKEND}/store/carts/${cartId}/line-items`, {
        method: "POST",
        headers: medusaHeaders,
        body: JSON.stringify({
          variant_id: params.variantId,
          quantity: params.quantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(mapMedusaCart(data.cart));
      } else {
        // Medusa failed (e.g. variant not found) → add locally
        addItemLocally(params, cartId);
      }
    } catch {
      addItemLocally(params);
    } finally {
      setIsLoading(false);
      setIsOpen(true);
    }
  }, [cart]);

  // Local-only add (no Medusa backend for this variant yet)
  const addItemLocally = (params: AddItemParams, cartId?: string | null) => {
    setCart(prev => {
      const existingIdx = prev.items.findIndex(i => i.variant_id === params.variantId);
      let newItems: CartItem[];

      if (existingIdx >= 0) {
        newItems = prev.items.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + params.quantity } : item
        );
      } else {
        const newItem: CartItem = {
          id: `local_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          variant_id: params.variantId,
          product_id: params.variantId,
          title: params.title,
          subtitle: params.subtitle,
          thumbnail: params.thumbnail,
          quantity: params.quantity,
          unit_price: params.unit_price,
          currency_code: params.currency_code || "XOF",
        };
        newItems = [...prev.items, newItem];
      }

      const subtotal = newItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      return {
        ...prev,
        id: cartId || prev.id,
        items: newItems,
        subtotal,
        total: subtotal,
      };
    });
  };

  // ── Remove item ───────────────────────────────────────────────────────
  const removeItem = useCallback(async (lineItemId: string) => {
    setIsLoading(true);
    const isLocal = lineItemId.startsWith("local_");

    if (!isLocal && cart.id) {
      try {
        await fetch(`${BACKEND}/store/carts/${cart.id}/line-items/${lineItemId}`, {
          method: "DELETE",
          headers: medusaHeaders,
        });
      } catch {}
    }

    setCart(prev => {
      const newItems = prev.items.filter(i => i.id !== lineItemId);
      const subtotal = newItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      return { ...prev, items: newItems, subtotal, total: subtotal };
    });
    setIsLoading(false);
  }, [cart]);

  // ── Update quantity ────────────────────────────────────────────────────
  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    if (quantity <= 0) { await removeItem(lineItemId); return; }

    const isLocal = lineItemId.startsWith("local_");
    if (!isLocal && cart.id) {
      try {
        await fetch(`${BACKEND}/store/carts/${cart.id}/line-items/${lineItemId}`, {
          method: "POST",
          headers: medusaHeaders,
          body: JSON.stringify({ quantity }),
        });
      } catch {}
    }

    setCart(prev => {
      const newItems = prev.items.map(i => i.id === lineItemId ? { ...i, quantity } : i);
      const subtotal = newItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
      return { ...prev, items: newItems, subtotal, total: subtotal };
    });
  }, [cart, removeItem]);

  const clearCart = () => {
    localStorage.removeItem(CART_ID_KEY);
    setCart(emptyCart);
  };

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, itemCount, isOpen, isLoading,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem, removeItem, updateQuantity, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
