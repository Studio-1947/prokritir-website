import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/lib/orderContext";
import { listProducts, createOrder } from "@/lib/api";
import { BOTTLE_IMG, PRODUCT_IMAGES, CATEGORY_FALLBACK_IMAGE } from "@/lib/brand";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const emptyCustomer = {
  name: "", phone: "", email: "", address_line: "", city: "", state: "West Bengal", pincode: "", notes: "",
};

const OrderModal = () => {
  const { isOpen, close, presetSku, category } = useOrder();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({}); // sku → quantity
  const [step, setStep] = useState(1); // 1 = products, 2 = details
  const [customer, setCustomer] = useState(emptyCustomer);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const getProductImage = (p) => {
    if (p.sku.startsWith("PJ-")) return BOTTLE_IMG;
    if (PRODUCT_IMAGES[p.sku]) return PRODUCT_IMAGES[p.sku];
    if (p.sku.startsWith("PM-")) return CATEGORY_FALLBACK_IMAGE.masala;
    if (p.sku.startsWith("PC-")) return CATEGORY_FALLBACK_IMAGE.chai;
    return BOTTLE_IMG;
  };

  // Load products once
  useEffect(() => {
    if (!isOpen || products.length) return;
    listProducts().then(setProducts).catch(() => setError("Could not load products."));
  }, [isOpen, products.length]);

  // Reset when opening / handle presetSku
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setError(null);
      if (presetSku) setCart({ [presetSku]: 1 });
    } else {
      setTimeout(() => {
        setCart({});
        setCustomer(emptyCustomer);
      }, 250);
    }
  }, [isOpen, presetSku]);

  const setQty = (sku, delta) => {
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[sku] || 0) + delta;
      if (q <= 0) delete next[sku];
      else next[sku] = Math.min(q, 99);
      return next;
    });
  };

  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([sku, quantity]) => {
      const p = products.find((x) => x.sku === sku);
      return p ? { ...p, quantity, line_total: p.price * quantity } : null;
    }).filter(Boolean);
  }, [cart, products]);

  const subtotal = cartItems.reduce((s, i) => s + i.line_total, 0);
  const shipping = subtotal === 0 ? 0 : (subtotal >= 300 ? 0 : 40);
  const total = subtotal + shipping;

  const canContinue = cartItems.length > 0;
  const canSubmit = customer.name.trim().length >= 2
    && customer.phone.trim().length >= 7
    && customer.address_line.trim().length >= 4
    && customer.city.trim().length >= 2
    && customer.state.trim().length >= 2
    && customer.pincode.trim().length >= 4
    && cartItems.length > 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        items: Object.entries(cart).map(([sku, quantity]) => ({ sku, quantity })),
        customer: {
          ...customer,
          email: customer.email.trim() || undefined,
          notes: customer.notes.trim() || undefined,
        },
      };
      const order = await createOrder(payload);
      close();
      navigate(`/success/${order.id}`);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Something went wrong.";
      setError(typeof msg === "string" ? msg : "Please double-check the form.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => (p.category || "water") === category);
  }, [products, category]);

  // Group products by size for cleaner layout
  const groups = useMemo(() => {
    const g = {};
    filteredProducts.forEach((p) => { (g[p.size] = g[p.size] || []).push(p); });
    return g;
  }, [filteredProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-stretch md:items-center md:justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          data-testid="order-modal-backdrop"
        >
          <motion.div
            className="relative w-full md:max-w-[1080px] md:my-8 bg-[#0A192F] text-white md:rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col md:flex-row max-h-screen md:max-h-[92vh]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-testid="order-modal"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full flex items-center justify-center border border-white/15 bg-black/40 backdrop-blur-md hover:bg-white/10"
              aria-label="Close"
              data-testid="order-modal-close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* LEFT — product picker OR details form */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00E5FF]/25 to-[#135033]/40 border border-white/15 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-cyan-200" />
                </div>
                <div>
                  <div className="chapter-tag mb-1">
                    Order · {category === "masala" ? "Prokritir Masala" : category === "chai" ? "Prokritir Chai" : "Prokritir Jol"}
                  </div>
                  <div className="font-display text-2xl md:text-3xl">
                    {step === 1 
                      ? (category === "masala" ? "Choose your spices" : category === "chai" ? "Choose your tea blend" : "Choose your bottles")
                      : "Where should we send it?"
                    }
                  </div>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6 text-[11px] tracking-[0.3em] uppercase text-white/50">
                <span className={step === 1 ? "text-cyan-200" : ""} data-testid="step-1-label">01 · Products</span>
                <span className="h-px w-6 bg-white/25" />
                <span className={step === 2 ? "text-cyan-200" : ""} data-testid="step-2-label">02 · Delivery</span>
              </div>

              {step === 1 && (
                <div className="space-y-8" data-testid="products-step">
                  {Object.entries(groups).map(([size, items]) => (
                    <div key={size}>
                      <div className="text-xs tracking-[0.25em] uppercase text-white/60 mb-3">
                        {size} {category === "water" ? "bottles" : "pack"}
                      </div>
                      <div className="grid gap-3">
                        {items.map((p) => {
                           const qty = cart[p.sku] || 0;
                           return (
                             <div
                               key={p.sku}
                               className={`flex items-center gap-4 p-4 rounded-xl border ${qty > 0 ? "border-cyan-300/40 bg-cyan-300/5" : "border-white/10 bg-white/[0.02]"} transition-colors`}
                               data-testid={`product-${p.sku}`}
                             >
                               <div className="h-14 w-14 rounded-md bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                                 <img src={getProductImage(p)} alt="" className="h-full w-full object-cover" />
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium">{p.label}</div>
                                 <div className="text-white/55 text-sm">
                                   {p.name} · {p.size}
                                 </div>
                               </div>
                               <div className="font-display text-lg text-white/95 mr-4">{inr(p.price)}</div>
                               <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setQty(p.sku, -1)}
                                  disabled={qty === 0}
                                  className="h-8 w-8 rounded-full border border-white/15 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                                  data-testid={`decrement-${p.sku}`}
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <div className="w-8 text-center font-medium tabular-nums" data-testid={`qty-${p.sku}`}>{qty}</div>
                                <button
                                  onClick={() => setQty(p.sku, +1)}
                                  className="h-8 w-8 rounded-full border border-cyan-300/50 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20 flex items-center justify-center"
                                  data-testid={`increment-${p.sku}`}
                                  aria-label="Increase"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {!products.length && (
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading catalogue…
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4" data-testid="details-step">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="Full name *" testId="input-name">
                      <input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Arindam Chatterjee"
                        className={inputCls}
                        data-testid="input-name"
                      />
                    </Field>
                    <Field label="Phone *" testId="input-phone">
                      <input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 90000 00000"
                        className={inputCls}
                        data-testid="input-phone"
                      />
                    </Field>
                    <Field label="Email (optional)" testId="input-email">
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="you@domain.com"
                        className={inputCls}
                        data-testid="input-email"
                      />
                    </Field>
                    <Field label="Pincode *" testId="input-pincode">
                      <input
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        placeholder="741101"
                        className={inputCls}
                        data-testid="input-pincode"
                      />
                    </Field>
                  </div>
                  <Field label="Address *" testId="input-address">
                    <input
                      value={customer.address_line}
                      onChange={(e) => setCustomer({ ...customer, address_line: e.target.value })}
                      placeholder="House no., Street, Landmark"
                      className={inputCls}
                      data-testid="input-address"
                    />
                  </Field>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Field label="City *" testId="input-city">
                      <input
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Nadia"
                        className={inputCls}
                        data-testid="input-city"
                      />
                    </Field>
                    <Field label="State *" testId="input-state">
                      <input
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        placeholder="West Bengal"
                        className={inputCls}
                        data-testid="input-state"
                      />
                    </Field>
                  </div>
                  <Field label="Delivery notes (optional)" testId="input-notes">
                    <textarea
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="Ring the bell at gate 2…"
                      rows={3}
                      className={inputCls}
                      data-testid="input-notes"
                    />
                  </Field>

                  <div className="mt-2 flex items-start gap-2 text-[12px] text-white/55">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 text-cyan-200" />
                    <span>Delivery available across West Bengal · Cash-on-delivery available. We&apos;ll call before dispatch.</span>
                  </div>

                  {error && (
                    <div className="mt-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3" data-testid="order-error">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — cart summary */}
            <div className="md:w-[360px] flex-shrink-0 bg-[#061021] border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-8 flex flex-col">
              <div className="chapter-tag mb-4">Your order</div>
              <div className="flex-1 overflow-y-auto pr-1 space-y-3" data-testid="cart-summary">
                {cartItems.length === 0 && (
                  <div className="text-white/50 text-sm italic">No bottles selected yet.</div>
                )}
                {cartItems.map((i) => (
                  <div key={i.sku} className="flex justify-between gap-3 text-sm" data-testid={`cart-line-${i.sku}`}>
                    <div className="min-w-0">
                      <div className="truncate">{i.label}</div>
                      <div className="text-white/50 text-xs">{i.size}{i.pack > 1 ? ` · pack of ${i.pack}` : ""}  ·  ×{i.quantity}</div>
                    </div>
                    <div className="font-medium whitespace-nowrap">{inr(i.line_total)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 text-sm text-white/75">
                <div className="flex justify-between"><span>Subtotal</span><span data-testid="summary-subtotal">{inr(subtotal)}</span></div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span data-testid="summary-shipping">{shipping === 0 && subtotal > 0 ? "Free" : inr(shipping)}</span>
                </div>
                {subtotal > 0 && subtotal < 300 && (
                  <div className="text-[11px] text-cyan-200/70">Add {inr(300 - subtotal)} more for free shipping.</div>
                )}
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-white text-base">
                  <span className="font-display">Total</span>
                  <span className="font-display" data-testid="summary-total">{inr(total)}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canContinue}
                    className="w-full py-3 rounded-full bg-cyan-300 text-[#0A192F] font-medium text-[13px] tracking-[0.2em] uppercase hover:bg-cyan-200 transition-colors disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed"
                    data-testid="continue-to-details"
                  >
                    Continue to delivery
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className="w-full py-3 rounded-full bg-cyan-300 text-[#0A192F] font-medium text-[13px] tracking-[0.2em] uppercase hover:bg-cyan-200 transition-colors disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      data-testid="place-order-btn"
                    >
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing…</> : <>Place order · {inr(total)}</>}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      disabled={submitting}
                      className="w-full py-2 rounded-full border border-white/15 text-[12px] tracking-[0.25em] uppercase text-white/70 hover:bg-white/5 transition-colors disabled:opacity-40"
                      data-testid="back-to-products"
                    >
                      ← Back to bottles
                    </button>
                  </>
                )}
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 text-center mt-2">
                  Payment on delivery · No card charged today
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const inputCls = "w-full bg-white/[0.04] border border-white/10 focus:border-cyan-300/60 focus:outline-none rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 text-[14px]";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-[11px] tracking-[0.2em] uppercase text-white/55 mb-1.5">{label}</span>
    {children}
  </label>
);

export default OrderModal;
