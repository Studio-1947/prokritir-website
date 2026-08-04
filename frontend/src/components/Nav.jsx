import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND, LOGO_IMG, NAV_LINKS } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

/**
 * Floating glass nav — plain CSS backdrop-blur, deliberately not a
 * GlassSurface. It is fixed over the whole page, so its backdrop changes on
 * every scrolled pixel; an SVG-filter surface here is the single most
 * expensive place to put one.
 *
 * The links sit in a segmented capsule with a pill marking the section you
 * are currently in. The pill is a shared `layoutId`, so it slides between
 * items rather than blinking from one to the next.
 */
const Nav = () => {
  const { open } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 40;
    if (next !== scrolled) setScrolled(next);
  });

  // Scroll-spy. The tall rootMargin collapses the viewport to a band across
  // its middle, so exactly one section counts as "current" at a time instead
  // of every section that happens to be partly on screen.
  useEffect(() => {
    const targets = NAV_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(`#${hit.target.id}`);
        else if (window.scrollY < 200) setActive(null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[60] px-4 pt-4 md:px-8 md:pt-6"
      data-testid="site-nav"
    >
      {/* Over the hero the three groups float as separate capsules; once you
          scroll, this outer bar fades in behind them and joins them into one. */}
      <nav
        className={`mx-auto grid max-w-[1440px] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full p-2 transition-all duration-500 lg:grid-cols-[1fr_auto_1fr] ${
          scrolled || menuOpen ? "glass-strong" : "border border-transparent bg-transparent shadow-none"
        }`}
      >
        {/* Brand capsule */}
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-3 justify-self-start rounded-full border border-white/10 bg-[#04121a]/55 py-2 pl-2 pr-5 backdrop-blur-xl transition-colors duration-300 hover:border-white/20"
          data-testid="brand-link"
        >
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "linear-gradient(135deg,#4fd1e3,#63e6a8)" }}
          >
            <img
              src={LOGO_IMG}
              alt=""
              aria-hidden
              draggable={false}
              className="h-5 w-auto select-none object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </span>
          <span className="font-display whitespace-nowrap text-[17px] tracking-tight">
            {BRAND.name}
          </span>
        </a>

        {/* Desktop links — segmented capsule with a sliding active pill */}
        <div className="hidden items-center justify-self-center rounded-full border border-white/10 bg-[#04121a]/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:flex">
          {NAV_LINKS.map((l) => {
            const isActive = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                className="relative rounded-full px-5 py-2.5 text-[13px] font-medium"
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full border border-[#63e6a8]/30 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive
                      ? "text-[#8df0c0]"
                      : "text-[color:var(--paper-dim)] hover:text-[color:var(--paper)]"
                  }`}
                >
                  {l.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 justify-self-end">
          <button
            type="button"
            onClick={() => open()}
            className="btn-accent shrink-0 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] md:px-9 md:py-3.5 md:text-[12px] md:tracking-[0.18em]"
            data-testid="cta-order"
          >
            Order
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-glass flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong mx-auto mt-3 max-w-[1440px] overflow-hidden rounded-[26px] p-3 lg:hidden"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-2xl px-5 py-4 text-[15px] text-[color:var(--paper-dim)] transition-colors hover:bg-white/[0.07] hover:text-[color:var(--paper)]"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
