import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowLeft, Copy } from "lucide-react";
import { getOrder } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import { BRAND, LOGO_IMG } from "@/lib/brand";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const Success = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getOrder(orderId).then(setOrder).catch(() => setError("Order not found."));
  }, [orderId]);

  const copyNumber = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative z-10 min-h-screen overflow-hidden grain">
      {/* Atmosphere — the ferrofluid background shows through behind this. */}
      <div className="aurora drift absolute -left-40 top-0 h-[520px] w-[520px]" aria-hidden />
      <div className="aurora aurora-mint absolute -right-40 bottom-0 h-[460px] w-[460px]" aria-hidden />

      {/* Top bar */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-10">
        <Link to="/" className="group flex items-center gap-3" data-testid="success-home-link">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06]">
            <img src={LOGO_IMG} alt="" aria-hidden draggable={false} className="h-6 w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
          </span>
          <span className="leading-none">
            <span className="font-display block text-[20px]">{BRAND.name}</span>
            <span className="font-bn mt-1 block text-[11px] text-[color:var(--paper-faint)]">{BRAND.bengali}</span>
          </span>
        </Link>
        <Link
          to="/"
          className="btn-glass inline-flex items-center gap-2 px-5 py-3 text-[11px] uppercase tracking-[0.18em]"
          data-testid="back-home-link"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to site
        </Link>
      </div>

      <div className="relative z-10 mx-auto grid max-w-[1180px] gap-10 px-6 pb-24 pt-10 md:px-10 lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT — confirmation */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#63e6a8]/40 bg-[#63e6a8]/10">
              <Check className="h-5 w-5 text-[#63e6a8]" />
            </span>
            <div className="eyebrow">Order confirmed</div>
          </div>

          <h1 className="font-display text-[clamp(2.3rem,4.8vw,3.6rem)]">
            Thank you.
            <br />
            <em className="italic ink-accent">The aquifer is on its way.</em>
          </h1>

          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-[color:var(--paper-dim)]">
            We have your order, and the team in {BRAND.origin} is packing it now. You will get
            a call before dispatch — and every bottle in this order funds a litre of clean
            water for a family in rural Bengal.
          </p>

          {order && (
            <div className="glass mt-9 inline-flex items-center gap-3 rounded-full px-6 py-3.5">
              <span className="eyebrow !text-[10px]">Order #</span>
              <span className="font-mono text-[15px] text-[#4fd1e3]" data-testid="order-number">
                {order.order_number}
              </span>
              <button
                onClick={copyNumber}
                className="text-[color:var(--paper-faint)] transition-colors hover:text-[#4fd1e3]"
                aria-label="Copy order number"
                data-testid="copy-order-number"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copied && <span className="text-[11px] text-[#63e6a8]">Copied</span>}
            </div>
          )}

          {!order && !error && (
            <div className="mt-9 inline-flex items-center gap-2 text-[14px] text-[color:var(--paper-faint)]">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your order…
            </div>
          )}
          {error && (
            <div className="mt-9 max-w-md rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-[14px] text-red-200" data-testid="success-error">
              {error}
            </div>
          )}

          <div className="mt-11 grid max-w-lg grid-cols-3 gap-4">
            <Stat label="Ships in" value="24 hrs" />
            <Stat
              label="Litres given back"
              value={order ? `${order.items.reduce((s, i) => s + i.pack * i.quantity, 0)}` : "—"}
            />
            <Stat label="Payment" value="On delivery" />
          </div>
        </motion.div>

        {/* RIGHT — receipt */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <GlassPanel radius={32} overflowVisible className="edge-light" data-testid="order-receipt">
          <div className="p-8 md:p-9">
            <div className="eyebrow mb-6">Order summary</div>
            {order ? (
              <>
                <div className="space-y-3.5 pb-5" data-testid="receipt-items">
                  {order.items.map((i) => (
                    <div key={i.sku} className="flex justify-between gap-3 text-[14px]" data-testid={`receipt-line-${i.sku}`}>
                      <div className="min-w-0 pr-3">
                        <div className="truncate">{i.name}</div>
                        <div className="text-[12px] text-[color:var(--paper-faint)]">
                          ×{i.quantity} · {inr(i.unit_price)} each
                        </div>
                      </div>
                      <div className="whitespace-nowrap font-semibold">{inr(i.line_total)}</div>
                    </div>
                  ))}
                </div>
                <div className="rule" />

                <div className="space-y-2.5 pt-5 text-[14px] text-[color:var(--paper-dim)]">
                  <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span>
                  </div>
                  <div className="rule my-3" />
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-[20px] text-[color:var(--paper)]">Total</span>
                    <span className="font-display text-[28px] text-[color:var(--paper)]" data-testid="receipt-total">
                      {inr(order.total)}
                    </span>
                  </div>
                </div>

                <div className="rule mt-7" />
                <div className="pt-7 text-[13.5px] leading-relaxed text-[color:var(--paper-dim)]">
                  <div className="eyebrow mb-3">Delivering to</div>
                  <div className="font-semibold text-[color:var(--paper)]" data-testid="receipt-customer-name">
                    {order.customer.name}
                  </div>
                  <div>{order.customer.phone}</div>
                  <div className="mt-1">
                    {order.customer.address_line}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
                  </div>
                  {order.customer.notes && (
                    <div className="mt-2 italic text-[color:var(--paper-faint)]">Note: {order.customer.notes}</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-[14px] text-[color:var(--paper-faint)]">Fetching your receipt…</div>
            )}
          </div>
          </GlassPanel>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[color:var(--paper-dim)] transition-colors hover:text-[#4fd1e3]"
            data-testid="continue-story-link"
          >
            Back to the story →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <GlassPanel radius={16}>
    <div className="px-5 py-5">
      <div className="font-display text-[26px] leading-none">{value}</div>
      <div className="eyebrow mt-2.5 !text-[9px]">{label}</div>
    </div>
  </GlassPanel>
);

export default Success;
