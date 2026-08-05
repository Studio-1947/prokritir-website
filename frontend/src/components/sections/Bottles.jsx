import React from "react";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import GlassPanel from "@/components/GlassPanel";
import { BOTTLES } from "@/lib/brand";
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

        <div className="mx-auto mt-16 grid max-w-md gap-6 lg:max-w-none lg:grid-cols-3">
          {BOTTLES.tiers.map((t, i) => (
            <Reveal key={t.sku} delay={i * 0.08}>
              <GlassPanel fill
                radius={32}
                overflowVisible
                className={`glass-hover h-full ${
                  t.featured ? "ring-1 ring-[#4fd1e3]/40 lg:-mt-6" : ""
                }`}
                data-testid={`tier-${t.sku}`}
              >
              <div className={`relative flex h-full flex-col p-8 md:p-9 ${t.featured ? "lg:pb-12" : ""}`}>
                {t.featured && (
                  <span className="btn-accent absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em]">
                    {t.note}
                  </span>
                )}

                {/* The packs are square shots and the single is a tall bottle,
                    so the frame is fixed and object-contain does the fitting —
                    each tier keeps its true proportions instead of one being
                    stretched to match the other. */}
                <div className="relative mx-auto flex h-[230px] w-full items-center justify-center sm:h-[270px]">
                  {/* Every tier gets a bloom, not just the featured one: the
                      plastic is transparent, so without something lit behind it
                      the pack refracts empty panel and goes flat. The featured
                      card just gets more of it. */}
                  <div
                    className={`aurora absolute inset-x-4 inset-y-0 ${
                      t.featured ? "opacity-80" : "opacity-40"
                    }`}
                    aria-hidden
                  />
                  {/* Contact shadow — see .product-shot__contact in index.css
                      for why the weight sits here and not on the image. */}
                  <div
                    className={`product-shot__contact ${
                      t.sku === "PJ-500-1" ? "product-shot__contact--narrow" : ""
                    }`}
                    aria-hidden
                  />
                  <img
                    src={t.image}
                    alt={`${t.name} — ${t.size}`}
                    draggable={false}
                    // The single bottle is tall and the packs are square, so
                    // scale each toward whichever edge it runs out of first —
                    // the packs then use the card's full width instead of
                    // being held back by a height meant for the bottle.
                    className={`product-shot__img relative max-h-full max-w-full select-none object-contain ${
                      t.sku === "PJ-500-1" ? "h-full w-auto" : "w-full"
                    }`}
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
