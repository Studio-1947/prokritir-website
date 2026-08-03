// Central image constants + brand copy
// Bottle is bundled locally in /public so it works on any deployment (Vercel, Netlify, self-hosted)
// without depending on the Emergent CDN.
export const BOTTLE_IMG = "/bottle.png";

// Brand mark — white leaf artwork on transparency, so it only reads on a dark
// or tinted surface.
export const LOGO_IMG = "/logo.png";

// Two-part bottle used by the scroll scene: the body keeps the tamper ring,
// the cap is a separate layer that lifts off. These are web-sized derivatives
// of bottle-nocap.png / bottle-cap.png (the originals are print-resolution and
// far too large to ship to a browser).
// WebP re-encodes of prokritir-jol-bottle-web.png / bottle-cap-trim.png, at the
// same pixel dimensions and with the alpha channel bit-for-bit identical — the
// PNGs were 1.8 MB between them for artwork that renders ~250 CSS px wide.
// The .png originals are kept in /public as the editable masters.
//
// bottle-cap-trim.png is itself Object-web.png cropped to the cap's actual
// pixels: the source had ~21 rows of dead space under the skirt plus a sliver
// of opaque crop junk in the bottom-left corner, both of which threw off the
// alignment maths in BottleScene (which anchors the cap off the image box, not
// the art).
export const BOTTLE_BODY_IMG = "/bottle-body.webp";
export const BOTTLE_CAP_IMG = "/bottle-cap.webp";

// Story backgrounds. These render full-bleed behind the bottle and three of the
// four carry a parallax transform, so they must be size-capped: without a `w=`
// Unsplash serves the original (frequently 4000–6000px), and the compositor
// then rescales that texture on every frame of the scroll. 1600px covers a
// 2× retina laptop; `q=75` is indistinguishable at full-bleed scale under the
// gradient scrims these sit behind.
const UNSPLASH_BG = "&w=1600&q=75&auto=format";

export const IMAGES = {
  village: "https://images.unsplash.com/photo-1773023785875-9ea8c6717559?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxydXJhbCUyMHZpbGxhZ2UlMjBsdXNoJTIwZ3JlZW4lMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzgzNzUzMjU3fDA&ixlib=rb-4.1.0" + UNSPLASH_BG,
  tubewell: "https://images.unsplash.com/photo-1677907564161-7279d5aac75f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxoYW5kJTIwcHVtcCUyMHdhdGVyJTIwdmlsbGFnZXxlbnwwfHx8fDE3ODM3NTMyNzB8MA&ixlib=rb-4.1.0&w=480&q=75&auto=format",
  purity: "https://images.pexels.com/photos/247770/pexels-photo-247770.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bengaliYouth: "https://images.unsplash.com/photo-1747374135959-9291ba69215e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx5b3VuZyUyMGluZGlhbiUyMG1hbiUyMGRyaW5raW5nJTIwd2F0ZXJ8ZW58MHx8fHwxNzgzNzUzMjU3fDA&ixlib=rb-4.1.0&w=1200&q=75&auto=format",
  nepaliYouth: "https://images.unsplash.com/photo-1774438362744-49d5cd818e4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwyfHxuZXBhbGklMjB5b3V0aCUyMGRyaW5raW5nJTIwd2F0ZXJ8ZW58MHx8fHwxNzgzNzUzMjcwfDA&ixlib=rb-4.1.0&w=1200&q=75&auto=format",
};

export const BRAND = {
  name: "Prokritir Jol",
  bengali: "প্রকৃতির জল",
  tagline: "Nature's Water — bottled with reverence.",
  size: "500 ml",
};

export const CHAPTERS = [
  { id: "hero",     label: "Prologue",   title: "The Source" },
  { id: "source",   label: "Chapter 01", title: "From the Deep Earth" },
  { id: "purity",   label: "Chapter 02", title: "Seven Layers of Purity" },
  { id: "reveal",   label: "Chapter 03", title: "The Seal Breaks" },
  { id: "people",   label: "Chapter 04", title: "For Every Thirst" },
  { id: "mission",  label: "Epilogue",   title: "Our Promise" },
];
