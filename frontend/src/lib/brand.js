// Central image constants + brand copy
// Bottle is bundled locally in /public so it works on any deployment (Vercel, Netlify, self-hosted)
// without depending on the Emergent CDN.
export const BOTTLE_IMG = "/bottle.png";

// Two-part bottle used by the scroll scene: the body keeps the tamper ring,
// the cap is a separate layer that lifts off. These are web-sized derivatives
// of bottle-nocap.png / bottle-cap.png (the originals are print-resolution and
// far too large to ship to a browser).
export const BOTTLE_BODY_IMG = "/bottle-nocap-web.png";
export const BOTTLE_CAP_IMG = "/bottle-cap-web.png";

export const IMAGES = {
  village: "https://images.unsplash.com/photo-1773023785875-9ea8c6717559?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzN8MHwxfHNlYXJjaHwyfHxydXJhbCUyMHZpbGxhZ2UlMjBsdXNoJTIwZ3JlZW4lMjBsYW5kc2NhcGV8ZW58MHx8fHwxNzgzNzUzMjU3fDA&ixlib=rb-4.1.0&q=85",
  tubewell: "https://images.unsplash.com/photo-1677907564161-7279d5aac75f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxoYW5kJTIwcHVtcCUyMHdhdGVyJTIwdmlsbGFnZXxlbnwwfHx8fDE3ODM3NTMyNzB8MA&ixlib=rb-4.1.0&q=85",
  purity: "https://images.pexels.com/photos/247770/pexels-photo-247770.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  bengaliYouth: "https://images.unsplash.com/photo-1747374135959-9291ba69215e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx5b3VuZyUyMGluZGlhbiUyMG1hbiUyMGRyaW5raW5nJTIwd2F0ZXJ8ZW58MHx8fHwxNzgzNzUzMjU3fDA&ixlib=rb-4.1.0&q=85",
  nepaliYouth: "https://images.unsplash.com/photo-1774438362744-49d5cd818e4a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwyfHxuZXBhbGklMjB5b3V0aCUyMGRyaW5raW5nJTIwd2F0ZXJ8ZW58MHx8fHwxNzgzNzUzMjcwfDA&ixlib=rb-4.1.0&q=85",
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
