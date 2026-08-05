import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { FAQ } from "@/lib/brand";

/**
 * FAQ — controlled accordion. One panel open at a time; height animates so
 * the section below settles rather than jumping.
 */
const Faq = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <div className="eyebrow">Questions</div>
            <h2 className="font-display mt-6 text-[clamp(2rem,4vw,3.1rem)]">
              Before you <em className="italic ink-accent">order.</em>
            </h2>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-[color:var(--paper-faint)]">
              Anything else, call us. Someone at the plant in Nadia picks up.
            </p>
          </Reveal>

          <div className="lg:col-span-8">
            {FAQ.map((item, i) => {
              const isOpen = openIdx === i;
              return (
                <Reveal key={item.q} delay={Math.min(i * 0.05, 0.25)}>
                  <GlassPanel
                    radius={22}
                    className={`mb-3 transition-shadow duration-300 ${
                      isOpen ? "ring-1 ring-[#4fd1e3]/35" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left"
                    >
                      <span className="text-[15.5px] font-semibold tracking-tight">{item.q}</span>
                      <Plus
                        className={`h-5 w-5 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-45 text-[#4fd1e3]" : "text-white/40"
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <p className="px-7 pb-7 text-[14px] leading-relaxed text-[color:var(--paper-dim)]">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassPanel>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
