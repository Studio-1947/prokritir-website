import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Loader2, ArrowLeft, Copy } from "lucide-react";
import { getOrder } from "@/lib/api";
import GlassPanel from "@/components/GlassPanel";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { BRAND, LOGO_IMG } from "@/lib/brand";
import {
  WHATSAPP_DISPLAY,
  buildFollowUpMessage,
  buildOrderMessage,
  whatsappUrl,
} from "@/lib/whatsapp";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// An id the API could have issued. A local fallback reference (PJ-260831-A3F2)
// is not one, and asking the API for it only produces a spurious 404.
const isApiOrderId = (v) => /^[0-9a-f-]{36}$/i.test(v || "");

const Success = () => {
  const { orderId } = useParams();
  const { state } = useLocation();

  // The modal hands the order over directly, so the page is complete on
  // arrival; the fetch is only for a reload or a shared link.
  const [order, setOrder] = useState(state?.order || null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // False when the browser swallowed the tab we opened at checkout — then the
  // headline has to ask for one more click rather than claim the order is sent.
  const handedOff = state?.opened !== false;

  useEffect(() => {
    if (order) return;
    if (!isApiOrderId(orderId)) {
      setError("We could not load this order. Your reference still works on WhatsApp.");
      return;
    }
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setError("Order not found. Your reference still works on WhatsApp."));
  }, [orderId, order]);

  const orderNumber = order?.order_number || (isApiOrderId(orderId) ? null : orderId);

  const copyNumber = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };

  // Before the handoff the chat needs the whole order; after it, the shop
  // already has it and a bare reference is the useful thing to send.
  const chatMessage = handedOff
    ? buildFollowUpMessage(orderNumber)
    : order
    ? buildOrderMessage(order)
    : buildFollowUpMessage(orderNumber);

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
        {/* LEFT — the handoff */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#63e6a8]/40 bg-[#63e6a8]/10">
              {handedOff ? (
                <Check className="h-5 w-5 text-[#63e6a8]" />
              ) : (
                <WhatsAppIcon className="h-5 w-5 text-[#63e6a8]" />
              )}
            </span>
            <div className="eyebrow" data-testid="success-eyebrow">
              {handedOff ? "Order sent to WhatsApp" : "One step left"}
            </div>
          </div>

          <h1 className="font-display text-[clamp(2.3rem,4.8vw,3.6rem)]">
            {handedOff ? "Thank you." : "Almost there."}
            <br />
            <em className="italic ink-accent">
              {handedOff ? "We'll reply on WhatsApp." : "Send it on WhatsApp."}
            </em>
          </h1>

          <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-[color:var(--paper-dim)]">
            {handedOff ? (
              <>
                Your order is waiting in our WhatsApp chat. The team in {BRAND.origin} confirms
                stock, sends the payment options, and posts dispatch and tracking in the same
                thread — so the whole order lives in one conversation.
              </>
            ) : (
              <>
                Your browser blocked the WhatsApp tab, so the order has not reached us yet.
                Tap below and it opens with everything already written out — nothing to retype.
              </>
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            {/* A plain link, deliberately: this is the recovery path when a
                popup blocker ate the tab, so it must not need window.open(). */}
            <a
              href={whatsappUrl(chatMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent inline-flex items-center gap-2.5 px-7 py-4 text-[12px] uppercase tracking-[0.18em]"
              data-testid="open-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {handedOff ? "Open the chat" : "Send order on WhatsApp"}
            </a>

            {orderNumber && (
              <div className="glass inline-flex items-center gap-3 rounded-full px-6 py-3.5">
                <span className="eyebrow !text-[10px]">Order #</span>
                <span className="font-mono text-[15px] text-[#4fd1e3]" data-testid="order-number">
                  {orderNumber}
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
          </div>

          <div className="mt-4 text-[12.5px] text-[color:var(--paper-faint)]" data-testid="whatsapp-number">
            Chat with us on {WHATSAPP_DISPLAY}
          </div>

          {!order && !error && (
            <div className="mt-9 inline-flex items-center gap-2 text-[14px] text-[color:var(--paper-faint)]">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading your order…
            </div>
          )}
          {error && (
            <div className="mt-9 max-w-md rounded-2xl border border-white/12 bg-white/[0.05] p-4 text-[13.5px] text-[color:var(--paper-dim)]" data-testid="success-error">
              {error}
            </div>
          )}

          {/* What happens next — the three stages, all in the one chat. */}
          <div className="mt-11 max-w-lg space-y-3.5" data-testid="whatsapp-steps">
            <NextStep n="01" title="Confirmation">
              We check stock and confirm your delivery slot in the chat, usually within a few hours.
            </NextStep>
            <NextStep n="02" title="Payment">
              Pay by UPI or a secure card link sent in the chat — or choose cash on delivery. Nothing is charged on this site.
            </NextStep>
            <NextStep n="03" title="Shipment">
              We post the dispatch note and tracking to the same thread, and you can ask for an update any time by replying.
            </NextStep>
          </div>

          <div className="mt-11 grid max-w-lg grid-cols-3 gap-4">
            <Stat label="Ships in" value="24 hrs" />
            <Stat
              label="Litres given back"
              value={order ? `${order.items.reduce((s, i) => s + i.pack * i.quantity, 0)}` : "—"}
            />
            <Stat label="Payment" value="On WhatsApp" />
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
                  <div className="flex items-center gap-2 pt-1 text-[12.5px] text-[#63e6a8]">
                    <WhatsAppIcon className="h-3.5 w-3.5" /> Payable on WhatsApp after confirmation
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
              <div className="text-[14px] text-[color:var(--paper-faint)]">
                {error ? "Open the chat above and we'll pull your order up by its reference." : "Fetching your receipt…"}
              </div>
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

const NextStep = ({ n, title, children }) => (
  <div className="flex gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
    <span className="font-mono mt-0.5 text-[12px] text-[#63e6a8]">{n}</span>
    <div>
      <div className="text-[14px] font-semibold">{title}</div>
      <div className="mt-1 text-[13px] leading-relaxed text-[color:var(--paper-dim)]">{children}</div>
    </div>
  </div>
);

const Stat = ({ label, value }) => (
  <GlassPanel radius={16}>
    <div className="px-5 py-5">
      <div className="font-display text-[26px] leading-none">{value}</div>
      <div className="eyebrow mt-2.5 !text-[9px]">{label}</div>
    </div>
  </GlassPanel>
);

export default Success;
