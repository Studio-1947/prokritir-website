import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { BRAND, LOGO_IMG, FOOTER_LINKS } from "@/lib/brand";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { WHATSAPP_DISPLAY, buildEnquiryMessage, whatsappUrl } from "@/lib/whatsapp";

const SOCIALS = [
  {
    id: "linkedin",
    label: "LinkedIn",
    path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
  },
  {
    id: "facebook",
    label: "Facebook",
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.75 5.65c1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.62.77-1.62 1.55V12h2.75l-.44 3h-2.31v6.8c4.56-.93 8-4.96 8-9.8z",
  },
  {
    id: "x",
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    id: "instagram",
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
  },
];

const Footer = () => (
  // A soft veil: the footer is the one large block of bare copy with no glass
  // panel under it, so the fluid gets damped here to keep the text readable.
  <footer
    id="footer"
    className="relative overflow-hidden border-t border-white/10 bg-[#040c13]/55 pt-20 pb-10 backdrop-blur-[6px]"
  >
    <div className="aurora absolute -bottom-64 left-1/2 h-[520px] w-[820px] -translate-x-1/2 opacity-50" aria-hidden />

    <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
      <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img src={LOGO_IMG} alt="" aria-hidden draggable={false} className="h-8 w-auto object-contain" />
            <span className="leading-none">
              <span className="font-display block text-[24px]">{BRAND.name}</span>
              <span className="font-bn mt-1.5 block text-[12px] text-[color:var(--paper-faint)]">
                {BRAND.bengali}
              </span>
            </span>
          </div>
          <p className="mt-7 max-w-sm text-[14px] leading-relaxed text-[color:var(--paper-faint)]">
            RO-purified drinking water drawn from a single deep aquifer in {BRAND.origin}.
            Every bottle returns a litre of clean water to a family in rural Bengal.
          </p>
          <div className="mt-7 flex gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href="#footer"
                aria-label={s.label}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--paper-dim)] transition-all duration-300 hover:text-[#4fd1e3]"
                data-testid={`social-${s.id}`}
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <div className="eyebrow">{col.title}</div>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[14px] text-[color:var(--paper-dim)] transition-colors hover:text-[#4fd1e3]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Contact */}
        <div>
          <div className="eyebrow">Contact</div>
          <ul className="mt-6 space-y-4 text-[14px] text-[color:var(--paper-dim)]">
            {/* Orders and their payment and tracking all run through this
                line, so it leads the list. */}
            <li>
              <a
                href={whatsappUrl(buildEnquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-[#63e6a8]"
                data-testid="footer-whatsapp"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#63e6a8]" />
                {WHATSAPP_DISPLAY}
                <span className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--paper-faint)]">
                  Orders
                </span>
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 transition-colors hover:text-[#4fd1e3]">
                <Mail className="h-4 w-4 text-[#4fd1e3]" />
                {BRAND.email}
              </a>
            </li>
            <li>
              <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 transition-colors hover:text-[#4fd1e3]">
                <Phone className="h-4 w-4 text-[#4fd1e3]" />
                {BRAND.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-[#4fd1e3]" />
              {BRAND.origin}, IN
            </li>
          </ul>
        </div>
      </div>

      <div className="rule mt-16" />

      <div className="mt-7 flex flex-col justify-between gap-4 text-[12px] text-[color:var(--paper-faint)] md:flex-row">
        <div>© {new Date().getFullYear()} Prokritir Jol Beverages Pvt. Ltd. All rights reserved.</div>
        <div className="flex flex-wrap gap-6">
          <a href="#footer" className="transition-colors hover:text-[color:var(--paper)]">Privacy Policy</a>
          <a href="#footer" className="transition-colors hover:text-[color:var(--paper)]">Terms of Service</a>
          <span>FSSAI Lic. {BRAND.fssai}</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
