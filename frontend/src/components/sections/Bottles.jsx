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

        {/* Three tiers into two columns on phones: the first two share a row
            and the last spans the full width beneath them. A 1-up stack made
            the section four screens tall before anyone reached the price of
            the second bottle. Three even columns from lg up, as before. */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {BOTTLES.tiers.map((t, i) => (
            <Reveal
              key={t.sku}
              delay={i * 0.08}
              className={i === BOTTLES.tiers.length - 1 ? "col-span-2 lg:col-span-1" : ""}
            >
              <GlassPanel fill
                radius={32}
                overflowVisible
                className={`glass-hover h-full ${
                  t.featured ? "ring-1 ring-[#4fd1e3]/40 lg:-mt-6" : ""
                }`}
                data-testid={`tier-${t.sku}`}
              >
              <div className={`relative flex h-full flex-col p-5 sm:p-7 md:p-9 ${t.featured ? "lg:pb-12" : ""}`}>
                {t.featured && (
                  <span className="btn-accent absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 text-[9px] uppercase tracking-[0.16em] sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]">
                    {t.note}
                  </span>
                )}

                {/* The packs are square shots and the single is a tall bottle,
                    so the frame is fixed and object-contain does the fitting —
                    each tier keeps its true proportions instead of one being
                    stretched to match the other. */}
                <div className="relative mx-auto flex h-[150px] w-full items-center justify-center sm:h-[230px] md:h-[270px]">
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

                {/* Everything below steps down a size at the 2-up width — at
                    ~150px of usable column a 52px price and 8px of padding on
                    each side leave no room for the rupee figure to sit on one
                    line. Full sizes return from sm up. */}
                <div className="mt-5 text-center sm:mt-7">
                  <h3 className="font-display text-[21px] leading-none sm:text-[26px] md:text-[30px]">
                    {t.name}
                  </h3>
                  <div className="eyebrow mt-2 !text-[9px] sm:mt-3 sm:!text-[10px]">{t.size}</div>
                </div>

                <div className="my-5 text-center sm:my-7">
                  <div className="font-display text-[36px] leading-none sm:text-[44px] md:text-[52px]">
                    {inr(t.price)}
                  </div>
                  {!t.featured && (
                    <div className="mt-2 text-[11px] text-[color:var(--paper-faint)] sm:text-[12px]">
                      {t.note}
                    </div>
                  )}
                </div>

                <ul className="mb-6 space-y-2.5 sm:mb-8 sm:space-y-3">
                  {t.perks.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 text-[12px] leading-snug text-[color:var(--paper-dim)] sm:gap-3 sm:text-[13.5px]"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#63e6a8] sm:h-4 sm:w-4" />
                      {p}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => open(t.sku)}
                  className={`mt-auto w-full py-3 text-[11px] uppercase tracking-[0.14em] sm:py-4 sm:text-[12px] sm:tracking-[0.18em] ${
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
