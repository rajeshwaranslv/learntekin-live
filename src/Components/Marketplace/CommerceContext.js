import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { commerceApi } from "./commerceApi";

const CommerceContext = createContext(null);
const STORAGE_KEY = "ltin-commerce-cart-v1";

const calculateTotals = (items, couponDiscount = 0) => {
  const activeItems = items.filter((item) => !item.savedForLater);
  const subtotal = activeItems.reduce((sum, item) => sum + item.product.price.offer * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal >= 4999 || subtotal === 0 ? 0 : 299;
  const discount = Math.min(Math.max(0, Number(couponDiscount) || 0), subtotal);
  return {
    subtotal,
    gst,
    shipping,
    discount,
    total: Math.max(0, subtotal + gst + shipping - discount),
    count: activeItems.reduce((sum, item) => sum + item.quantity, 0),
  };
};

export function CommerceProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState([]);
  const [compare, setCompare] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("ltin-commerce-theme") || "light");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("ltin-commerce-theme", theme);
  }, [theme]);

  const totals = useMemo(() => calculateTotals(cartItems, couponDiscount), [cartItems, couponDiscount]);
  const clearAppliedCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
  };

  const addToCart = (product, quantity = 1) => {
    clearAppliedCoupon();
    setCartItems((items) => {
      const existing = items.find((item) => item.product._id === product._id);
      if (existing) {
        return items.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity, savedForLater: false }
            : item
        );
      }
      return [...items, { product, quantity, savedForLater: false }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    clearAppliedCoupon();
    setCartItems((items) =>
      items.map((item) =>
        item.product._id === productId ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    clearAppliedCoupon();
    setCartItems((items) => items.filter((item) => item.product._id !== productId));
  };

  const saveForLater = (productId) => {
    clearAppliedCoupon();
    setCartItems((items) =>
      items.map((item) =>
        item.product._id === productId ? { ...item, savedForLater: !item.savedForLater } : item
      )
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((items) =>
      items.some((item) => item._id === product._id)
        ? items.filter((item) => item._id !== product._id)
        : [product, ...items]
    );
  };

  const toggleCompare = (product) => {
    setCompare((items) =>
      items.some((item) => item._id === product._id)
        ? items.filter((item) => item._id !== product._id)
        : [product, ...items].slice(0, 4)
    );
  };

  const applyCoupon = async (code) => {
    if (!cartItems.some((item) => !item.savedForLater)) {
      setCouponCode("");
      setCouponDiscount(0);
      return { valid: false };
    }
    const result = await commerceApi.validateCoupon({
      code,
      items: cartItems
        .filter((item) => !item.savedForLater)
        .map((item) => ({ productId: item.product._id, quantity: item.quantity })),
    });
    if (!result.valid) {
      setCouponCode("");
      setCouponDiscount(0);
      return result;
    }
    setCouponCode(String(code || "").trim().toUpperCase());
    setCouponDiscount(result.totals?.discountAmount || 0);
    return result;
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode("");
    setCouponDiscount(0);
  };

  const value = {
    cartItems,
    wishlist,
    compare,
    couponCode,
    couponDiscount,
    theme,
    totals,
    setTheme,
    addToCart,
    updateQuantity,
    removeFromCart,
    saveForLater,
    toggleWishlist,
    toggleCompare,
    applyCoupon,
    clearCart,
  };

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export const useCommerce = () => useContext(CommerceContext);
