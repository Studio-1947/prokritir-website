import React, { useEffect, useState } from "react";
import Ferrofluid from "@/components/Ferrofluid";

/**
 * Site-wide animated background.
 *
 * A single fixed, full-viewport Ferrofluid layer sitting between the ink base
 * (.App's background) and the page content. The shader writes glowing rim
 * lines over transparency, so on the dark base it reads as liquid contours
 * drifting behind the glass panels rather than a picture behind a window.
 *
 * Two deliberate choices:
 *  · The colour array is a module constant, not an inline literal. Ferrofluid
 *    lists `colors` in its effect dependencies, so a fresh array each render
 *    would tear down and rebuild the whole WebGL context every time React
 *    re-rendered this component.
 *  · `mouseInteraction` is off. The layer is pointer-events:none so clicks
 *    reach the page, which means the canvas never receives pointermove — and
 *    the shader would then park its magnetic spike permanently at iMouse's
 *    initial [0,0], glowing in the bottom-left corner forever.
 */

// Deep water → aqua → mint, tracking the site's accent ramp.
const FLUID_COLORS = ["#12506b", "#4fd1e3", "#63e6a8"];

/**
 * ⚠️ THE ONE PERFORMANCE KNOB ON THIS PAGE.
 *
 * The glass panels are React Bits' <GlassSurface />, which refracts its
 * backdrop through a 9-node SVG filter applied as `backdrop-filter`. That
 * filter has to re-run on every frame in which the backdrop changes — so an
 * animating fluid behind ~28 of them is the expensive combination. Measured
 * on this page at 1440×900:
 *
 *   true  — fluid drifts, glass refracts   ~20–35 fps
 *   false — fluid still, glass refracts    ~100 fps
 *
 * Neither piece is slow alone; it is only the pair. Set to false to keep the
 * liquid-glass refraction and trade the drift for a still (still gorgeous)
 * fluid backdrop.
 */
const ANIMATE_BACKGROUND = true;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SiteBackground = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  // Freezing the fluid alone is not enough — the aurora blooms behind the
  // panels animate too, and any moving backdrop re-triggers every
  // GlassSurface filter. See the .bg-static rules in index.css.
  useEffect(() => {
    const root = document.documentElement;
    const still = reduced || !ANIMATE_BACKGROUND;
    root.classList.toggle("bg-static", still);
    return () => root.classList.remove("bg-static");
  }, [reduced]);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      data-testid="site-background"
    >
      {/* Blurred back a touch so the fluid reads as depth rather than a
          graphic. Oversized past the viewport on every side: a blur samples
          transparency from beyond the element's box, so at exact viewport
          size the edges would fade out and leave a soft vignette. */}
      <div className="absolute -inset-[90px] blur-[6px]">
        <Ferrofluid
          colors={FLUID_COLORS}
          speed={0.3}
          scale={1.55}
          turbulence={0.9}
          fluidity={0.12}
          rimWidth={0.22}
          sharpness={2.6}
          shimmer={1.1}
          glow={2.1}
          flowDirection="down"
          opacity={0.7}
          mouseInteraction={false}
          paused={reduced || !ANIMATE_BACKGROUND}
          // The fluid drifts slowly enough that 30 redraws a second is
          // indistinguishable from 100 — but each redraw invalidates the
          // backdrop of every glass panel on screen, so the ones we skip are
          // the expensive part.
          fps={30}
          // Capped at 1: this runs full-viewport for the life of the page, and
          // it is blurred on the way out — sampling at retina density would be
          // detail thrown straight into the blur.
          dpr={Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 1)}
        />
      </div>
    </div>
  );
};

export default SiteBackground;
