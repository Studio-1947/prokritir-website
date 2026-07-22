import React from "react";
import { BRAND, LOGO_IMG } from "@/lib/brand";

const Footer = () => {
  return (
    <footer id="footer" className="relative bg-[#050e1c] text-white/80 pt-24 pb-10 overflow-hidden" data-testid="site-footer">
      {/* Marquee accent */}
      <div className="border-y border-white/10 py-6 overflow-hidden whitespace-nowrap">
        <div className="inline-block pj-marquee">
          {Array.from({ length: 2 }).map((_, r) => (
            <span key={r} className="inline-flex items-center gap-8 pr-8 font-display text-3xl md:text-5xl italic text-white/70">
              {["Prokritir Jol", "প্রকৃতির জল", "Nature's Water", "সবার জন্য বিশুদ্ধতা", "500 ml · Since 2024"].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-8">
                  <span>{t}</span>
                  <span className="h-2 w-2 rotate-45 bg-cyan-300/70 inline-block" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-20 grid gap-12 md:grid-cols-[1.4fr,1fr,1fr,1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={LOGO_IMG}
              alt={BRAND.name}
              draggable={false}
              className="h-10 w-auto object-contain select-none"
            />
            <div className="leading-none">
              <div className="font-display text-2xl text-white">{BRAND.name}</div>
              <div className="font-bn text-white/55 mt-1">{BRAND.bengali}</div>
            </div>
          </div>
          <p className="mt-6 text-white/65 text-[15px] leading-relaxed max-w-md">
            Prokritir Jol is an RO-purified drinking water born from the deep
            aquifers of rural Bengal. Every 500 ml bottle is a small tribute to the
            village hands that draw it, and a quiet promise to return one litre
            of clean water to a family in need.
          </p>
          <div className="mt-6 font-bn text-emerald-200/90 text-[15px]">
            “বিশুদ্ধতাই আমাদের মাতৃভাষা।”
          </div>
        </div>

        <div>
          <div className="chapter-tag mb-5">Explore</div>
          <ul className="space-y-3 text-[14px]">
            <li><a href="/#source" className="hover:text-white transition-colors">Our source</a></li>
            <li><a href="/#purity" className="hover:text-white transition-colors">Purification</a></li>
            <li><a href="/#people" className="hover:text-white transition-colors">Communities</a></li>
            <li><a href="/#mission" className="hover:text-white transition-colors">Our promise</a></li>
          </ul>
        </div>

        <div>
          <div className="chapter-tag mb-5">Company</div>
          <ul className="space-y-3 text-[14px]">
            <li><a href="#footer" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#footer" className="hover:text-white transition-colors">Sustainability</a></li>
            <li><a href="#footer" className="hover:text-white transition-colors">Distributors</a></li>
            <li><a href="#footer" className="hover:text-white transition-colors">Careers</a></li>
          </ul>
        </div>

        <div>
          <div className="chapter-tag mb-5">Contact</div>
          <ul className="space-y-3 text-[14px] text-white/70">
            <li><a href="mailto:hello@prokritirjol.in" className="hover:text-white transition-colors">hello@prokritirjol.in</a></li>
            <li><a href="tel:+919830098300" className="hover:text-white transition-colors">+91 98300 98300</a></li>
            <li>Nadia, West Bengal, IN</li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[
              {
                id: "linkedin",
                label: "LinkedIn",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                )
              },
              {
                id: "facebook",
                label: "Facebook",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.75 5.65c1.08 0 2.21.19 2.21.19v2.43h-1.25c-1.23 0-1.62.77-1.62 1.55V12h2.75l-.44 3h-2.31v6.8c4.56-.93 8-4.96 8-9.8z"/>
                  </svg>
                )
              },
              {
                id: "x",
                label: "X (Twitter)",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )
              },
              {
                id: "instagram",
                label: "Instagram",
                icon: (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                )
              }
            ].map((social) => (
              <a
                key={social.id}
                href="#"
                aria-label={social.label}
                className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                data-testid={`social-${social.id}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-white/50">
        <div>© {new Date().getFullYear()} Prokritir Jol Beverages Pvt. Ltd. All rights reserved.</div>
        <div className="flex flex-wrap gap-6">
          <a href="#footer" className="hover:text-white/80 transition-colors">Privacy Policy</a>
          <a href="#footer" className="hover:text-white/80 transition-colors">Terms of Service</a>
          <span>FSSAI Lic. No. 12824999000123</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
