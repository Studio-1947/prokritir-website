import React from "react";
import GlassSurface from "@/components/GlassSurface";

/**
 * Site adapter for React Bits' <GlassSurface />.
 *
 * GlassSurface is built for discrete fixed-size surfaces: it takes explicit
 * width/height, flex-centres its children and pads them. Our panels are
 * content-sized cards that own their own internal layout, so this wrapper:
 *
 *  · sizes to content  width 100%, height auto (a numeric height would be
 *    written inline and beat any stylesheet)
 *  · reverts the content wrapper to normal flow via `.glass-panel`
 *    (see index.css), so left-aligned copy stays left-aligned
 *  · exposes `overflowVisible` for the few cards with something deliberately
 *    poking outside the box  the "Most ordered" badge, the floating bottle
 *    on the receipt  which GlassSurface's `overflow: hidden` would clip
 *
 * Everything else is passed straight through to the component.
 */
const GlassPanel = ({
  children,
  className = "",
  radius = 28,
  overflowVisible = false,
  // Fill the parent's height instead of sizing to content. Needed for any
  // panel in a grid row: GlassSurface writes its height as an *inline* style,
  // which beats an `h-full` class, so cards would otherwise each stop at
  // their own text length and leave a ragged row.
  fill = false,
  as: Tag = "div",
  ...rest
}) => (
  <GlassSurface
    width="100%"
    height={fill ? "100%" : "auto"}
    borderRadius={radius}
    // Single displacement pass instead of three. The RGB fringing at the panel
    // edge is barely legible at these sizes and costs 3× the filter work on
    // every frame the backdrop moves  which, with a live background behind
    // ~27 panels, is every frame.
    chromatic={false}
    className={`glass-panel ${fill ? "glass-panel--fill" : ""} ${overflowVisible ? "glass-panel--overflow" : ""
      } ${className}`}
    {...rest}
  >
    {children}
  </GlassSurface>
);

export default GlassPanel;
