import React from "react";
import { motion } from "framer-motion";

/**
 * Scroll-reveal wrapper. Sections fade and rise once as they enter the
 * viewport — `once` so nothing re-animates when you scroll back up, which
 * reads as jitter rather than polish.
 */
const Reveal = ({ children, delay = 0, y = 26, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
