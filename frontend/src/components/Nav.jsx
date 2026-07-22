import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { BRAND, LOGO_IMG } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

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

  const getCategory = () => {
    if (activePath === "/masala") return "masala";
    if (activePath === "/chai") return "chai";
    return "water";
  };

  const category = getCategory();
  const alwaysSolid = category !== "water";
  const surface = SURFACE[category];

  const staticProgress = useMotionValue(0);
  const scroll = progress || staticProgress;
  const solidRange = [0.84, 0.9];
  const barBg = useTransform(scroll, solidRange, [`rgba(${surface},0)`, `rgba(${surface},0.94)`]);
  const barBlur = useTransform(scroll, solidRange, ["blur(0px)", "blur(14px)"]);
  const barShadow = useTransform(scroll, solidRange, ["0 0 0 rgba(0,0,0,0)", SOLID_SHADOW]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={
        alwaysSolid
          ? {
              backgroundColor: `rgba(${surface},0.94)`,
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
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-link">
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

        <button
          type="button"
          onClick={() => open(null, category)}
          className={`btn-ghost-outline text-[12px] tracking-[0.2em] uppercase px-5 py-3 rounded-full border transition-all ${
            category === "masala" 
              ? "text-amber-200 border-amber-500/30 hover:bg-amber-500/10" 
              : category === "chai" 
                ? "text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/10" 
                : "text-white/85 border-white/15 hover:bg-white/10"
          }`}
          data-testid="cta-order"
        >
          Order · {category === "masala" ? "Spices" : category === "chai" ? "Tea" : "Water"}
        </button>
      </div>
      <div className="hairline opacity-40" />
    </motion.header>
  );
};

export default Nav;
