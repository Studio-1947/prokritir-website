import React from "react";
import { motion, useTransform } from "framer-motion";
import { useOrder } from "@/lib/orderContext";

/**
 * StoryOverlay - renders the text/copy for each chapter as a fixed overlay,
 * fading in/out based on scrollYProgress. Sits ABOVE the bottle so labels can
 * frame it, but keeps pointer-events off except for CTAs.
 */

const useChapterOpacity = (progress, start, mid1, mid2, end) => {
  return useTransform(progress, [start, mid1, mid2, end], [0, 1, 1, 0]);
};

const StoryOverlay = ({ progress }) => {
  const { open } = useOrder();
  // per-chapter opacities (tightened so only one chapter of copy shows at a time)
  const heroOp   = useTransform(progress, [0, 0.02, 0.13, 0.17], [1, 1, 1, 0]);
  const sourceOp = useChapterOpacity(progress, 0.19, 0.24, 0.33, 0.38);
  const purityOp = useChapterOpacity(progress, 0.40, 0.46, 0.52, 0.56);
  const revealOp = useChapterOpacity(progress, 0.60, 0.65, 0.70, 0.74);
  const peopleOp = useChapterOpacity(progress, 0.76, 0.80, 0.86, 0.90);
  const missionOp= useTransform(progress, [0.88, 0.93, 0.98, 1.0], [0, 1, 1, 0]);

  const heroY   = useTransform(progress, [0, 0.17], [0, -40]);
  const sourceY = useTransform(progress, [0.19, 0.38], [30, -30]);
  const purityY = useTransform(progress, [0.40, 0.56], [30, -30]);
  const revealY = useTransform(progress, [0.60, 0.74], [20, -20]);
  const peopleY = useTransform(progress, [0.76, 0.90], [30, -30]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* ── HERO ── */}
      <motion.div
        style={{ opacity: heroOp, y: heroY }}
        className="absolute inset-0 flex flex-col items-center justify-between px-6 md:px-12 py-24"
        data-testid="chapter-hero"
      >
        <div />
        <div className="w-full max-w-[1400px] flex items-end justify-between gap-10">
          <div className="max-w-md">
            <div className="chapter-tag mb-6">Prologue · প্রকৃতির জল</div>
            <h1 className="font-display text-[54px] md:text-[76px] leading-[0.92] tracking-tight text-white">
              Nature,<br/>
              <em className="italic text-cyan-200/90">bottled with</em><br/>
              reverence.
            </h1>
          </div>
          <div className="hidden md:block max-w-xs text-right">
            <p className="text-white/70 text-[15px] leading-relaxed">
              A story of one drop — traced from the deep earth of rural Bengal,
              carried through seven layers of stillness, to your very first sip.
            </p>
            <div className="mt-6 flex items-center gap-2 justify-end text-[11px] tracking-[0.3em] uppercase text-white/50">
              <span>Scroll to begin</span>
              <span className="inline-block w-8 h-px bg-white/40" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── SOURCE ── */}
      <motion.div
        style={{ opacity: sourceOp, y: sourceY }}
        className="absolute inset-0 flex items-center px-6 md:px-16"
        data-testid="chapter-source"
      >
        {/* Padding at every breakpoint: the panel keeps a visible tinted
            background on desktop, so `md:p-0` left the copy flush against its
            own edges. */}
        <div className="max-w-lg w-full p-6 md:p-8 bg-black/70 md:bg-black/45 border border-white/5 md:border-transparent rounded-2xl">
          <div className="chapter-tag mb-6">Chapter 01 — The Source</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-white">
            From the deep earth of <span className="italic text-emerald-200">Bangla</span>.
          </h2>
          <p className="mt-6 text-white/80 text-[15px] md:text-base leading-relaxed max-w-md">
            Two hundred and twenty feet below paddy fields and palm groves,
            an ancient aquifer holds water older than memory. We draw it slowly,
            through a single deep tubewell — never rushed, never over-extracted.
          </p>
          <div className="mt-8 flex gap-8 text-white/75">
            <div>
              <div className="font-display text-3xl text-white">220<span className="text-cyan-200/80 text-base ml-1">ft</span></div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mt-1">Depth</div>
            </div>
            <div>
              <div className="font-display text-3xl text-white">7.2<span className="text-cyan-200/80 text-base ml-1">pH</span></div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mt-1">Natural</div>
            </div>
            <div>
              <div className="font-display text-3xl text-white">0<span className="text-cyan-200/80 text-base ml-1">km</span></div>
              <div className="text-[11px] tracking-[0.25em] uppercase text-white/50 mt-1">Trucked in</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── PURITY ── */}
      <motion.div
        style={{ opacity: purityOp, y: purityY }}
        className="absolute inset-0 flex items-center justify-end px-6 md:px-16"
        data-testid="chapter-purity"
      >
        <div className="max-w-lg text-right w-full p-6 md:p-8 bg-black/70 md:bg-black/45 border border-white/5 md:border-transparent rounded-2xl ml-auto">
          <div className="chapter-tag mb-6">Chapter 02 — Purification</div>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.02] text-white">
            Seven layers, <span className="italic text-cyan-200/90">one silence.</span>
          </h2>
          <p className="mt-6 text-white/80 text-[15px] md:text-base leading-relaxed ml-auto max-w-md">
            A meticulous seven-stage reverse-osmosis process — sediment, activated
            carbon, RO membrane, UV, ozone, mineral re-balancing, and a final
            polish. What remains is water in its most listening state.
          </p>
          {/* The grid shrinks to its content and is pushed right as a block,
              while the items inside stay left-aligned — so the leading `·`
              marks line up in a column instead of going ragged, which is what
              `text-right` on the items themselves was doing. */}
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2 w-fit ml-auto text-left text-white/80 text-[13px]">
            <li>· Sediment filter</li><li>· Activated carbon</li>
            <li>· RO membrane</li><li>· UV sterilisation</li>
            <li>· Ozone infusion</li><li>· Mineral balance</li>
            <li>· Final polish</li><li className="font-bn text-emerald-200">· নির্মলতা</li>
          </ul>
        </div>
      </motion.div>

      {/* ── REVEAL ── */}
      <motion.div
        style={{ opacity: revealOp, y: revealY }}
        className="absolute inset-x-0 top-[62%] flex justify-center px-6"
        data-testid="chapter-reveal"
      >
        <div className="text-center max-w-md w-full p-6 bg-black/70 md:bg-black/45 border border-white/5 md:border-transparent rounded-2xl mx-auto">
          <div className="chapter-tag mb-4">Chapter 03 — The Seal</div>
          <h3 className="font-display text-3xl md:text-5xl italic text-cyan-100">
            The first breath of air.
          </h3>
          <p className="mt-4 text-white/70 text-[14px] leading-relaxed max-w-sm mx-auto">
            The tamper ring breaks. Water preserved hundreds of feet below the earth meets the air for the very first time, pristine and untouched.
          </p>
        </div>
      </motion.div>

      {/* ── PEOPLE ── */}
      <motion.div
        style={{ opacity: peopleOp, y: peopleY }}
        className="absolute inset-0 flex items-end px-6 md:px-16 pb-24"
        data-testid="chapter-people"
      >
        <div className="w-full flex items-end justify-between gap-10">
          <div className="max-w-md bg-black/55 border border-white/10 rounded-2xl p-8">
            <div className="chapter-tag mb-4">Chapter 04 — For Every Thirst</div>
            <h2 className="font-display text-3xl md:text-5xl leading-[1.05] text-white">
              A sip that knows <br/> no border.
            </h2>
            <p className="mt-5 text-white/80 text-[14px] leading-relaxed">
              From a young farmhand in Sundarban to a porter on a Kathmandu trail —
              Prokritir Jol carries the same stillness of the aquifer, wherever it goes.
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-3 items-end">
            <div className="text-[11px] tracking-[0.3em] uppercase text-white/60">Bengal · Nepal · You</div>
            <div className="h-px w-24 bg-white/30" />
            <div className="font-bn text-emerald-200 text-lg">এক ফোঁটা, এক শান্তি</div>
          </div>
        </div>
      </motion.div>

      {/* ── MISSION ── */}
      <motion.div
        style={{ opacity: missionOp }}
        className="absolute inset-0 flex items-center justify-center px-6"
        data-testid="chapter-mission"
      >
        <div className="max-w-3xl text-center">
          <div className="chapter-tag mb-6">Epilogue — Our Promise</div>
          <h2 className="font-display text-4xl md:text-7xl leading-[1.02] text-white">
            We are only <br/>
            <em className="italic text-emerald-200">borrowing</em> the water.
          </h2>
          <p className="mt-8 text-white/75 text-lg leading-relaxed max-w-xl mx-auto">
            Every bottle of Prokritir Jol funds one litre of clean water for
            a family in rural Bengal. Because nature loaned it to us first.
          </p>
          <div className="mt-10 pointer-events-auto inline-flex gap-3">
            <a href="#footer" className="btn-ghost-outline px-6 py-3 rounded-full text-[12px] tracking-[0.25em] uppercase text-white" data-testid="cta-learn-more">
              Read the promise
            </a>
            <button
              type="button"
              onClick={() => open("PJ-500-12")}
              className="px-6 py-3 rounded-full text-[12px] tracking-[0.25em] uppercase bg-cyan-300 text-[#0A192F] hover:bg-cyan-200 transition-colors"
              data-testid="cta-order-mission"
            >
              Order a case
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StoryOverlay;
