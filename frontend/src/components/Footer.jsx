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
            <div className="h-11 w-11 rounded-full border border-white/15 flex items-center justify-center bg-gradient-to-br from-[#00E5FF]/25 to-[#135033]/40 backdrop-blur-md">
              <img
                src={LOGO_IMG}
                alt=""
                aria-hidden
                draggable={false}
                className="h-6 w-auto select-none"
              />
            </div>
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
            <li><a href="#source" className="hover:text-white transition-colors">Our source</a></li>
            <li><a href="#purity" className="hover:text-white transition-colors">Purification</a></li>
            <li><a href="#people" className="hover:text-white transition-colors">Communities</a></li>
            <li><a href="#mission" className="hover:text-white transition-colors">Our promise</a></li>
          </ul>
        </div>

        <div>
          <div className="chapter-tag mb-5">Company</div>
          <ul className="space-y-3 text-[14px]">
            <li>About</li>
            <li>Sustainability</li>
            <li>Distributors</li>
            <li>Careers</li>
          </ul>
        </div>

        <div>
          <div className="chapter-tag mb-5">Contact</div>
          <ul className="space-y-3 text-[14px]">
            <li>hello@prokritirjol.in</li>
            <li>+91 90000 00000</li>
            <li>Nadia, West Bengal, IN</li>
          </ul>
          <div className="mt-6 flex gap-3">
            {["In", "Fb", "X", "Ig"].map((s) => (
              <a key={s} href="#" className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center text-[11px] text-white/70 hover:text-white hover:border-white/40 transition-colors" data-testid={`social-${s.toLowerCase()}`}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-12 mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-[12px] text-white/50">
        <div>© {new Date().getFullYear()} Prokritir Jol Beverages Pvt. Ltd. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white/80">Privacy</a>
          <a href="#" className="hover:text-white/80">Terms</a>
          <a href="#" className="hover:text-white/80">FSSAI Lic. No. 10024071000000</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
