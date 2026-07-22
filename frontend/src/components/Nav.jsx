import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { BRAND, LOGO_IMG } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";
import { Menu, X } from "lucide-react";

// Each section's page background, so a solid header reads as part of the page
// rather than a floating slab. Kept in sync with the page shells: Landing
// #061021, Masala #140b05, Chai #07130c.
const SURFACE = {
  water: "6,16,33",
  masala: "20,11,5",
  chai: "7,19,12",
};

const SOLID_SHADOW = "0 10px 30px -12px rgba(0,0,0,0.75)";

/**
 * `progress` is the landing page's scrollYProgress. Over the water story the
 * header is transparent, but the closing Mission chapter is centred copy on a
 * flat background that runs straight under the bar — so from just before that
 * chapter fades in (StoryOverlay starts it at 0.88) the header takes on a solid
 * backdrop. The Spices and Tea pages are ordinary scrolling pages with no
 * sticky scene behind the header, so there the bar is solid from the start.
 */
const Nav = ({ progress }) => {
  const { open } = useOrder();
  const location = useLocation();
  const activePath = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);

  const getCategory = () => {
    if (activePath === "/masala") return "masala";
    if (activePath === "/chai") return "chai";
    return "water";
  };

  const category = getCategory();
  const surface = SURFACE[category];
  // Water is the only page whose header rides over a sticky scene, so it is the
  // only one that starts transparent — but an open mobile drawer has to bring
  // the bar with it, or the logo/hamburger row keeps showing the bottle through
  // it while the panel underneath is solid.
  const solid = category !== "water" || menuOpen;

  const staticProgress = useMotionValue(0);
  const scroll = progress || staticProgress;
  const solidRange = [0.84, 0.9];
  const barBg = useTransform(scroll, solidRange, [`rgba(${surface},0)`, `rgba(${surface},0.94)`]);
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
      style={
        solid
          ? {
              // Fully opaque while the drawer is open: the bar and the panel
              // read as one surface, and nothing scrolls under the links.
              backgroundColor: `rgba(${surface},${menuOpen ? 1 : 0.94})`,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              boxShadow: SOLID_SHADOW,
            }
          : {
              backgroundColor: barBg,
              backdropFilter: barBlur,
              WebkitBackdropFilter: barBlur,
              boxShadow: barShadow,
            }
      }
      className="fixed top-0 left-0 right-0 z-[60]"
      data-testid="site-nav"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 group" data-testid="brand-link">
          <img
            src={LOGO_IMG}
            alt={BRAND.name}
            draggable={false}
            className="h-9 w-auto object-contain select-none transition-transform group-hover:scale-105"
          />
          <div className="leading-none">
            <div className="font-display text-[19px] tracking-tight text-white">
              {category === "masala" ? "Prokritir Masala" : category === "chai" ? "Prokritir Chai" : BRAND.name}
            </div>
            <div className="font-bn text-[12px] text-white/55 mt-0.5">
              {category === "masala" ? "প্রকৃতির মশলা" : category === "chai" ? "প্রকৃতির চা" : BRAND.bengali}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] tracking-wide text-white/70">
          <Link
            to="/"
            className={`transition-all duration-300 px-4 py-2 rounded-full border ${activePath === "/" || activePath === "/water" ? "text-cyan-300 bg-white/5 border-white/15 shadow-sm" : "border-transparent hover:text-white"}`}
          >
            Water (Jol)
          </Link>
          <Link
            to="/masala"
            className={`transition-all duration-300 px-4 py-2 rounded-full border ${activePath === "/masala" ? "text-amber-300 bg-white/5 border-white/15 shadow-sm" : "border-transparent hover:text-white"}`}
          >
            Spices (Masala)
          </Link>
          <Link
            to="/chai"
            className={`transition-all duration-300 px-4 py-2 rounded-full border ${activePath === "/chai" ? "text-emerald-300 bg-white/5 border-white/15 shadow-sm" : "border-transparent hover:text-white"}`}
          >
            Tea (Chai)
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => open(null, category)}
            className={`btn-ghost-outline text-[10px] md:text-[12px] tracking-[0.15em] md:tracking-[0.2em] uppercase px-3.5 py-2 md:px-5 md:py-3 rounded-full border transition-all ${
              category === "masala" 
                ? "text-amber-200 border-amber-500/30 hover:bg-amber-500/10" 
                : category === "chai" 
                  ? "text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/10" 
                  : "text-white/85 border-white/15 hover:bg-white/10"
            }`}
            data-testid="cta-order"
          >
            <span className="md:hidden">Order</span>
            <span className="hidden md:inline">Order · {category === "masala" ? "Spices" : category === "chai" ? "Tea" : "Water"}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-full transition-all focus:outline-none"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className="hairline opacity-40" />

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            // Height only — fading it would make the panel see-through for the
            // length of the animation, which is the thing we are fixing.
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: `rgb(${surface})` }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-5 text-center text-sm font-medium tracking-wider uppercase text-white/70">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={`py-3 rounded-xl border transition-all ${activePath === "/" || activePath === "/water" ? "text-cyan-300 border-white/15 bg-white/5 shadow-sm" : "border-transparent"}`}
              >
                Water (Jol)
              </Link>
              <Link
                to="/masala"
                onClick={() => setMenuOpen(false)}
                className={`py-3 rounded-xl border transition-all ${activePath === "/masala" ? "text-amber-300 border-white/15 bg-white/5 shadow-sm" : "border-transparent"}`}
              >
                Spices (Masala)
              </Link>
              <Link
                to="/chai"
                onClick={() => setMenuOpen(false)}
                className={`py-3 rounded-xl border transition-all ${activePath === "/chai" ? "text-emerald-300 border-white/15 bg-white/5 shadow-sm" : "border-transparent"}`}
              >
                Tea (Chai)
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  open(null, category);
                }}
                className={`mt-4 w-full py-3.5 rounded-full font-bold text-[12px] tracking-[0.2em] border transition-all ${
                  category === "masala"
                    ? "bg-amber-500 text-black border-amber-500 hover:bg-amber-400"
                    : category === "chai"
                      ? "bg-emerald-500 text-black border-emerald-500 hover:bg-emerald-400"
                      : "bg-cyan-300 text-black border-cyan-300 hover:bg-cyan-200"
                }`}
              >
                Order · {category === "masala" ? "Spices" : category === "chai" ? "Tea" : "Water"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
