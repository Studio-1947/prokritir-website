import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowLeft, Copy } from "lucide-react";
import { getOrder } from "@/lib/api";
import { BOTTLE_IMG, BRAND, LOGO_IMG } from "@/lib/brand";

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
    <div className="relative min-h-screen bg-[#061021] text-white overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_50%_10%,rgba(0,229,255,0.10),transparent_60%),radial-gradient(900px_600px_at_50%_90%,rgba(19,80,51,0.35),transparent_60%)]" />
        <div className="grain absolute inset-0" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="success-home-link">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-[#135033]/40 border border-white/15 flex items-center justify-center">
            <img
              src={LOGO_IMG}
              alt=""
              aria-hidden
              draggable={false}
              className="h-5 w-auto select-none"
            />
          </div>
          <div className="leading-none">
            <div className="font-display text-[19px]">{BRAND.name}</div>
            <div className="font-bn text-[12px] text-white/55 mt-0.5">{BRAND.bengali}</div>
          </div>
        </Link>
        <Link to="/" className="text-[12px] tracking-[0.25em] uppercase text-white/70 hover:text-white flex items-center gap-2" data-testid="back-home-link">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to story
        </Link>
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-6 md:px-12 pt-8 pb-24 grid gap-10 lg:grid-cols-[1.15fr,1fr]">
        {/* LEFT — celebration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-full bg-emerald-400/15 border border-emerald-300/40 flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="chapter-tag">Order confirmed</div>
          </div>

          <h1 className="font-display text-4xl md:text-6xl leading-[1.02]">
            Thank you.<br/>
            <em className="italic text-cyan-200/90">The aquifer is</em><br/>
            on its way to you.
          </h1>

          <p className="mt-6 text-white/70 text-[15px] leading-relaxed max-w-lg">
            We&apos;ve received your order and our team in Nadia is preparing your bottles.
            You&apos;ll get a call before dispatch, and every bottle in this order funds one
            litre of clean water for a family in rural Bengal.
          </p>

          {/* Order number */}
          {order && (
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur px-5 py-3">
              <span className="text-[11px] tracking-[0.3em] uppercase text-white/50">Order #</span>
              <span className="font-mono text-cyan-100" data-testid="order-number">{order.order_number}</span>
              <button
                onClick={copyNumber}
                className="text-white/60 hover:text-cyan-200 transition-colors"
                aria-label="Copy order number"
                data-testid="copy-order-number"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              {copied && <span className="text-[11px] text-emerald-300">Copied</span>}
            </div>
          )}

          {!order && !error && (
            <div className="mt-8 inline-flex items-center gap-2 text-white/60 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your order…
            </div>
          )}
          {error && (
            <div className="mt-8 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg p-3 max-w-md" data-testid="success-error">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat label="Ships in" value="24 hrs" />
            <Stat label="Litres given back" value={order ? `${order.items.reduce((s, i) => s + i.pack * i.quantity, 0)}` : "—"} />
            <Stat label="Payment" value="On delivery" />
          </div>
        </motion.div>

        {/* RIGHT — receipt card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-md p-7 md:p-8" data-testid="order-receipt">
            {/* Floating bottle */}
            <div className="absolute -top-10 -right-6 pointer-events-none opacity-70 hidden md:block">
              <img src={BOTTLE_IMG} alt="" className="h-40 w-auto drop-shadow-[0_20px_60px_rgba(0,229,255,0.25)]" />
            </div>

            <div className="chapter-tag mb-5">Order summary</div>
            {order ? (
              <>
                <div className="space-y-3 pb-5 border-b border-white/10" data-testid="receipt-items">
                  {order.items.map((i) => (
                    <div key={i.sku} className="flex justify-between text-sm" data-testid={`receipt-line-${i.sku}`}>
                      <div className="min-w-0 pr-3">
                        <div className="truncate">{i.name}</div>
                        <div className="text-white/50 text-xs">×{i.quantity} · {inr(i.unit_price)} each</div>
                      </div>
                      <div className="font-medium whitespace-nowrap">{inr(i.line_total)}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-5 space-y-2 text-sm text-white/75">
                  <div className="flex justify-between"><span>Subtotal</span><span>{inr(order.subtotal)}</span></div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? "Free" : inr(order.shipping)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-3" />
                  <div className="flex justify-between text-white text-lg">
                    <span className="font-display">Total</span>
                    <span className="font-display" data-testid="receipt-total">{inr(order.total)}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-[13px] leading-relaxed text-white/70">
                  <div className="chapter-tag mb-2">Delivering to</div>
                  <div className="text-white font-medium" data-testid="receipt-customer-name">{order.customer.name}</div>
                  <div>{order.customer.phone}</div>
                  <div className="mt-1">
                    {order.customer.address_line}, {order.customer.city}, {order.customer.state} {order.customer.pincode}
                  </div>
                  {order.customer.notes && (
                    <div className="mt-2 text-white/55 italic">Note: {order.customer.notes}</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-white/50 text-sm">Fetching your receipt…</div>
            )}
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.25em] uppercase text-white/70 hover:text-cyan-200"
            data-testid="continue-story-link"
          >
            Continue the story →
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="font-display text-2xl text-white">{value}</div>
    <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mt-1">{label}</div>
  </div>
);

export default Success;
