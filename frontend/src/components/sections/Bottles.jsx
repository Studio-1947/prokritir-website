import React from "react";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { BOTTLES, BOTTLE_IMG } from "@/lib/brand";
import { useOrder } from "@/lib/orderContext";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

/**
 * Bottles — three glass tiers. The middle one is raised and accent-edged; each
 * button opens the order modal with its SKU already in the cart.
 */
const Bottles = () => {
  const { open } = useOrder();

  return (
    <section id="bottles" className="relative overflow-hidden py-24 md:py-32">
      <div className="aurora aurora-mint absolute -right-56 top-20 h-[560px] w-[560px] opacity-70" aria-hidden />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="eyebrow">{BOTTLES.eyebrow}</div>
          <h2 className="font-display mt-6 text-[clamp(2.2rem,4.6vw,3.7rem)]">
            {BOTTLES.title} <em className="italic ink-accent">{BOTTLES.titleAccent}</em>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-[color:var(--paper-dim)]">
            {BOTTLES.body}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {BOTTLES.tiers.map((t, i) => (
            <Reveal key={t.sku} delay={i * 0.08}>
              <GlassPanel
                radius={32}
                overflowVisible
                className={`glass-hover h-full ${
                  t.featured ? "ring-1 ring-[#4fd1e3]/40 md:-mt-6" : ""
                }`}
                data-testid={`tier-${t.sku}`}
              >
              <div className={`relative flex h-full flex-col p-8 md:p-9 ${t.featured ? "md:pb-12" : ""}`}>
                {t.featured && (
                  <span className="btn-accent absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]">
                    {t.note}
                  </span>
                )}

                <div className="relative mx-auto h-[150px] w-full">
                  {t.featured && (
                    <div className="aurora absolute inset-x-6 inset-y-0 opacity-80" aria-hidden />
                  )}
                  <img
                    src={BOTTLE_IMG}
                    alt=""
                    aria-hidden
                    draggable={false}
                    className="relative mx-auto h-full w-auto select-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                  />
                </div>

                <div className="mt-7 text-center">
                  <h3 className="font-display text-[30px] leading-none">{t.name}</h3>
                  <div className="eyebrow mt-3">{t.size}</div>
                </div>

                <div className="my-7 text-center">
                  <div className="font-display text-[52px] leading-none">{inr(t.price)}</div>
                  {!t.featured && (
                    <div className="mt-2 text-[12px] text-[color:var(--paper-faint)]">{t.note}</div>
                  )}
                </div>

                <ul className="mb-8 space-y-3">
                  {t.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[13.5px] text-[color:var(--paper-dim)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#63e6a8]" />
                      {p}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => open(t.sku)}
                  className={`mt-auto w-full py-4 text-[12px] uppercase tracking-[0.18em] ${
                    t.featured ? "btn-accent" : "btn-glass"
                  }`}
                  data-testid={`order-${t.sku}`}
                >
                  Order {t.name.toLowerCase()}
                </button>
              </div>
              </GlassPanel>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-[13px] text-[color:var(--paper-faint)]">
            Other sizes — 24-bottle cases and single litres — are available inside the order form.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Bottles;
