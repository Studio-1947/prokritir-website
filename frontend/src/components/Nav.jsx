import React from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

const Nav = () => {
  const { open } = useOrder();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[60]"
      data-testid="site-nav"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3 group" data-testid="brand-link">
          <div className="relative">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#00E5FF]/30 via-transparent to-[#135033]/40 border border-white/15 backdrop-blur-md flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00E5FF]" />
            </div>
          </div>
          <div className="leading-none">
            <div className="font-display text-[19px] tracking-tight text-white">{BRAND.name}</div>
            <div className="font-bn text-[12px] text-white/55 mt-0.5">{BRAND.bengali}</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-10 text-[13px] tracking-wide text-white/70">
          <a href="#source" className="hover:text-white transition-colors" data-testid="nav-source">The Source</a>
          <a href="#purity" className="hover:text-white transition-colors" data-testid="nav-purity">Purity</a>
          <a href="#people" className="hover:text-white transition-colors" data-testid="nav-people">People</a>
          <a href="#mission" className="hover:text-white transition-colors" data-testid="nav-mission">Promise</a>
        </nav>

        <button
          type="button"
          onClick={() => open()}
          className="btn-ghost-outline text-[12px] tracking-[0.2em] uppercase text-white/85 px-5 py-3 rounded-full"
          data-testid="cta-order"
        >
          Order · 500 ml
        </button>
      </div>
      <div className="hairline opacity-40" />
    </motion.header>
  );
};

export default Nav;
