import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Loader2, MapPin, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrder } from "@/lib/orderContext";
import { listProducts, createOrder } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import { BOTTLE_IMG, getProductImage } from "@/lib/brand";

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

  // Lock the page behind the modal — otherwise the story scrolls under it.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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

  const filteredProducts = useMemo(
    () => products.filter((p) => (p.category || "water") === category),
    [products, category]
  );

  // Group products by size for a cleaner list
  const groups = useMemo(() => {
    const g = {};
    filteredProducts.forEach((p) => { (g[p.size] = g[p.size] || []).push(p); });
    return g;
  }, [filteredProducts]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-stretch bg-[#020810]/80 backdrop-blur-md md:items-center md:justify-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          data-testid="order-modal-backdrop"
        >
          <motion.div
            className="relative w-full md:max-w-[1040px]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            data-testid="order-modal"
          >
            {/* Frosted rather than clear: this is a form, and the fluid
                background behind it would otherwise read through the fields. */}
            <GlassPanel radius={32} backgroundOpacity={0.62} saturation={1.2}>
            <div className="relative flex max-h-screen flex-col overflow-hidden md:max-h-[92vh] md:flex-row">
            <div className="aurora absolute -left-32 -top-32 h-[420px] w-[420px] opacity-70" aria-hidden />

            <button
              onClick={close}
              className="btn-glass absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center"
              aria-label="Close"
              data-testid="order-modal-close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* LEFT — products / details */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-10">
              <div className="mb-7 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
                  <ShoppingBag className="h-4 w-4 text-[#4fd1e3]" />
                </span>
                <div>
                  <div className="eyebrow">Order · Prokritir Jol</div>
                  <div className="font-display mt-1 text-[30px] leading-none md:text-[34px]">
                    {step === 1 ? "Choose your bottles" : "Where should we send it?"}
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="mb-7 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em]">
                <span className={step === 1 ? "text-[#4fd1e3]" : "text-[color:var(--paper-faint)]"} data-testid="step-1-label">
                  01 · Products
                </span>
                <span className="h-px w-8 bg-white/20" />
                <span className={step === 2 ? "text-[#4fd1e3]" : "text-[color:var(--paper-faint)]"} data-testid="step-2-label">
                  02 · Delivery
                </span>
              </div>

              {step === 1 && (
                <div className="space-y-8" data-testid="products-step">
                  {Object.entries(groups).map(([size, items]) => (
                    <div key={size}>
                      <div className="eyebrow mb-4">{size} bottles</div>
                      <div className="grid gap-3">
                        {items.map((p) => {
                          const qty = cart[p.sku] || 0;
                          return (
                            <div
                              key={p.sku}
                              // flex-wrap + a full-width stepper below `sm`:
                              // on a 390px screen the thumb, name, price and
                              // stepper cannot share one row, and the stepper
                              // was being clipped off the right edge.
                              className={`flex flex-wrap items-center gap-x-3 gap-y-3 rounded-[20px] border p-3 transition-colors duration-300 sm:flex-nowrap sm:gap-x-4 sm:p-4 ${
                                qty > 0
                                  ? "border-[#4fd1e3]/45 bg-[#4fd1e3]/[0.08]"
                                  : "border-white/10 bg-white/[0.04]"
                              }`}
                              data-testid={`product-${p.sku}`}
                            >
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                                <img src={getProductImage(p)} alt="" className="h-11 w-auto object-contain" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-[15px] font-semibold">{p.label}</div>
                                <div className="truncate text-[12.5px] text-[color:var(--paper-faint)]">
                                  {p.name} · {p.size}
                                </div>
                              </div>
                              <div className="font-display shrink-0 text-[22px]">{inr(p.price)}</div>
                              <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto sm:pl-2">
                                <button
                                  onClick={() => setQty(p.sku, -1)}
                                  disabled={qty === 0}
                                  className="btn-glass flex h-9 w-9 items-center justify-center disabled:opacity-30"
                                  data-testid={`decrement-${p.sku}`}
                                  aria-label="Decrease"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <div className="w-7 text-center text-[15px] font-semibold tabular-nums" data-testid={`qty-${p.sku}`}>
                                  {qty}
                                </div>
                                <button
                                  onClick={() => setQty(p.sku, +1)}
                                  className="btn-accent flex h-9 w-9 items-center justify-center"
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
                    <div className="flex items-center gap-2 text-[14px] text-[color:var(--paper-faint)]">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading catalogue…
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4" data-testid="details-step">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Full name *">
                      <input
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="Arindam Chatterjee"
                        className={inputCls}
                        data-testid="input-name"
                      />
                    </Field>
                    <Field label="Phone *">
                      <input
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="+91 98300 98300"
                        className={inputCls}
                        data-testid="input-phone"
                      />
                    </Field>
                    <Field label="Email (optional)">
                      <input
                        type="email"
                        value={customer.email}
                        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="you@domain.com"
                        className={inputCls}
                        data-testid="input-email"
                      />
                    </Field>
                    <Field label="Pincode *">
                      <input
                        value={customer.pincode}
                        onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                        placeholder="741101"
                        className={inputCls}
                        data-testid="input-pincode"
                      />
                    </Field>
                  </div>
                  <Field label="Address *">
                    <input
                      value={customer.address_line}
                      onChange={(e) => setCustomer({ ...customer, address_line: e.target.value })}
                      placeholder="House no., Street, Landmark"
                      className={inputCls}
                      data-testid="input-address"
                    />
                  </Field>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="City *">
                      <input
                        value={customer.city}
                        onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                        placeholder="Nadia"
                        className={inputCls}
                        data-testid="input-city"
                      />
                    </Field>
                    <Field label="State *">
                      <input
                        value={customer.state}
                        onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                        placeholder="West Bengal"
                        className={inputCls}
                        data-testid="input-state"
                      />
                    </Field>
                  </div>
                  <Field label="Delivery notes (optional)">
                    <textarea
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      placeholder="Ring the bell at gate 2…"
                      rows={3}
                      className={inputCls}
                      data-testid="input-notes"
                    />
                  </Field>

                  <div className="mt-2 flex items-start gap-2.5 text-[12.5px] text-[color:var(--paper-faint)]">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4fd1e3]" />
                    <span>Delivery across West Bengal · Cash on delivery available. We call before dispatch.</span>
                  </div>

                  {error && (
                    <div className="mt-2 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-[13.5px] text-red-200" data-testid="order-error">
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT — cart */}
            <div className="relative z-10 flex flex-shrink-0 flex-col border-t border-white/10 bg-white/[0.04] p-6 md:w-[360px] md:border-l md:border-t-0 md:p-8">
              <div className="eyebrow mb-5">Your order</div>
              {/* Capped on phones: the cart sits under the product list there,
                  and an unbounded list would push the products off-screen. */}
              <div
                className="min-h-0 max-h-[20vh] flex-1 space-y-3.5 overflow-y-auto pr-1 md:max-h-none"
                data-testid="cart-summary"
              >
                {cartItems.length === 0 && (
                  <div className="text-[14px] italic text-[color:var(--paper-faint)]">
                    No bottles selected yet.
                  </div>
                )}
                {cartItems.map((i) => (
                  <div key={i.sku} className="flex justify-between gap-3 text-[14px]" data-testid={`cart-line-${i.sku}`}>
                    <div className="min-w-0">
                      <div className="truncate">{i.label}</div>
                      <div className="text-[12px] text-[color:var(--paper-faint)]">
                        {i.size}{i.pack > 1 ? ` · pack of ${i.pack}` : ""} · ×{i.quantity}
                      </div>
                    </div>
                    <div className="whitespace-nowrap font-semibold">{inr(i.line_total)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2.5 text-[14px] text-[color:var(--paper-dim)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="summary-subtotal">{inr(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span data-testid="summary-shipping">
                    {shipping === 0 && subtotal > 0 ? "Free" : inr(shipping)}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 300 && (
                  <div className="text-[12px] text-[#4fd1e3]">
                    Add {inr(300 - subtotal)} more for free shipping.
                  </div>
                )}
                <div className="rule my-3" />
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[20px] text-[color:var(--paper)]">Total</span>
                  <span className="font-display text-[26px] text-[color:var(--paper)]" data-testid="summary-total">
                    {inr(total)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    disabled={!canContinue}
                    className="btn-accent w-full py-4 text-[12px] uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-35"
                    data-testid="continue-to-details"
                  >
                    Continue to delivery
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className="btn-accent flex w-full items-center justify-center gap-2 py-4 text-[12px] uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-35"
                      data-testid="place-order-btn"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Placing…</>
                      ) : (
                        <>Place order · {inr(total)}</>
                      )}
                    </button>
                    <button
                      onClick={() => setStep(1)}
                      disabled={submitting}
                      className="btn-glass w-full py-3 text-[11px] uppercase tracking-[0.2em] disabled:opacity-40"
                      data-testid="back-to-products"
                    >
                      ← Back to bottles
                    </button>
                  </>
                )}
                <div className="mt-1 text-center text-[10px] uppercase tracking-[0.2em] text-[color:var(--paper-faint)]">
                  Payment on delivery · No card charged today
                </div>
              </div>
            </div>
            </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const inputCls =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-[14px] text-[color:var(--paper)] placeholder:text-white/25 transition-colors focus:border-[#4fd1e3]/60 focus:bg-white/[0.08] focus:outline-none";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="eyebrow mb-2 block !text-[10px]">{label}</span>
    {children}
  </label>
);

export default OrderModal;
