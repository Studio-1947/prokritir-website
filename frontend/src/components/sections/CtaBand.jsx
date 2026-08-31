import React from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { BRAND } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

/**
 * Closing CTA — one wide frosted slab over the ferrofluid, the last thing
 * before the footer.
 */
const CtaBand = () => {
  const { open } = useOrder();

  return (
    <section className="relative px-6 pb-24 md:px-10 md:pb-32">
      <Reveal>
        {/* Frosted band — the ferrofluid drifts behind it. */}
        <GlassPanel radius={40} className="mx-auto max-w-[1440px]">
        <div className="relative">
          <div className="aurora absolute -right-20 -top-20 h-[420px] w-[420px]" aria-hidden />

          <div className="relative z-10 flex flex-col items-start gap-10 px-8 py-16 md:px-16 md:py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">Order on WhatsApp · West Bengal</div>
              <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
                Taste the difference
                <br />
                <em className="italic ink-accent">two hundred feet makes.</em>
              </h2>
              <p className="font-bn mt-6 text-[17px] text-[color:var(--paper-dim)]">
                {BRAND.bengali} — {BRAND.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={() => open()}
              className="btn-accent inline-flex shrink-0 items-center gap-3 px-9 py-5 text-[13px] uppercase tracking-[0.18em]"
              data-testid="cta-band-order"
            >
              Order now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        </GlassPanel>
      </Reveal>
    </section>
  );
};

export default CtaBand;
