import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { BRAND, LOGO_IMG } from "@/lib/brand";
import { useReady } from "@/lib/readyContext";

/**
 * First-load screen, held until the hero's 3D bottle has its assets.
 *
 * There is a real wait to cover: Untitled.glb is 4.35 MB unquantized, and
 * <Environment preset="park"> fetches an HDRI from drei's CDN on top of that.
 * Without this the hero opens on the flat bottle photo and swaps to the model
 * mid-read, which reads as a glitch rather than as loading.
 *
 * Progress comes from drei's useProgress, which reads three's
 * DefaultLoadingManager  so it counts the GLB and the HDRI and nothing else.
 * The hook works outside <Canvas>; the store is global.
 *
 * Three guards, because a loading screen that can trap someone is worse than
 * no loading screen at all:
 *  · SETTLE  progress touches 100 between the GLB finishing and the HDRI
 *    starting, so a spell at 100 has to hold before it counts as done.
 *  · NO_ASSETS  nothing has started loading by then, so this route has no 3D
 *    on it (/journal) and there is nothing to wait for.
 *  · FAILSAFE  a hard ceiling. If the CDN is down or the GLB 404s, the site
 *    still opens.
 */

const MIN_MS = 700; // don't flash on a warm cache
const SETTLE_MS = 400;
const NO_ASSETS_MS = 1500;
const FAILSAFE_MS = 12000;

// Once per page load, not once per route change: coming back to the landing
// page from the journal must not replay it.
let alreadyPlayed = false;

// Routes that mount the hero, and so have a bottle worth waiting for. The
// catch-all route renders Landing too, hence a denylist rather than `=== "/"`.
const hasBottle = (pathname) =>
  !pathname.startsWith("/journal") && !pathname.startsWith("/success");

// Rough stages, so the wait reads as the process rather than as a spinner.
const stageFor = (p) => {
  if (p < 30) return "Drawing from the aquifer";
  if (p < 65) return "Seven stages of purification";
  if (p < 95) return "Sealing the bottle";
  return "Ready to pour";
};

const Preloader = () => {
  const { pathname } = useLocation();
  const { active, progress } = useProgress();
  const { markReady } = useReady();

  const [done, setDone] = useState(() => alreadyPlayed || !hasBottle(pathname));
  const startedAt = useRef(Date.now());
  const sawLoading = useRef(false);
  const minTimer = useRef(null);

  const finish = useCallback(() => {
    alreadyPlayed = true;
    setDone(true);
    markReady();
  }, [markReady]);

  // Routes with no bottle start ready: `done` was already true at mount, so
  // `finish` never runs and the hero signal has to be sent here instead.
  useEffect(() => {
    if (done) markReady();
    // Only on mount  later `done` transitions go through finish().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respect MIN_MS however we got here, so a cached load still resolves as a
  // deliberate reveal instead of a flicker.
  const finishSoon = useCallback(() => {
    const elapsed = Date.now() - startedAt.current;
    if (elapsed >= MIN_MS) {
      finish();
      return;
    }
    if (minTimer.current) return; // already counting down
    minTimer.current = setTimeout(finish, MIN_MS - elapsed);
  }, [finish]);

  useEffect(() => () => clearTimeout(minTimer.current), []);

  useEffect(() => {
    if (active || progress > 0) sawLoading.current = true;
  }, [active, progress]);

  // Done: loading started, then stopped, and stayed stopped.
  useEffect(() => {
    if (done) return;
    if (!sawLoading.current || active || progress < 100) return;
    const t = setTimeout(finishSoon, SETTLE_MS);
    return () => clearTimeout(t);
  }, [done, active, progress, finishSoon]);

  // Nothing ever started loading  no 3D on this route.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      if (!sawLoading.current) finishSoon();
    }, NO_ASSETS_MS);
    return () => clearTimeout(t);
  }, [done, finishSoon]);

  // Hard ceiling.
  useEffect(() => {
    if (done) return;
    const t = setTimeout(finish, FAILSAFE_MS);
    return () => clearTimeout(t);
  }, [done, finish]);

  // Hold the page still underneath. Lenis is published by SmoothScroll's own
  // effect, which runs after this one (parent effects run after children), so
  // the stop() waits a frame; the overflow lock covers the gap and the
  // reduced-motion case where Lenis never starts at all.
  useEffect(() => {
    if (done) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => window.lenis?.stop());

    return () => {
      cancelAnimationFrame(frame);
      html.style.overflow = prev;
      window.lenis?.start();
    };
  }, [done]);

  const pct = Math.min(100, Math.round(progress));

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--ink-900)] px-6"
          data-testid="preloader"
        >
          <div className="aurora absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 opacity-60" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[340px] text-center"
          >
            <img
              src={LOGO_IMG}
              alt=""
              aria-hidden
              draggable={false}
              className="float-slow mx-auto h-12 w-auto select-none object-contain"
            />

            <div className="font-display mt-6 text-[26px] tracking-tight">{BRAND.name}</div>
            <div className="font-bn mt-2 text-[13px] text-[color:var(--paper-faint)]">
              {BRAND.bengali}
            </div>

            {/* The fill is the only moving part, and it fills like a level
                rising rather than sliding in  it is a water brand. */}
            <div className="mt-10 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--accent-grad)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="mt-5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--paper-faint)]">
              <span data-testid="preloader-stage">{stageFor(pct)}</span>
              <span className="font-mono text-[#4fd1e3]" data-testid="preloader-pct">
                {pct}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
