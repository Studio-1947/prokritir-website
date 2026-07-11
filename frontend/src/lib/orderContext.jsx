import React, { createContext, useContext, useState, useCallback } from "react";

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const [presetSku, setPresetSku] = useState(null);

  const open = useCallback((sku = null) => {
    setPresetSku(sku);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <OrderContext.Provider value={{ isOpen, open, close, presetSku }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
