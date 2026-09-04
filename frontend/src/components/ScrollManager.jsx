import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll behaviour across route changes.
 *
 * Without this a click through to /journal/:slug lands you halfway down the
 * new page, because the browser keeps the previous scroll position on a
 * client-side navigation.
 *
 * Two cases:
 *  · a hash (`/#source`, arriving from the journal)  travel to that section
 *  · anything else  start the new page at the top
 *
 * Lenis owns the scroll position when it is running, so `window.scrollTo`
 * alone would be fought by the next animation frame; we go through
 * `window.lenis` when SmoothScroll has published it and fall back to the
 * native call when reduced motion is on and Lenis never started.
 */
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // One frame, so the incoming page has laid out and a hash target can be
    // measured rather than found at y=0.
    const frame = requestAnimationFrame(() => {
      const lenis = window.lenis;
      const target = hash && hash.length > 1 ? document.querySelector(hash) : null;

      if (target) {
        if (lenis) lenis.scrollTo(target, { offset: -96, duration: 1.4 });
        else target.scrollIntoView({ behavior: "smooth" });
        return;
      }

      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
