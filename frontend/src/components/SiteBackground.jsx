import React from "react";

/**
 * Site-wide background.
 *
 * Lightweight, zero-runtime-cost static ambient backdrop using pure CSS gradients.
 * Replaced the heavy full-viewport WebGL fluid simulation for instant rendering
 * and smooth performance across all devices.
 */
const SiteBackground = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
      data-testid="site-background"
    >
      {/* Subtle, soft ambient atmospheric blooms */}
      <div className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,209,227,0.12),rgba(79,209,227,0.02)_50%,transparent_75%)] blur-[60px]" />
      <div className="absolute top-1/3 -right-32 h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,230,168,0.09),rgba(99,230,168,0.01)_50%,transparent_75%)] blur-[70px]" />
      <div className="absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(18,80,107,0.18),rgba(18,80,107,0.03)_50%,transparent_75%)] blur-[80px]" />
    </div>
  );
};

export default SiteBackground;

