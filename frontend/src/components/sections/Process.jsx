import React from "react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { STAGES } from "@/lib/brand";

/**
 * Seven Stages — glass cards frosting the ferrofluid behind them. The seventh
 * (Nirmalata) is the only human step, so it runs double-width with the accent
 * treatment and closes the grid rather than trailing off it.y
 */
const Process = () => (
  <section id="purity" className="relative overflow-hidden py-24 md:py-32 grain">
    <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="eyebrow">Purification</div>
          <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.7rem)]">
            Seven layers,
            <br />
            <em className="italic ink-accent">one silence.</em>
          </h2>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-[color:var(--paper-dim)]">
          Six machines and one person. Water enters at the top of this list already
          clean, and leaves it having been checked seven separate times.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((s, i) => {
          const isLast = i === STAGES.length - 1;
          return (
            <Reveal
              key={s.n}
              delay={Math.min(i * 0.06, 0.4)}
              className={isLast ? "sm:col-span-2" : ""}
            >
              <GlassPanel fill radius={26}
                className={`glass-hover h-full ${isLast ? "ring-1 ring-[#63e6a8]/35" : ""}`}
              >
                <div className="p-7">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`font-display text-[34px] leading-none ${
                      isLast ? "ink-accent" : "text-white"
                    }`}
                  >
                    {s.n}
                  </span>
                  {isLast && (
                    <span className="rounded-full border border-[#63e6a8]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#63e6a8]">
                      By hand
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-[17px] font-semibold tracking-tight">
                  {s.name}
                  {s.bn && <span className="font-bn ml-2 text-[15px] text-[#63e6a8]">{s.bn}</span>}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-[color:var(--paper-faint)]">
                  {s.body}
                </p>
                </div>
              </GlassPanel>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default Process;
