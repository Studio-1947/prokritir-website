import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";

/**
 * Gated navigation for the section wave.
 *
 * React Router navigates the instant a <Link> is clicked, which meant the new
 * section mounted underneath and the wave washed over a page you had already
 * arrived at. Here the click only *starts* the wave; the route change is held
 * until the crest has the screen covered, so the swap happens unseen and the
 * page you are leaving stays put until then.
 *
 * The cost is a deliberate ~0.75s between click and route change. That is the
 * point of the effect, but it means every entry point has to go through `go()`
 * — a bare <Link> would jump straight there and skip the wave entirely.
 */

export const RISE = 0.75; // s, wave climbs and covers
export const HOLD = 0.12; // s, fully covered — the route swap happens in here
export const FALL = 0.55; // s, wave drains back down
export const TOTAL_MS = (RISE + HOLD + FALL) * 1000;

// Water is the only section left, so the wave currently never plays — every
// navigation falls through to the plain navigate + scroll reset. The gate is
// kept wired so adding a second section is just adding it here.
const SECTIONS = ["/"];
export const categoryFor = () => "water";

// `behavior: "instant"` deliberately: `html` sets `scroll-behavior: smooth`, so
// a bare scrollTo(0, 0) glides down six viewports of story instead of cutting.
const jumpToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });

const WaveNavContext = createContext({ run: null, go: () => {} });

export const useWaveNav = () => useContext(WaveNavContext);

export const WaveNavProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduced = useReducedMotion();

  const [run, setRun] = useState(null); // { id, category } while the wave plays
  const busy = useRef(false);
  const counter = useRef(0);
  const timers = useRef([]);
  const lastPath = useRef(location.pathname);

  const go = useCallback(
    (to) => {
      // Ignore clicks while a wave is already running, or the route would swap
      // under a curtain that is on its way out.
      if (busy.current) return;

      const from = location.pathname;
      if (to === from) return;

      const animated =
        !reduced &&
        SECTIONS.includes(from) &&
        SECTIONS.includes(to) &&
        categoryFor(from) !== categoryFor(to);

      if (!animated) {
        navigate(to);
        jumpToTop();
        return;
      }

      busy.current = true;
      counter.current += 1;
      setRun({ id: counter.current, category: categoryFor(to) });

      timers.current.forEach(clearTimeout);
      timers.current = [
        // Covered. Swap the route and reset scroll behind the water.
        setTimeout(() => {
          navigate(to);
          jumpToTop();
        }, RISE * 1000),
        setTimeout(() => {
          setRun(null);
          busy.current = false;
        }, TOTAL_MS + 60),
      ];
    },
    [location.pathname, navigate, reduced]
  );

  // Browser back/forward cannot be held open — the URL has already changed by
  // the time we hear about it — so those navigate plainly and just get their
  // scroll reset.
  useEffect(() => {
    if (lastPath.current === location.pathname) return;
    lastPath.current = location.pathname;
    if (!busy.current) jumpToTop();
  }, [location.pathname]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return <WaveNavContext.Provider value={{ run, go }}>{children}</WaveNavContext.Provider>;
};

/**
 * Drop-in for <Link> that routes through the wave. Renders a real anchor so
 * middle-click, ctrl/cmd-click and "open in new tab" keep working — those are
 * left to the browser and never trigger the transition.
 */
export const WaveLink = ({ to, onClick, children, ...rest }) => {
  const { go } = useWaveNav();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented) return;
    // Let the browser own anything that is not a plain left click.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(to);
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
