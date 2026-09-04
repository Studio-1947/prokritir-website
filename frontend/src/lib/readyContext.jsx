import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

/**
 * "The preloader has lifted."
 *
 * Without this the hero's staged entrance plays while the loading screen is
 * still covering it, and the curtain rises on a hero that has already
 * finished animating  the reveal is spent on nobody.
 *
 * Defaults to ready: true, so anything rendered outside the provider (a test,
 * a component used on its own) animates immediately rather than sitting
 * invisible waiting for a signal that never comes.
 */
const ReadyContext = createContext({ ready: true, markReady: () => {} });

export const ReadyProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, markReady }), [ready, markReady]);
  return <ReadyContext.Provider value={value}>{children}</ReadyContext.Provider>;
};

export const useReady = () => useContext(ReadyContext);
