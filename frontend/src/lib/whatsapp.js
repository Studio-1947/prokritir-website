/**
 * WhatsApp order handoff.
 *
 * Prokritir Jol has no on-site checkout. Everything after the cart — confirming
 * stock, taking payment, and tracking the shipment — happens as a conversation
 * on WhatsApp. This site's only job is to compose a first message that is
 * already complete, so the customer never has to retype an address or a total.
 *
 * ⚠️ PLACEHOLDER — WHATSAPP_NUMBER below is a dummy line that goes nowhere.
 *    Replace it with the real business number before launch, or set
 *    REACT_APP_WHATSAPP_NUMBER in the frontend .env (no "+", country code
 *    included, e.g. 919830098300).
 */

// wa.me wants digits only: country code, no "+", no spaces.
export const WHATSAPP_NUMBER = (
  process.env.REACT_APP_WHATSAPP_NUMBER || "919000000000"
).replace(/\D/g, "");

/** Human-readable form of the business number, for display in the UI. */
export const formatWhatsAppNumber = (digits = WHATSAPP_NUMBER) =>
  digits.length === 12 && digits.startsWith("91")
    ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    : `+${digits}`;

export const WHATSAPP_DISPLAY = formatWhatsAppNumber();

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/**
 * The order, written out as a WhatsApp message. `*bold*` is WhatsApp's own
 * markup — it renders in the chat, so the shop-side reader gets a scannable
 * ticket rather than a wall of text.
 */
export const buildOrderMessage = (order) => {
  const c = order.customer;
  const lines = [
    "*New order · Prokritir Jol*",
    `Order ref: ${order.order_number}`,
    "",
    "*Items*",
    ...order.items.map(
      (i) => `• ${i.name} — ×${i.quantity} — ${inr(i.line_total)}`
    ),
    "",
    `Subtotal: ${inr(order.subtotal)}`,
    `Shipping: ${order.shipping === 0 ? "Free" : inr(order.shipping)}`,
    `*Total: ${inr(order.total)}*`,
    "",
    "*Deliver to*",
    c.name,
    c.phone,
    ...(c.email ? [c.email] : []),
    `${c.address_line}, ${c.city}, ${c.state} — ${c.pincode}`,
    ...(c.notes ? [`Note: ${c.notes}`] : []),
    "",
    "Please confirm this order and send the payment details (UPI / link). I'll follow the delivery here.",
  ];
  return lines.join("\n");
};

/** Follow-up message for an order already placed — payment or delivery status. */
export const buildFollowUpMessage = (orderNumber) =>
  orderNumber
    ? `Hello Prokritir Jol — about my order *${orderNumber}*. Could you share an update on payment / delivery?`
    : "Hello Prokritir Jol — I'd like to ask about an order.";

/** Plain enquiry, for contact links that are not tied to an order. */
export const buildEnquiryMessage = () =>
  "Hello Prokritir Jol — I'd like to know more about your bottles and delivery.";

export const whatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;

// window.open() with "noopener" returns null by spec, which would leave us
// unable to steer the tab or even tell whether it opened. So the flag is off
// and the back-reference is severed by hand instead.
const openTab = (url) => {
  try {
    const tab = window.open(url, "_blank");
    if (tab) {
      try { tab.opener = null; } catch { /* cross-origin once navigated */ }
    }
    return tab;
  } catch {
    return null;
  }
};

/**
 * Reserve a tab *during* the click, before any awaiting happens.
 *
 * Browsers only allow window.open() while a user gesture is still on the stack.
 * The order POST sits between the click and the handoff, so without this the
 * popup blocker eats the WhatsApp tab on the one click that matters.
 * Returns null if the browser blocked it anyway — callers must handle that.
 */
export const reserveWhatsAppTab = () => openTab("");

/**
 * Send the message to WhatsApp. Pass the tab from reserveWhatsAppTab() if the
 * call is happening after an await; otherwise a fresh tab is opened.
 * Returns true if a tab was handed the URL.
 */
export const openWhatsApp = (message, reservedTab = null) => {
  const url = whatsappUrl(message);
  if (reservedTab && !reservedTab.closed) {
    reservedTab.location.replace(url);
    return true;
  }
  return Boolean(openTab(url));
};
