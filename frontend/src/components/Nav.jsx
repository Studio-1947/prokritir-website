import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

const Nav = () => {
  const { open } = useOrder();
  const location = useLocation();
  const activePath = location.pathname;

  const getCategory = () => {
    if (activePath === "/masala") return "masala";
    if (activePath === "/chai") return "chai";
    return "water";
  };

  const category = getCategory();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[60]"
      data-testid="site-nav"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-link">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00E5FF]/30 via-transparent to-[#135033]/40 border border-white/15 backdrop-blur-md flex items-center justify-center">
              <div className={`h-1.5 w-1.5 rounded-full ${category === "masala" ? "bg-amber-400" : category === "chai" ? "bg-emerald-400" : "bg-[#00E5FF]"}`} />
            </div>
          </div>
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
