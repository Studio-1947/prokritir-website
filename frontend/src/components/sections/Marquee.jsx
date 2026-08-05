import React from "react";
import { MARQUEE } from "@/lib/brand";

/**
 * Thin scrolling band between the hero and the story. The track holds two
 * identical runs and translates exactly -50%, so the loop is seamless.
 */
const Marquee = () => (
  <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-5 backdrop-blur-xl">
    <div className="marquee-track whitespace-nowrap">
      {[0, 1].map((run) => (
        <div key={run} className="flex shrink-0 items-center">
          {MARQUEE.map((word, i) => (
            <span key={`${run}-${i}`} className="flex items-center">
              <span
                className={`px-8 text-[15px] tracking-[0.2em] uppercase ${
                  /[ঀ-৿]/.test(word)
                    ? "font-bn text-[#63e6a8] !tracking-normal text-[17px] normal-case"
                    : "text-[color:var(--paper-faint)]"
                }`}
              >
                {word}
              </span>
              <span className="h-1 w-1 rotate-45 bg-[#4fd1e3]/60" />
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Marquee;
