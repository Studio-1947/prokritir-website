import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWaveNav, RISE, HOLD, FALL } from "@/lib/waveNav";

/**
 * SectionTransition — a wall of powder that sweeps up from the bottom of the
 * screen when you move between sections, then falls back down to reveal the
 * page you arrived on.
 *
 * The new route is already mounted underneath while this plays; the overlay is
 * purely a curtain, so nothing here can block navigation if it misbehaves. It
 * is pointer-events-none throughout for the same reason.
 *
 * Built out of stacked radial gradients rather than blurred shapes: a gradient
 * is soft by construction, so the whole curtain is one composited layer moving
 * on transform alone. A `filter: blur()` on something this large, animating,
 * would drop frames on exactly the mid-range phones this is meant to delight.
 */

// RISE / HOLD / FALL live in @/lib/waveNav — the gate needs them to time the
// route swap to the covered moment, and they must not drift apart from what
// this component actually animates.

// Per-destination palette. `deep` is the settled powder at the base of the
// curtain, `mid` the body of the cloud, `lift` the lit edge at its crown.
// Kept close to the section's own page background and deliberately desaturated
// — powder is dust, not paint.
// `tones` is what stops the curtain reading as one flat colour: they are used
// for the crown puffs and for the pockets of colour suspended in the body, so
// the powder varies in hue across its width as well as up its height.
const PALETTES = {
  water: {
    deep: "#061021",
    mid: "#0a4459",
    lift: "#12869f",
    spark: "#9fe4f0",
    tones: ["#0d6a86", "#12607f", "#0a7f8c", "#155e75", "#0e88a3", "#093f56"],
  },
};

// Pockets of colour suspended inside the body of the cloud. x is vw across,
// `up` is vh from the base of the curtain, `t` indexes into the palette's
// tones. Soft and overlapping, so they mottle the wall rather than reading as
// discrete blobs.
// Spread all the way from the base to just under the crown. Clustered only in
// the lower half, they left a dead, colourless band across the middle of the
// wall once the curtain was fully drawn.
const POCKETS = [
  { x: 12, up: 14, size: 46, t: 0, o: 0.5 },
  { x: 34, up: 6, size: 38, t: 2, o: 0.42 },
  { x: 58, up: 20, size: 52, t: 1, o: 0.34 },
  { x: 80, up: 10, size: 44, t: 0, o: 0.46 },
  { x: 24, up: 36, size: 44, t: 4, o: 0.38 },
  { x: 68, up: 42, size: 40, t: 3, o: 0.34 },
  { x: 92, up: 30, size: 34, t: 5, o: 0.4 },
  { x: 4, up: 40, size: 32, t: 1, o: 0.28 },
  { x: 44, up: 56, size: 48, t: 0, o: 0.32 },
  { x: 16, up: 62, size: 38, t: 1, o: 0.28 },
  { x: 76, up: 66, size: 42, t: 2, o: 0.3 },
  { x: 58, up: 78, size: 36, t: 4, o: 0.24 },
  { x: 30, up: 84, size: 32, t: 3, o: 0.22 },
];

// Puffs along the crown of the curtain, so its top edge billows instead of
// reading as a straight rectangle. x/size are in vw, y nudges each puff off
// the crown line. Fixed values, not random — the curtain should look the same
// every time it plays.
// Sizes stay modest on purpose. An earlier pass used up to 84vw — over 1000px
// across on a laptop — and since each puff is centred on the crown it reached
// half its width ABOVE the cloud, blanketing the whole viewport before the body
// had left the bottom of the screen. The curtain looked instant. These add
// lumpiness to the silhouette; the body does the covering.
// Wave crests, drawn open (no closing edge) in a 1200x200 box and stretched to
// each layer's width. Two phases so the swells never line up: `a` leads with a
// crest, `b` with a trough. `preserveAspectRatio="none"` lets them squash to
// any viewport, and the fill variant closes the path down to the box floor so
// it joins the body beneath seamlessly.
const CURVES = {
  a: "M0,120 C100,40 200,40 300,120 S500,200 600,120 S800,40 900,120 S1100,200 1200,120",
  b: "M0,96 C150,168 250,168 400,96 S650,24 800,96 S1050,168 1200,96",
};
const fillPath = (curve) => `${curve} L1200,200 L0,200 Z`;

