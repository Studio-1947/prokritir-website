import React, { useRef } from "react";
import { useScroll, motion, useSpring } from "framer-motion";
import Nav from "@/components/Nav";
import BackgroundStage from "@/components/BackgroundStage";
import BottleScene from "@/components/BottleScene";
import StoryOverlay from "@/components/StoryOverlay";
import Footer from "@/components/Footer";
import { CHAPTERS } from "@/lib/brand";

/**
 * Landing page — one long scrollable story container with a sticky viewport
 * scene (backgrounds + bottle + text overlays), followed by the footer.
 */
const Landing = () => {
  const storyRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"],
  });
  // Use raw scrollYProgress for scene transforms so backgrounds/overlays are
  // perfectly locked to the scroll position (no lag). Only the top progress
  // bar gets a subtle spring for aesthetic smoothness.
  const progress = scrollYProgress;
  const barProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  // Total story track = ~6 viewport heights, giving each chapter breathing room.
  return (
    <div className="relative bg-[#061021] text-white">
      <Nav progress={progress} />

      {/* Top progress bar */}
      <motion.div
        style={{ scaleX: barProgress }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan-300 origin-left z-[70]"
        data-testid="scroll-progress"
      />

      {/* STORY TRACK */}
      <section ref={storyRef} className="relative" style={{ height: `${CHAPTERS.length * 100}vh` }}>
        {/* Sticky viewport stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <BackgroundStage progress={progress} />
          <BottleScene progress={progress} />
          <StoryOverlay progress={progress} />

          {/* Bottom bar with brand ticker */}
          {/* Solid tint rather than backdrop-blur: a backdrop-filter forces the
              compositor to re-copy and re-blur whatever is behind it, and what
              is behind it here is the animating bottle scene — so it re-ran on
              every scroll frame for a bar of small type. */}
          <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#04101f]/85">
            <div className="mx-auto max-w-[1400px] px-6 md:px-12 py-3 flex items-center justify-between text-[11px] tracking-[0.25em] uppercase text-white/60">
              <span>প্রকৃতির জল · Prokritir Jol</span>
              <span className="hidden md:inline">500 ml · RO Purified · Nadia, West Bengal</span>
              <span>Scroll ↓</span>
            </div>
          </div>
        </div>

        {/* Invisible anchors for chapter navigation */}
        {CHAPTERS.map((c, i) => (
          <span
            key={c.id}
            id={c.id}
            className="pointer-events-none block"
            style={{
              position: "absolute",
              top: `${(i / CHAPTERS.length) * 100}%`,
              height: "1px",
              width: "1px",
            }}
          />
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
