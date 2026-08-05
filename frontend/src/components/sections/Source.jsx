import React from "react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { SOURCE, IMAGES } from "@/lib/brand";

/**
 * The Source — asymmetric split. The photograph runs wide on the left and the
 * glass copy panel is pulled back over its edge on desktop, so the two planes
 * overlap instead of sitting in tidy columns.
 */
const Source = () => (
  <section id="source" className="relative overflow-hidden py-24 md:py-32">
    <div className="aurora absolute -left-64 top-40 h-[600px] w-[600px] opacity-60" aria-hidden />

    <div className="relative mx-auto max-w-[1440px] px-6 md:px-10">
      <Reveal className="max-w-3xl">
        <div className="eyebrow">{SOURCE.eyebrow}</div>
        <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.7rem)]">
          {SOURCE.title}{" "}
          <em className="italic ink-accent">{SOURCE.titleAccent}</em>
        </h2>
      </Reveal>

      <div className="mt-16 grid items-center gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-0">
        {/* Photograph */}
        <Reveal className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10">
            <img
              src={IMAGES.stream}
              alt="A shallow stream running clear over pale stones"
              className="ken h-[380px] w-full object-cover md:h-[560px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040c13]/70 via-transparent to-transparent" />

            {/* Floating detail card */}
            <div className="glass-strong absolute bottom-6 left-6 hidden w-[210px] rounded-2xl p-3 sm:block">
              <img
                src={IMAGES.tubewell}
                alt="A village hand pump beside a field"
                className="h-28 w-full rounded-xl object-cover"
              />
              <div className="px-1 pb-1 pt-3">
                <div className="eyebrow !text-[9px]">The well</div>
                <div className="mt-1 text-[13px] text-[color:var(--paper-dim)]">
                  220 ft below Nadia
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Copy panel, overlapping the photo on desktop */}
        <Reveal delay={0.12} className="relative z-10 lg:col-span-5 lg:-ml-24">
          <GlassPanel radius={32} className="edge-light">
            <div className="p-8 md:p-11">
            {SOURCE.paragraphs.map((p, i) => (
              <p
                key={i}
                className={`text-[15px] leading-relaxed text-[color:var(--paper-dim)] ${i > 0 ? "mt-5" : ""}`}
              >
                {p}
              </p>
            ))}

            <div className="mt-9 space-y-4">
              {SOURCE.facts.map((f) => (
                <div key={f.k} className="flex items-baseline gap-4">
                  <div className="font-display w-[132px] shrink-0 text-[18px] text-[#4fd1e3]">
                    {f.k}
                  </div>
                  <div className="text-[13px] text-[color:var(--paper-faint)]">{f.v}</div>
                </div>
              ))}
            </div>
            </div>
          </GlassPanel>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Source;
