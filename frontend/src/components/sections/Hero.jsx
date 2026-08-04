import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ShoppingBag } from "lucide-react";
import GlassPanel from "@/components/GlassPanel";
import { BRAND, HERO, BOTTLE_IMG } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

/**
 * Hero — glass content floating on the site-wide ferrofluid background.
 * Nothing here paints its own backdrop beyond a soft left scrim, so the fluid
 * is what you see behind the headline.
 */
const Hero = () => {
  const { open } = useOrder();

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden grain">
      {/* The ferrofluid shows through here. Only a soft left-side scrim, to
          keep the headline off the brightest rims. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#040c13]/60 via-[#040c13]/10 to-transparent"
        aria-hidden
      />

      {/* Atmosphere */}
      <div className="aurora drift absolute -left-52 top-24 h-[560px] w-[560px]" aria-hidden />
      <div className="aurora aurora-mint drift absolute -right-40 bottom-[-120px] h-[520px] w-[520px]" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-32 md:pt-40 pb-14">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4fd1e3] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4fd1e3]" />
              </span>
              <span className="eyebrow !tracking-[0.24em] text-[10px] text-[rgba(242,247,250,0.8)]">
                {HERO.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display mt-7 text-[clamp(2.8rem,6.2vw,5.1rem)]"
            >
              {HERO.titleLead}
              <br />
              <em className="italic ink-accent">{HERO.titleAccent}</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 max-w-xl text-[16px] md:text-[17px] leading-relaxed text-[color:var(--paper-dim)]"
            >
              {HERO.body}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <button
                type="button"
                onClick={() => open()}
                className="btn-accent inline-flex items-center gap-2.5 px-7 py-4 text-[12px] tracking-[0.18em] uppercase"
                data-testid="hero-order"
              >
                <ShoppingBag className="h-4 w-4" />
                Order bottles
              </button>
              <a
                href="#source"
                className="btn-glass inline-flex items-center gap-2.5 px-7 py-4 text-[12px] tracking-[0.18em] uppercase"
              >
                Read the story
                <ArrowDown className="h-4 w-4" />
              </a>
            </motion.div>
          </div>

          {/* Floating product card */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <GlassPanel radius={34} className="edge-light w-full max-w-[380px]">
            <div className="relative p-8 text-center">
              <div className="aurora absolute inset-x-8 top-6 h-56 opacity-70" aria-hidden />
              <img
                src={BOTTLE_IMG}
                alt={`${BRAND.name} 500 ml bottle`}
                draggable={false}
                className="float-slow relative mx-auto h-[300px] w-auto select-none object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
              />
              <div className="rule my-7" />
              <div className="flex items-end justify-between text-left">
                <div>
                  <div className="font-display text-[26px] leading-none">{BRAND.name}</div>
                  <div className="font-bn mt-1.5 text-[13px] text-[color:var(--paper-faint)]">
                    {BRAND.bengali}
                  </div>
                </div>
                <div className="text-right">
                  <div className="eyebrow mb-1">From</div>
                  <div className="font-display text-[30px] leading-none ink-accent">₹20</div>
                </div>
              </div>
            </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Stat rail */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16"
        >
          <GlassPanel radius={28} className="edge-light">
          <div className="grid grid-cols-2 gap-px md:grid-cols-4">
          {HERO.stats.map((s) => (
            <div key={s.label} className="px-6 py-7 md:px-8 md:py-8">
              <div className="font-display text-[40px] leading-none md:text-[48px]">
                {s.value}
                {s.unit && (
                  <span className="ml-1.5 font-sans text-[15px] font-medium tracking-tight text-[#4fd1e3]">
                    {s.unit}
                  </span>
                )}
              </div>
              <div className="eyebrow mt-3">{s.label}</div>
            </div>
          ))}
          </div>
          </GlassPanel>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
