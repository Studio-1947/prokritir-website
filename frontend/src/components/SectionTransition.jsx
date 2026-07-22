import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

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

// The rise needs real time. At 0.55s the easeOut front-loads so much travel
// that the crown was at the top of the screen within 120ms and the whole thing
// read as an instant flash rather than something thrown.
const RISE = 0.75; // s, powder climbs and covers
const HOLD = 0.12; // s, fully covered — the moment the swap reads as deliberate
const FALL = 0.55; // s, powder retreats back down
const TOTAL_MS = (RISE + HOLD + FALL) * 1000;

// Per-destination palette. `deep` is the settled powder at the base of the
// curtain, `mid` the body of the cloud, `lift` the lit edge at its crown.
// Kept close to each section's own page background and deliberately desaturated
// — powder is dust, not paint. An earlier pass used full-strength amber and the
// curtain read as a flat orange wipe rather than something airborne.
// `tones` is what stops the curtain reading as one flat colour: real masala is
// turmeric, chili and cumin thrown together, not a single brown. They are used
// for the crown puffs and for the pockets of colour suspended in the body, so
// the powder varies in hue across its width as well as up its height.
const PALETTES = {
  masala: {
    deep: "#140b05",
    mid: "#6b3208",
    lift: "#b9700f",
    spark: "#f0cd93",
    tones: ["#b4470a", "#d29b0c", "#8f2708", "#7d4a09", "#c26a0d", "#5c1f06"],
  },
  chai: {
    deep: "#07130c",
    mid: "#0b4430",
    lift: "#17805c",
    spark: "#9fe3c4",
    tones: ["#12684a", "#3f6d16", "#0a5340", "#1f7a4c", "#2d6b23", "#083a2a"],
  },
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

const categoryFor = (pathname) => {
  if (pathname === "/masala") return "masala";
  if (pathname === "/chai") return "chai";
  return "water";
};

// Puffs along the crown of the curtain, so its top edge billows instead of
// reading as a straight rectangle. x/size are in vw, y nudges each puff off
// the crown line. Fixed values, not random — the curtain should look the same
// every time it plays.
// Sizes stay modest on purpose. An earlier pass used up to 84vw — over 1000px
// across on a laptop — and since each puff is centred on the crown it reached
// half its width ABOVE the cloud, blanketing the whole viewport before the body
// had left the bottom of the screen. The curtain looked instant. These add
// lumpiness to the silhouette; the body does the covering.
// `t` indexes the palette's tones, so neighbouring puffs differ in hue and the
// crown mottles instead of reading as one colour.
const PUFFS = [
  { x: 4, size: 26, y: 1, o: 0.9, t: 2 },
  { x: 16, size: 34, y: -3, o: 1, t: 0 },
  { x: 29, size: 22, y: 2, o: 0.8, t: 4 },
  { x: 41, size: 38, y: -4, o: 1, t: 1 },
  { x: 54, size: 24, y: 2, o: 0.85, t: 3 },
  { x: 66, size: 32, y: -3, o: 1, t: 0 },
  { x: 78, size: 22, y: 2, o: 0.8, t: 5 },
  { x: 90, size: 30, y: -2, o: 0.95, t: 1 },
  { x: 99, size: 24, y: 1, o: 0.85, t: 2 },
  // Sparser, higher spray so the crown is not an even row of domes.
  { x: 22, size: 12, y: -8, o: 0.5, t: 1 },
  { x: 48, size: 10, y: -10, o: 0.45, t: 4 },
  { x: 72, size: 13, y: -9, o: 0.5, t: 0 },
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
      {/* Trailing layer — a beat behind the front, giving the cloud depth. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[130vh] will-change-transform"
        initial={{ y: "100%" }}
        animate={{
          y: ["100%", "-4%", "-4%", "100%"],
          transition: {
            duration: RISE + HOLD + FALL,
            times: [0, 0.5, 0.62, 1],
            ease: ["easeOut", "linear", "easeIn"],
          },
        }}
        style={{
          // Long, soft fade and low opacity. With a tight fade this layer's
          // top edge cut a hard horizontal line across the curtain, since it is
          // darker than the front layer's crown and lags behind it.
          background: `linear-gradient(to top, ${palette.deep} 0%, ${palette.deep} 46%, ${palette.mid} 82%, ${palette.mid}00 100%)`,
          opacity: 0.55,
        }}
      />

      {/* Front layer: the body of the powder, plus its billowing crown. */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[125vh] will-change-transform"
        variants={sweep}
        initial="initial"
        animate="animate"
      >
        {/* Body: opaque almost to the crown, with the fade confined to the top
            sliver. A long fade made the whole curtain a translucent haze that
            washed over the screen the instant it started moving, with no edge
            you could read as a position. */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${palette.deep} 0%, ${palette.deep} 34%, ${palette.mid} 90%, ${palette.mid}00 100%)`,
          }}
        />

        {/* Pockets of colour suspended in the body, so the wall is mottled
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

        {/* Crown puffs, centred on the body's fade so they billow past it. */}
        {PUFFS.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              width: `${p.size}vw`,
              height: `${p.size}vw`,
              transform: "translate(-50%, -50%)",
              opacity: p.o,
              background: `radial-gradient(circle at center, ${palette.tones[p.t]} 0%, ${palette.tones[p.t]}d9 34%, ${palette.tones[p.t]}00 70%)`,
            }}
          />
        ))}

        {/* Warmth high in the cloud, where light would pool. The gradient is
            centred well inside its box and fully faded before the box's edges:
            anchoring it `at 50% 100%` put peak brightness exactly on the
            bottom boundary, which cut a hard line clean across the screen. */}
        <div
          className="absolute inset-x-0 top-[4vh] h-[52vh]"
          style={{
            background: `radial-gradient(ellipse 65% 55% at 50% 45%, ${palette.lift}38 0%, ${palette.lift}14 45%, ${palette.lift}00 72%)`,
          }}
        />

        {/* Tooth, so the powder has grain instead of reading as a gradient.
            Masked to fade out with the body: an unmasked full-height rectangle
            of noise ends in a dead-straight line across the screen, which was
            the seam visible partway up the curtain. */}
        <div
          className="absolute inset-0 opacity-[0.28] pointer-events-none"
          style={{
            backgroundImage: NOISE,
            maskImage: "linear-gradient(to top, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 88%, transparent 100%)",
          }}
        />
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
  const { pathname } = useLocation();
  const reduced = useReducedMotion();

  const [run, setRun] = useState(null); // { id, category } while playing
  const prevPath = useRef(pathname);
  const counter = useRef(0);
  const timers = useRef([]);

  useEffect(() => {
    const from = prevPath.current;
    prevPath.current = pathname;
    if (from === pathname) return; // first paint, or a no-op navigation

    // `behavior: "instant"` deliberately: `html` sets `scroll-behavior: smooth`,
    // so a bare scrollTo(0, 0) would glide down six viewports of story instead
    // of cutting. Nothing else resets scroll on navigation, so without this you
    // arrive on Spices at whatever offset you left the water story at.
    const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Only between the three brand sections. The order-success route is a
    // destination rather than a section, and a curtain there reads as an error.
    const sections = ["/", "/water", "/masala", "/chai"];
    const play =
      !reduced &&
      sections.includes(from) &&
      sections.includes(pathname) &&
      // "/" and "/water" are the same section, so that pairing is not a move.
      categoryFor(from) !== categoryFor(pathname);

    if (!play) {
      jumpToTop();
      return;
    }

    counter.current += 1;
    setRun({ id: counter.current, category: categoryFor(pathname) });

    timers.current.forEach(clearTimeout);
    timers.current = [
      // Reset scroll at the covered moment, so the jump happens behind powder.
      setTimeout(jumpToTop, RISE * 1000),
      setTimeout(() => setRun(null), TOTAL_MS + 60),
    ];
  }, [pathname, reduced]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

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
