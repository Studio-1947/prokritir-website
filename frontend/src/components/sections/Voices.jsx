import React from "react";
import { Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { VOICES } from "@/lib/brand";

/**
 * Voices  three glass quote cards. Avatars are monograms rather than stock
 * portraits: putting a stranger's face beside words they never said is the
 * one shortcut worth refusing.
 */
const Voices = () => (
  <section className="relative py-20 md:py-28">
    <div className="mx-auto max-w-[1440px] px-6 md:px-10">
      <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">Voices</div>
          <h2 className="font-display mt-6 text-[clamp(2rem,4vw,3.1rem)]">
            What people <em className="italic ink-accent">notice.</em>
          </h2>
        </div>
        <div className="rule w-full max-w-xs md:mb-4" />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VOICES.map((v, i) => (
          <Reveal key={v.name} delay={i * 0.08}>
            <GlassPanel fill radius={28} className="glass-hover h-full">
              <figure className="flex h-full flex-col p-8">
                <Quote className="h-7 w-7 text-[#4fd1e3]/60" />
                <blockquote className="mt-6 flex-1 text-[15.5px] leading-relaxed text-[color:var(--paper-dim)]">
                  {v.quote}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold text-[#052029]"
                    style={{ background: "linear-gradient(135deg,#4fd1e3,#63e6a8)" }}
                  >
                    {v.initials}
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold">{v.name}</span>
                    <span className="block text-[12px] text-[color:var(--paper-faint)]">{v.role}</span>
                  </span>
                </figcaption>
              </figure>
            </GlassPanel>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Voices;
