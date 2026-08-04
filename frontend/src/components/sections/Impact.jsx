import React from "react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { IMPACT, IMAGES } from "@/lib/brand";

/**
 * Our Promise — copy on the left, a glass counter panel on the right.
 * The counters are the only place on the page where numbers get this large.
 */
const Impact = () => (
  <section id="promise" className="relative overflow-hidden py-24 md:py-32 grain">
    <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <div className="eyebrow">{IMPACT.eyebrow}</div>
          <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.7rem)]">
            {IMPACT.title}
            <br />
            <em className="italic ink-accent">{IMPACT.titleAccent}</em>
          </h2>
          <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-[color:var(--paper-dim)]">
            {IMPACT.body}
          </p>

          <GlassPanel radius={24} className="mt-10 inline-block w-auto">
            <div className="px-8 py-6">
              <div className="font-bn text-[22px] text-[#63e6a8]">{IMPACT.quote}</div>
              <div className="eyebrow mt-2">{IMPACT.quoteRoman}</div>
            </div>
          </GlassPanel>
        </Reveal>

        <Reveal delay={0.12} className="lg:col-span-6">
          <GlassPanel radius={36} className="edge-light">
            <div className="p-8 md:p-11">
            <div className="space-y-8">
              {IMPACT.counters.map((c, i) => (
                <div key={c.label}>
                  <div className="font-display text-[clamp(2.6rem,5vw,3.8rem)] leading-none ink-accent">
                    {c.value}
                  </div>
                  <div className="eyebrow mt-3">{c.label}</div>
                  {i < IMPACT.counters.length - 1 && <div className="rule mt-8" />}
                </div>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={IMAGES.field}
                alt="Late sun over an open field"
                className="h-40 w-full object-cover"
              />
            </div>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Impact;
