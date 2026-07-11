import React from "react";
import { motion, useTransform } from "framer-motion";
import { BOTTLE_IMG } from "@/lib/brand";

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
 */
const BottleScene = ({ progress }) => {
  // Bottle transforms tied to full-story scroll progress
  const bottleY = useTransform(progress, [0, 0.5, 0.85], [0, -20, 60]);
  const bottleScale = useTransform(
    progress,
    [0, 0.15, 0.4, 0.6, 0.78, 0.9],
    [1, 1.05, 1.12, 1.0, 0.78, 0.6]
  );
  const bottleRotate = useTransform(progress, [0, 0.18, 0.55, 0.65], [0, 40, 720, 730]);
  const bottleOpacity = useTransform(progress, [0.78, 0.86, 0.94], [1, 0.35, 0]);

  // Cap lift transform (only cap layer)
  const capY = useTransform(progress, [0.55, 0.68, 0.78], [0, -180, -320]);
  const capRotate = useTransform(progress, [0.55, 0.78], [0, -16]);
  const capOpacity = useTransform(progress, [0.6, 0.72, 0.86], [1, 1, 0]);

  // Ambient glow amplifier
  const glowScale = useTransform(progress, [0, 0.4, 0.7], [1, 1.3, 0.6]);
  const glowOpacity = useTransform(progress, [0, 0.4, 0.75, 0.9], [0.4, 0.8, 0.3, 0]);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1200px" }}
      data-testid="bottle-scene"
    >
      {/* ambient glow */}
      <motion.div
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="absolute h-[70vh] w-[70vh] rounded-full blur-3xl"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.35),rgba(19,80,51,0.15)_40%,transparent_70%)]" />
      </motion.div>

      {/* Concentric ripples */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute h-[85vh] w-[85vh] rounded-full border border-white/5"
      />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute h-[65vh] w-[65vh] rounded-full border border-cyan-300/10"
      />

      {/* Bottle wrapper */}
      <motion.div
        style={{
          y: bottleY,
          scale: bottleScale,
          rotate: bottleRotate,
          opacity: bottleOpacity,
          transformStyle: "preserve-3d",
        }}
        className="relative h-[78vh] w-auto bottle-glow"
      >
        {/* Bottle body (with top 12% clipped away) */}
        <div
          className="relative h-full"
          style={{
            width: "auto",
            aspectRatio: "573/1230",
          }}
        >
          <img
            src={BOTTLE_IMG}
            alt="Prokritir Jol water bottle body"
            draggable={false}
            className="h-full w-auto select-none"
            style={{
              clipPath: "inset(11.5% 0 0 0)",
            }}
          />
          {/* Cap layer, positioned exactly over top of bottle */}
          <motion.img
            src={BOTTLE_IMG}
            alt="Bottle cap"
            draggable={false}
            style={{
              y: capY,
              rotate: capRotate,
              opacity: capOpacity,
              clipPath: "inset(0 0 88.5% 0)",
              transformOrigin: "50% 30%",
            }}
            className="absolute inset-0 h-full w-auto select-none"
          />
        </div>

        {/* Water droplet trail when cap opens */}
        <motion.div
          style={{ opacity: useTransform(progress, [0.62, 0.72, 0.86], [0, 0.9, 0]) }}
          className="absolute top-[6%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
