import React from "react";
import { motion, useTransform } from "framer-motion";
import { CHAPTERS } from "@/lib/brand";

const ChapterDot = ({ progress, stop, index, id }) => {
  const window = 0.08;
  const opacity = useTransform(progress, [stop - window, stop, stop + window], [0.35, 1, 0.35]);
  const scale = useTransform(progress, [stop - window, stop, stop + window], [1, 1.7, 1]);

  return (
    <a href={`#${id}`} className="group flex items-center gap-3" data-testid={`rail-${id}`}>
      <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 group-hover:text-white/80 transition-colors">
        {String(index).padStart(2, "0")}
      </span>
      <motion.span
        style={{ opacity, scale }}
        className="block h-1.5 w-1.5 rounded-full bg-cyan-200"
      />
    </a>
  );
};

const ChapterRail = ({ progress }) => {
  const stops = [0.05, 0.28, 0.5, 0.65, 0.8, 0.95];
  return (
    <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6" data-testid="chapter-rail">
      {CHAPTERS.map((c, i) => (
        <ChapterDot key={c.id} progress={progress} stop={stops[i]} index={i} id={c.id} />
      ))}
    </div>
  );
};

export default ChapterRail;