// Three swells. Each is twice viewport width and slides horizontally while it
// rises — that lateral roll is what separates a wave from a rising wall. They
// travel different distances, and the back two in the opposite direction to
// the front, so the crests churn against each other instead of moving as one
// sheet. `lift` is how far past the top each layer settles.
const WAVES = [
  { key: "back", curve: "b", tone: 3, crest: 26, h: 134, xFrom: -6, xTo: -54, o: 0.5, lift: -7, times: [0, 0.54, 0.66, 1] },
  { key: "mid", curve: "a", tone: 0, crest: 21, h: 126, xFrom: -52, xTo: -2, o: 0.68, lift: -4, times: [0, 0.5, 0.62, 1] },
];

// Grains that outrun the cloud, thrown clear of its crown.
const GRAINS = [
  { x: 12, size: 5, rise: 74, delay: 0.06, drift: 5 },
  { x: 27, size: 3, rise: 88, delay: 0.0, drift: -4 },
  { x: 35, size: 7, rise: 66, delay: 0.13, drift: 7 },
  { x: 46, size: 4, rise: 92, delay: 0.04, drift: -3 },
  { x: 58, size: 6, rise: 71, delay: 0.16, drift: 6 },
  { x: 64, size: 3, rise: 84, delay: 0.09, drift: -6 },
  { x: 76, size: 6, rise: 69, delay: 0.02, drift: 4 },
  { x: 88, size: 4, rise: 90, delay: 0.11, drift: -5 },
];

// The page's existing noise texture, reused so the powder has tooth.
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/**
 * A wave crest that slides sideways while its parent layer rises. The svg is
 * twice viewport width so it can travel without ever exposing an edge, and
 * `preserveAspectRatio="none"` lets the curve stretch to whatever shape the
 * viewport is. The lateral travel is the whole point: a crest that only goes
 * up reads as a rising wall no matter how it is shaped.
 */
const RollingCrest = ({ curve, crest, xFrom, xTo, fill, foam }) => (
  <motion.div
    className="absolute left-0 top-0 w-[200vw] will-change-transform"
    style={{ height: `${crest}vh` }}
    initial={{ x: `${xFrom}vw` }}
    animate={{
      x: [`${xFrom}vw`, `${xTo}vw`],
      transition: { duration: RISE + HOLD + FALL, ease: "easeInOut" },
    }}
  >
    <svg
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="block h-full w-full"
      aria-hidden
    >
      <path d={fillPath(curve)} fill={fill} />
      {/* Foam rides the open curve only — stroking the filled path would draw
          the closing edges as vertical lines down the sides of the screen. */}
      {foam && (
        <path d={curve} fill="none" stroke={foam} strokeWidth="5" opacity="0.4" />
      )}
    </svg>
  </motion.div>
);

