import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
// WaveLink, not react-router's Link: it routes through the wave gate, which
// owns the instant scroll reset on navigation (html sets scroll-behavior:
// smooth, so a bare navigation would glide down the story instead of cutting).
import { WaveLink } from "@/lib/waveNav";
import { BRAND, LOGO_IMG } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

// The landing page's background (#061021), so the solid header reads as part
// of the page rather than a floating slab.
const SURFACE = "6,16,33";

const SOLID_SHADOW = "0 10px 30px -12px rgba(0,0,0,0.75)";

/**
 * `progress` is the landing page's scrollYProgress. Over the water story the
 * header is transparent, but the closing Mission chapter is centred copy on a
 * flat background that runs straight under the bar — so from just before that
 * chapter fades in (StoryOverlay starts it at 0.88) the header takes on a solid
 * backdrop.
 */
const Nav = ({ progress }) => {
  const { open } = useOrder();

  const staticProgress = useMotionValue(0);
  const scroll = progress || staticProgress;
  const solidRange = [0.84, 0.9];
  const barBg = useTransform(scroll, solidRange, [`rgba(${SURFACE},0)`, `rgba(${SURFACE},0.94)`]);
  // Resolves to the keyword `none` below the threshold rather than `blur(0px)`.
  // Any non-`none` backdrop-filter — zero-radius included — makes the element a
  // backdrop root, so the compositor copies and filters what is behind it every
  // frame. For most of the water story that is the full animating bottle scene,
  // paid for an effect that is not yet visible.
  const barBlur = useTransform(scroll, (v) => {
    if (v <= solidRange[0]) return "none";
    const t = Math.min(1, (v - solidRange[0]) / (solidRange[1] - solidRange[0]));
    return `blur(${(t * 14).toFixed(1)}px)`;
  });
  const barShadow = useTransform(scroll, solidRange, ["0 0 0 rgba(0,0,0,0)", SOLID_SHADOW]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: barBg,
        backdropFilter: barBlur,
        WebkitBackdropFilter: barBlur,
        boxShadow: barShadow,
      }}
      className="fixed top-0 left-0 right-0 z-[60]"
      data-testid="site-nav"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <WaveLink to="/" className="flex items-center gap-3 group" data-testid="brand-link">
          <img
            src={LOGO_IMG}
            alt={BRAND.name}
            draggable={false}
            className="h-9 w-auto object-contain select-none transition-transform group-hover:scale-105"
          />
          <div className="leading-none">
            <div className="font-display text-[19px] tracking-tight text-white">{BRAND.name}</div>
            <div className="font-bn text-[12px] text-white/55 mt-0.5">{BRAND.bengali}</div>
          </div>
        </WaveLink>

        <button
          type="button"
          onClick={() => open()}
          className="btn-ghost-outline text-[10px] md:text-[12px] tracking-[0.15em] md:tracking-[0.2em] uppercase px-3.5 py-2 md:px-5 md:py-3 rounded-full border transition-all text-white/85 border-white/15 hover:bg-white/10"
          data-testid="cta-order"
        >
          <span className="md:hidden">Order</span>
          <span className="hidden md:inline">Order · Water</span>
        </button>
      </div>
      <div className="hairline opacity-40" />
    </motion.header>
  );
};

export default Nav;
