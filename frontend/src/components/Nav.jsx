import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND, LOGO_IMG, NAV_LINKS } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

/**
 * Floating glass nav — three capsules (brand, links, order) carrying their
 * own glass, with no bar behind them.
 *
 * Over the hero they sit apart, spanning the full width. Past 40px of scroll
 * they slide together and fuse into one continuous capsule: the row collapses
 * to fit-content, the gaps close, and the touching corners square off so the
 * seams disappear. Framer's `layout` does the interpolation, so the pills
 * travel rather than jumping.
 *
 * Only above `lg`. Below it the links capsule is hidden, and joining brand to
 * order with nothing between them just reads as cramped.
 *
 * Plain CSS backdrop-blur throughout, deliberately not a GlassSurface: this
 * is fixed over the whole page, so its backdrop changes on every scrolled
 * pixel — the single most expensive place to put an SVG-filter surface.
 */
const Nav = () => {
  const { open } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [joined, setJoined] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 40;
    if (next !== joined) setJoined(next);
  });

  const spring = { type: "spring", stiffness: 260, damping: 30 };

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
      className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 md:px-8 md:pt-6"
      data-testid="site-nav"
    >
      {/* Apart over the hero, fused into one capsule once scrolled. The
          `joined` classes are all lg:-prefixed, so below that breakpoint the
          row stays spread no matter the scroll position. */}
      <motion.nav
        layout
        transition={spring}
        className={`mx-auto flex w-full items-center gap-2 p-1.5 md:gap-4 md:p-2 ${
          joined
            ? "max-w-[1440px] justify-between lg:w-fit lg:max-w-none lg:justify-center lg:gap-0"
            : "max-w-[1440px] justify-between"
        }`}
      >
        {/* Brand capsule. min-w-0 (and no shrink-0) so on a 320px screen the
            wordmark truncates instead of pushing the menu button off-screen. */}
        <motion.a
          layout
          transition={spring}
          href="#top"
          className={`group flex h-12 min-w-0 items-center gap-2.5 border border-white/10 bg-[#04121a]/55 px-3.5 backdrop-blur-xl transition-colors duration-300 hover:border-white/20 md:h-14 md:gap-3 md:px-5 ${
            joined ? "rounded-full lg:rounded-r-none lg:border-r-0" : "rounded-full"
          }`}
          data-testid="brand-link"
        >
          <img
            src={LOGO_IMG}
            alt=""
            aria-hidden
            draggable={false}
            className="h-6 w-auto shrink-0 select-none object-contain transition-transform duration-500 group-hover:scale-110 md:h-7"
          />
          <span className="font-display truncate text-[15px] tracking-tight md:text-[17px]">
            {BRAND.name}
          </span>
        </motion.a>

        {/* Desktop links — segmented capsule with a sliding active pill */}
        <motion.div
          layout
          transition={spring}
          className={`hidden h-14 items-center border border-white/10 bg-[#04121a]/55 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl lg:flex ${
            joined ? "rounded-full lg:rounded-none" : "rounded-full"
          }`}
        >
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
        </motion.div>

        {/* Actions */}
        <motion.div layout transition={spring} className="flex shrink-0 items-center gap-2 md:gap-2.5">
          <button
            type="button"
            onClick={() => open()}
            className={`btn-accent h-12 shrink-0 px-4 text-[11px] font-bold uppercase tracking-[0.12em] md:h-14 md:px-9 md:text-[12px] md:tracking-[0.18em] ${
              joined ? "lg:!rounded-l-none" : ""
            }`}
            data-testid="cta-order"
          >
            Order
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="btn-glass flex h-12 w-12 shrink-0 items-center justify-center lg:hidden"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>
      </motion.nav>

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