const Curtain = ({ palette }) => {
  // 100% = wholly below the fold, 0% = wholly covering. Keyframes run
  // up-hold-down in one pass so the curtain never stalls mid-screen.
  const sweep = {
    initial: { y: "100%" },
    animate: {
      y: ["100%", "0%", "0%", "100%"],
      transition: {
        duration: RISE + HOLD + FALL,
        times: [0, RISE / (RISE + HOLD + FALL), (RISE + HOLD) / (RISE + HOLD + FALL), 1],
        ease: ["easeOut", "linear", "easeIn"],
      },
    },
  };

  return (
    <>
      {/* Back swells — a beat behind the front, giving the water depth. */}
      {WAVES.map((w) => (
        <motion.div
          key={w.key}
          className="absolute inset-x-0 bottom-0 will-change-transform"
          style={{ height: `${w.h}vh`, opacity: w.o }}
          initial={{ y: "100%" }}
          animate={{
            y: ["100%", `${w.lift}%`, `${w.lift}%`, "100%"],
            transition: {
              duration: RISE + HOLD + FALL,
              times: w.times,
              ease: ["easeOut", "linear", "easeIn"],
            },
          }}
        >
          <RollingCrest
            curve={CURVES[w.curve]}
            crest={w.crest}
            xFrom={w.xFrom}
            xTo={w.xTo}
            fill={palette.tones[w.tone]}
          />
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              top: `${w.crest - 0.5}vh`,
              background: `linear-gradient(to top, ${palette.deep} 0%, ${palette.deep} 45%, ${palette.tones[w.tone]} 100%)`,
            }}
          />
        </motion.div>
      ))}

      {/* Front swell: the wave that actually covers, and its foam. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[122vh] will-change-transform"
        variants={sweep}
        initial="initial"
        animate="animate"
      >
        <RollingCrest
          curve={CURVES.b}
          crest={17}
          xFrom={-14}
          xTo={-58}
          fill={palette.mid}
          foam={palette.spark}
        />

        {/* Everything below the waterline lives in here. `overflow-hidden` is
            load-bearing: the colour pockets and the grain are painted across
            the layer, and without clipping they show ABOVE the crest, hazing
            the water line that the wave shape exists to draw. It starts a hair
            under the crest box's floor so no hairline of page shows at the
            join. */}
        <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: "16.5vh" }}>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${palette.deep} 0%, ${palette.deep} 34%, ${palette.mid} 100%)`,
            }}
          />

          {/* Pockets of colour suspended in the water, so the body is mottled
              turmeric/chili/cumin rather than one vertical ramp. */}
          {POCKETS.map((p, i) => (
            <div
              key={`pocket-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${p.x}vw`,
                bottom: `${p.up}vh`,
                width: `${p.size}vw`,
                height: `${p.size * 0.72}vw`,
                transform: "translate(-50%, 50%)",
                opacity: p.o,
                background: `radial-gradient(ellipse at center, ${palette.tones[p.t]} 0%, ${palette.tones[p.t]}b3 40%, ${palette.tones[p.t]}00 72%)`,
              }}
            />
          ))}

          {/* Light pooling just under the surface. Centred well inside its box
              and fully faded before the edges: anchored `at 50% 100%` it put
              peak brightness exactly on the boundary, cutting a hard line. */}
          <div
            className="absolute inset-x-0 top-0 h-[46vh]"
            style={{
              background: `radial-gradient(ellipse 65% 55% at 50% 40%, ${palette.lift}3d 0%, ${palette.lift}16 45%, ${palette.lift}00 72%)`,
            }}
          />

          {/* Tooth, so the water has grain instead of reading as a gradient.
              Faded in over the first few vh: starting it flush with the top of
              this container put a tonal step right along the waterline, which
              undid the curve the crest above is drawing. */}
          <div
            className="absolute inset-0 opacity-[0.24] pointer-events-none"
            style={{
              backgroundImage: NOISE,
              maskImage: "linear-gradient(to bottom, transparent 0%, black 9%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 9%)",
            }}
          />
        </div>
      </motion.div>

      {/* Grains thrown ahead of the cloud. */}
      {GRAINS.map((g, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 rounded-full will-change-transform"
          style={{
            left: `${g.x}vw`,
            width: `${g.size}px`,
            height: `${g.size}px`,
            background: palette.spark,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, `-${g.rise}vh`, `-${g.rise + 6}vh`, 0],
            x: [0, `${g.drift}vw`, `${g.drift * 1.4}vw`, 0],
            opacity: [0, 0.9, 0.5, 0],
            transition: {
              duration: RISE + HOLD + FALL,
              times: [0, 0.45, 0.62, 1],
              delay: g.delay,
              ease: "easeOut",
            },
          }}
        />
      ))}
    </>
  );
};

const SectionTransition = () => {
  // All the sequencing — when to play, and when to actually swap the route —
  // belongs to the gate in @/lib/waveNav. This component only draws.
  const { run } = useWaveNav();

  return (
    <AnimatePresence>
      {run && (
        <motion.div
          key={run.id}
          className="fixed inset-0 z-[200] overflow-hidden pointer-events-none"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          aria-hidden
          data-testid="section-transition"
        >
          <Curtain palette={PALETTES[run.category]} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionTransition;
