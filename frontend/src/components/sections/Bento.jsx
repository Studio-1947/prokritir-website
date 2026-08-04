import React from "react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { IMAGES, BRAND } from "@/lib/brand";

/**
 * Bento — mixed-size tiles, the counterweight to the even grid above it.
 * A tall photo anchors the left, statements and details fill the right.
 */
const Bento = () => (
  <section className="relative py-20 md:py-28">
    <div className="mx-auto max-w-[1440px] px-6 md:px-10">
      <Reveal className="mb-12 max-w-2xl">
        <div className="eyebrow">In the bottle</div>
        <h2 className="font-display mt-6 text-[clamp(2rem,4vw,3.1rem)]">
          Small things, <em className="italic ink-accent">done properly.</em>
        </h2>
      </Reveal>

      <div className="grid auto-rows-[minmax(190px,auto)] grid-cols-1 gap-5 md:grid-cols-12">
        {/* Tall photo */}
        <Reveal className="md:col-span-5 md:row-span-2">
          <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/10">
            <img
              src={IMAGES.village}
              alt="Lush green paddy country in rural Bengal"
              className="h-full min-h-[300px] w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040c13] via-[#040c13]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <div className="eyebrow">Where it comes from</div>
              <div className="font-display mt-3 text-[30px] leading-tight">
                Paddy country,
                <br />
                <em className="italic">Nadia district.</em>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Zero km */}
        <Reveal delay={0.06} className="md:col-span-4">
          <GlassPanel radius={28} className="glass-hover h-full">
            <div className="flex h-full flex-col justify-between p-8">
              <div className="eyebrow">Distance from well to bottle</div>
              <div>
                <div className="font-display text-[76px] leading-none ink-accent">0 km</div>
                <p className="mt-4 text-[13.5px] leading-relaxed text-[color:var(--paper-faint)]">
                  Drawn, purified and sealed on one site. Nothing is tankered in and
                  nothing is blended from a second source.
                </p>
              </div>
            </div>
          </GlassPanel>
        </Reveal>

        {/* Macro droplet */}
        <Reveal delay={0.12} className="md:col-span-3">
          <div className="group relative h-full overflow-hidden rounded-[28px] border border-white/10">
            <img
              src={IMAGES.droplet}
              alt="A single droplet meeting still water"
              className="h-full min-h-[190px] w-full object-cover transition-transform [transition-duration:1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#040c13]/35" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="font-bn text-[18px] text-[#63e6a8]">নির্মলতা</div>
              <div className="eyebrow mt-1 !text-[9px]">Nirmalata · clarity</div>
            </div>
          </div>
        </Reveal>

        {/* Quote */}
        <Reveal delay={0.18} className="md:col-span-4">
          <GlassPanel radius={28} className="glass-hover h-full">
            <div className="flex h-full flex-col justify-center p-8">
              <div className="font-display text-[26px] leading-[1.25]">
                “We are only <em className="italic ink-accent">borrowing</em> the water.
                Nature loaned it to us first.”
              </div>
              <div className="eyebrow mt-6">{BRAND.origin}</div>
            </div>
          </GlassPanel>
        </Reveal>

        {/* Spec list */}
        <Reveal delay={0.24} className="md:col-span-3">
          <GlassPanel radius={28} className="glass-hover h-full">
            <div className="flex h-full flex-col justify-between p-8">
              <div className="eyebrow">Every bottle</div>
              <ul className="mt-6 space-y-3 text-[13.5px] text-[color:var(--paper-dim)]">
                {["Food-grade PET", "Tamper-evident ring", "Batch-tested", "Fully recyclable"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#4fd1e3]" />
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Bento;
