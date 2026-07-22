import React from "react";
import { motion, useTransform } from "framer-motion";
import { BOTTLE_BODY_IMG, BOTTLE_CAP_IMG } from "@/lib/brand";

/**
 * BottleScene - sticky bottle that reacts to scrollYProgress (0 → 1)
 *
 * Scroll timeline (0 to 1):
 *  0.00 – 0.16 : Hero float / gentle intro tilt
 *  0.16 – 0.36 : Enters "source" — bottle rotates slowly, scales up a touch
 *  0.36 – 0.55 : Enters "purity" — bottle keeps rotating faster (up to ~720°)
 *  0.55 – 0.70 : Cap lifts / breaks the seal
 *  0.70 – 0.86 : Bottle scales down and fades as drinking scene takes over
 *  0.86 – 1.00 : Faded out for mission + footer
 *
 * The wrapper uses explicit height (vh-based) with a fixed aspect-ratio width
 * expression so nothing collapses if aspect-ratio CSS or auto-width resolution
 * misbehaves on any browser.
 */

// Natural aspect ratio of the body PNG: 620 × 1850 → keep it exact
const BOTTLE_ASPECT = 620 / 1850; // ≈ 0.3351
const CAP_ASPECT = 620 / 285; // ≈ 2.1754

// Measured off the body art: the neck/tamper ring is 49% of the bottle's width,
// centred at 50.3%, and its underside sits 5.2% down from the top of the image.
const CAP_WIDTH_FRAC = 0.5; // cap width, as a fraction of bottle width
const CAP_CENTER_FRAC = 0.503;
const RING_BOTTOM_FRAC = 0.052; // fraction of bottle height
// Cap height expressed in bottle-height units, so the sealed cap can be parked
// with its lower edge exactly on the ring.
const CAP_HEIGHT_FRAC = (CAP_WIDTH_FRAC * BOTTLE_ASPECT) / CAP_ASPECT; // ≈ 0.077
const CAP_TOP_FRAC = RING_BOTTOM_FRAC - CAP_HEIGHT_FRAC; // ≈ -0.025

const BottleScene = ({ progress }) => {
  const bottleY = useTransform(progress, [0, 0.5, 0.85], [0, -20, 60]);
  const bottleScale = useTransform(
    progress,
    [0, 0.15, 0.4, 0.6, 0.78, 0.9],
    [1, 1.05, 1.12, 1.0, 0.78, 0.6]
  );
  const bottleRotate = useTransform(progress, [0, 0.18, 0.55, 0.65], [0, 40, 720, 730]);
  const bottleOpacity = useTransform(progress, [0.78, 0.86, 0.94], [1, 0.35, 0]);

  const capY = useTransform(progress, [0.55, 0.68, 0.78], [0, -180, -320]);
  const capRotate = useTransform(progress, [0.55, 0.78], [0, -16]);
  const capOpacity = useTransform(progress, [0.6, 0.72, 0.86], [1, 1, 0]);

  const dropletOpacity = useTransform(progress, [0.62, 0.72, 0.86], [0, 0.9, 0]);

  const glowScale = useTransform(progress, [0, 0.4, 0.7], [1, 1.3, 0.6]);
  const glowOpacity = useTransform(progress, [0, 0.4, 0.75, 0.9], [0.4, 0.8, 0.3, 0]);

  // Explicit sizing so nothing collapses. Clamped so it never gets absurd on
  // very tall or very narrow viewports.
  const wrapperStyle = {
    height: "min(78vh, calc(90vw / " + BOTTLE_ASPECT + "))",
    width: "min(calc(78vh * " + BOTTLE_ASPECT + "), 90vw)",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1200px" }}
      data-testid="bottle-scene"
    >
      {/* ambient glow */}
      <motion.div
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="absolute h-[70vh] w-[70vh] rounded-full blur-3xl pointer-events-none"
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.35),rgba(19,80,51,0.15)_40%,transparent_70%)]" />
      </motion.div>

      {/* Concentric ripples */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute h-[85vh] w-[85vh] rounded-full border border-white/5 pointer-events-none"
        aria-hidden
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute h-[65vh] w-[65vh] rounded-full border border-cyan-300/10 pointer-events-none"
        aria-hidden
      />

      {/* Bottle wrapper — explicit height + width so aspect ratio never collapses */}
      <motion.div
        style={{
          ...wrapperStyle,
          y: bottleY,
          scale: bottleScale,
          rotate: bottleRotate,
          opacity: bottleOpacity,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
        className="relative bottle-glow"
      >
        {/* Bottle body — capless art, the tamper ring stays behind */}
        <img
          src={BOTTLE_BODY_IMG}
          alt="Prokritir Jol water bottle"
          draggable={false}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          className="absolute inset-0 h-full w-full object-contain select-none"
        />

        {/* Cap — its own art, parked on the ring until the seal breaks */}
        <motion.img
          src={BOTTLE_CAP_IMG}
          alt=""
          draggable={false}
          aria-hidden
          style={{
            top: `${CAP_TOP_FRAC * 100}%`,
            left: `${CAP_CENTER_FRAC * 100}%`,
            width: `${CAP_WIDTH_FRAC * 100}%`,
            x: "-50%",
            y: capY,
            rotate: capRotate,
            opacity: capOpacity,
            transformOrigin: "50% 100%",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
          }}
          className="absolute h-auto select-none"
        />

        {/* Water droplet trail when cap opens */}
        <motion.div
          style={{ opacity: dropletOpacity }}
          className="absolute top-[6%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
          aria-hidden
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-1.5 rounded-full bg-cyan-200/70"
              style={{ animation: `drip 1.4s ${i * 0.35}s ease-in infinite` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BottleScene;
