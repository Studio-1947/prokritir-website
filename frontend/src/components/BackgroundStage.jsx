import React from "react";
import { motion, useTransform } from "framer-motion";
import { IMAGES } from "@/lib/brand";

/**
 * BackgroundStage - full-screen sticky background layers whose opacities are
 * driven by the story's scrollYProgress. Sits BEHIND the bottle.
 */
const BackgroundStage = ({ progress }) => {
  // Hero (deep navy) → source (village) → purity (splash) → drinking (warm) → mission (dark)
  const heroOpacity   = useTransform(progress, [0, 0.14, 0.20], [1, 1, 0]);
  const sourceOpacity = useTransform(progress, [0.16, 0.23, 0.36, 0.42], [0, 1, 1, 0]);
  const purityOpacity = useTransform(progress, [0.40, 0.48, 0.56, 0.62], [0, 1, 1, 0]);
  const revealOpacity = useTransform(progress, [0.60, 0.68, 0.84, 0.90], [0, 1, 1, 0]);
  const missionOpacity= useTransform(progress, [0.88, 0.94], [0, 1]);

  // gentle parallax on source & purity backgrounds
  const villageY = useTransform(progress, [0.14, 0.44], ["0%", "-8%"]);
  const purityY  = useTransform(progress, [0.4, 0.66], ["0%", "-6%"]);
  const revealY  = useTransform(progress, [0.62, 0.86], ["0%", "-8%"]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Hero — deep navy with radial */}
      <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_35%,#0d2748,transparent_60%),radial-gradient(1200px_800px_at_50%_120%,#0f3a2a,#061021_60%)]" />
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><path fill=%22none%22 stroke=%22%23ffffff10%22 stroke-width=%220.5%22 d=%22M0 30h60M30 0v60%22/></svg>')]" />
      </motion.div>

      {/* Source — lush village + tubewell overlay */}
      <motion.div style={{ opacity: sourceOpacity }} className="absolute inset-0">
        <motion.div style={{ y: villageY }} className="absolute -inset-y-[6%] inset-x-0">
          <img
            src={IMAGES.village}
            alt="Lush green rural Bengal village"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#061021]/70 via-[#061021]/25 to-[#061021]/90" />
        {/* Corner tubewell inset */}
        <div className="absolute bottom-10 right-10 hidden lg:block">
          <div className="relative h-56 w-40 rounded-xl overflow-hidden border border-white/10 backdrop-blur-md">
            <img src={IMAGES.tubewell} alt="Deep tubewell" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-[10px] tracking-[0.25em] uppercase text-white/85">
              Deep Aquifer<br/><span className="text-white/50">220ft below</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Purity — water splash macro */}
      <motion.div style={{ opacity: purityOpacity }} className="absolute inset-0">
        <motion.div style={{ y: purityY }} className="absolute -inset-y-[6%] inset-x-0">
          <img
            src={IMAGES.purity}
            alt="Water droplet macro representing RO purity"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#03131f]/85 via-[#03131f]/50 to-[#03131f]/95" />
      </motion.div>

      {/* Reveal / Drinking — twin portrait split */}
      <motion.div style={{ opacity: revealOpacity }} className="absolute inset-0">
        <motion.div style={{ y: revealY }} className="absolute inset-0 grid grid-cols-2">
          <img
            src={IMAGES.bengaliYouth}
            alt="Young Bengali man drinking water"
            className="h-full w-full object-cover object-center"
          />
          <img
            src={IMAGES.nepaliYouth}
            alt="Nepali youth drinking water"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#061021]/60 via-[#061021]/20 to-[#061021]/90" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
      </motion.div>

      {/* Mission — dark cinematic close */}
      <motion.div style={{ opacity: missionOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_600px_at_50%_20%,#0f3a2a,#061021_60%)]" />
      </motion.div>

      {/* Grain overlay on top of all backgrounds */}
      <div className="grain absolute inset-0" />
    </div>
  );
};

export default BackgroundStage;
