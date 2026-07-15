import React, { createContext, useContext, useState, useCallback } from "react";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [presetSku, setPresetSku] = useState(null);
  const [category, setCategory] = useState("water"); // "water" | "masala" | "chai"

  const open = useCallback((sku = null, cat = "water") => {
    setPresetSku(sku);
    setCategory(cat);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <OrderContext.Provider value={{ isOpen, open, close, presetSku, category }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
