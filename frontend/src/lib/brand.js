/**
 * Brand content + imagery for the Prokritir Jol single-pager.
 *
 * All page copy lives here so the section components stay presentational and
 * the marketing text can be edited in one place.
 *
 * ⚠️ PLACEHOLDER DATA  replace before launch:
 *    · IMPACT.counters    illustrative figures, not audited numbers
 *    · VOICES             written sample quotes, not real customers
 */

// Local product art (in /public)
export const BOTTLE_IMG = "/bottle.png";
export const LOGO_IMG = "/logo.png";
// Shrink-wrapped multipacks, shot on transparency.
export const PACK_500_IMG = "/500mlpacks.webp";
export const PACK_1L_IMG = "/1Lpacks.webp";
// The 20 L jar is drawn rather than shot  vector, so it stays sharp at any
// card size and needs no photography to exist yet.
export const JAR_20L_IMG = "/20l-jar.svg";

export const getProductImage = (p) => {
  if (p?.image) return p.image;
  const sku = typeof p === "string" ? p : p?.sku;
  if (!sku) return BOTTLE_IMG;
  if (sku === "PJ-20L-1") return JAR_20L_IMG;
  if (sku === "PJ-500-12" || sku === "PJ-500-24") return PACK_500_IMG;
  if (sku === "PJ-1L-12" || sku === "PJ-1L-24") return PACK_1L_IMG;
  if (sku.startsWith("PJ-500") && (sku.includes("12") || sku.includes("24"))) return PACK_500_IMG;
  if (sku.startsWith("PJ-1L") && (sku.includes("12") || sku.includes("24"))) return PACK_1L_IMG;
  return BOTTLE_IMG;
};

// Unsplash / Pexels delivery. Width-capped and auto-formatted: without `w=`
// Unsplash serves the 4000–6000px original, which is pure waste behind a scrim.
const un = (id, w = 1800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

// Section backdrops are now the animated Ferrofluid layer (see
// components/SiteBackground.jsx), so only *framed* photography remains 
// pictures inside a card, not washes behind a section.
export const IMAGES = {
  // Long-exposure forest stream over pale rocks. The Source.
  stream: un("1437482078695-73f5ca6c96e2", 1800),
  // Village hand pump  the small floating card on The Source.
  tubewell: un("1677907564161-7279d5aac75f", 900),
  // Lush rural Bengal. Bento tile.
  village: un("1773023785875-9ea8c6717559", 1400),
  // Macro water droplet. Bento tile.
  droplet:
    "https://images.pexels.com/photos/247770/pexels-photo-247770.jpeg?auto=compress&cs=tinysrgb&w=1400",
  // Golden field at sunset  inside the Our Promise counter panel.
  field: un("1500382017468-9049fed747ef", 1600),
};

export const BRAND = {
  name: "Prokritir Jol",
  bengali: "প্রকৃতির জল",
  tagline: "Nature's water, drawn from the deep earth of Bengal.",
  origin: "Nadia, West Bengal",
  email: "hello@prokritirjol.in",
  phone: "+91 98300 98300",
  fssai: "12824999000123",
};

// A link is either a section on the landing page (`href`) or a route (`to`).
// SectionLink resolves the difference; the nav's scroll-spy only watches the
// `href` entries, since a route has no section to be inside of.
export const NAV_LINKS = [
  { label: "The Source", href: "#source" },
  { label: "Purity", href: "#purity" },
  { label: "Bottles", href: "#bottles" },
  { label: "Our Promise", href: "#promise" },
  { label: "Journal", to: "/journal" },
];

export const HERO = {
  eyebrow: "Nadia, West Bengal",
  titleLead: "Two hundred feet",
  titleAccent: "of silence.",
  body:
    "Beneath the paddy fields of Nadia sits an aquifer older than the villages above it. We draw from it slowly, carry it through seven stages of purification, and seal it before it ever meets the air.",
  stats: [
    { value: "220", unit: "ft", label: "Aquifer depth" },
    { value: "7", unit: "stage", label: "Purification" },
    { value: "7.2", unit: "pH", label: "Naturally balanced" },
    { value: "1:1", unit: "", label: "Litres given back" },
  ],
};

export const MARQUEE = [
  "প্রকৃতির জল",
  "Nature's Water",
  "RO Purified",
  "500 ml · 1 Litre",
  "Nadia, West Bengal",
  "One bottle, one litre given back",
  "নির্মলতা",
];

export const SOURCE = {
  eyebrow: "The Source",
  title: "An aquifer older",
  titleAccent: "than the village above it.",
  paragraphs: [
    "Two hundred and twenty feet below the delta soil, past layers of clay laid down before any of this was farmland, there is water that has not seen daylight in a very long time. It arrives already clean. Our job is mostly not to ruin it.",
    "We draw through a single deep tubewell, metered so the aquifer refills faster than we take. Nothing is trucked in, nothing is blended. The bottle you open was drawn, purified, and sealed within a few hundred metres of the well itself.",
  ],
  facts: [
    { k: "Single well", v: "One source, never blended" },
    { k: "0 km", v: "Bottled where it is drawn" },
    { k: "Metered draw", v: "Below natural recharge rate" },
  ],
};

export const STAGES = [
  { n: "01", name: "Sediment", bn: "", body: "A graded bed catches sand, silt and grit before anything finer is asked to work." },
  { n: "02", name: "Activated Carbon", bn: "", body: "Chlorine, organic compounds and any trace of odour bind to the carbon block and stay there." },
  { n: "03", name: "Reverse Osmosis", bn: "", body: "A 0.0001-micron membrane passes water molecules and turns almost everything else away." },
  { n: "04", name: "Ultraviolet", bn: "", body: "Every drop crosses 254 nm light. Nothing living continues past this point." },
  { n: "05", name: "Ozone", bn: "", body: "An oxidative polish that keeps the sealed bottle sterile until you break the ring yourself." },
  { n: "06", name: "Mineral Balance", bn: "", body: "Calcium and magnesium metered back to 7.2 pH  purity should still taste like water." },
  { n: "07", name: "Nirmalata", bn: "নির্মলতা", body: "The last stage runs on no machine at all. Every batch is tasted in Nadia before it leaves." },
];

export const BOTTLES = {
  eyebrow: "Bottles",
  title: "Choose your",
  titleAccent: "pour.",
  body: "Ordered on WhatsApp  we confirm, take payment and share tracking in one chat. Free shipping over ₹300. Every order funds a litre of clean water for a family in rural Bengal.",
  tiers: [
    {
      sku: "PJ-500-1",
      name: "Single",
      size: "500 ml",
      price: 20,
      note: "One bottle",
      image: BOTTLE_IMG,
      // Tall subject in a frame sized for square pack shots: scale to the
      // height and let the width fall where it may, and narrow the contact
      // shadow to the object actually standing there.
      portrait: true,
      perks: ["500 ml bottle", "Tamper-evident seal", "Ideal for a first taste"],
      featured: false,
    },
    {
      sku: "PJ-500-12",
      name: "Twelve Pack",
      size: "500 ml × 12",
      price: 200,
      note: "Most ordered",
      image: PACK_500_IMG,
      perks: ["12 × 500 ml", "Free delivery", "Saves ₹40 against singles"],
      featured: true,
    },
    {
      sku: "PJ-1L-12",
      name: "Litre Case",
      size: "1 L × 12",
      price: 400,
      note: "For the household",
      image: PACK_1L_IMG,
      perks: ["12 × 1 litre", "Free delivery", "Best value per litre"],
      featured: false,
    },
    {
      sku: "PJ-20L-1",
      name: "Twenty Litre",
      size: "20 L jar",
      price: 120,
      note: "Home & office",
      image: JAR_20L_IMG,
      portrait: true,
      // Deliberately no "free delivery" claim: at ₹120 a single jar sits below
      // the ₹300 free-shipping threshold the backend enforces, and a perk the
      // checkout then contradicts is worse than one fewer perk.
      perks: ["20 litres, one sealed jar", "Empty jar collected on delivery", "₹6 a litre  our lowest"],
      featured: false,
    },
  ],
};

export const IMPACT = {
  eyebrow: "Our Promise",
  title: "One bottle.",
  titleAccent: "One litre, given back.",
  body:
    "Every bottle of Prokritir Jol funds one litre of clean drinking water for a family in rural Bengal  routed through tubewell repair, filtration for village schools, and safe storage during the monsoon. We are only borrowing the water. The interest is paid in kind.",
  // ⚠️ Illustrative figures  swap for audited numbers before launch.
  counters: [
    { value: "1,20,000", label: "Litres returned to villages" },
    { value: "14", label: "Villages reached in Nadia" },
    { value: "6", label: "Tubewells repaired & maintained" },
  ],
  quote: "বিশুদ্ধতাই আমাদের মাতৃভাষা।",
  quoteRoman: "Purity is our mother tongue.",
};

// ⚠️ Sample copy written to show the layout  replace with real, consented
// customer quotes before this page goes live.
export const VOICES = [
  {
    quote: "It tastes like nothing, which is the whole point. Most bottled water has a flat, plastic edge to it. This does not.",
    name: "A. Chatterjee",
    role: "Kolkata",
    initials: "AC",
  },
  {
    quote: "We switched the whole tiffin room over. The twelve-packs arrive on time and the delivery team actually calls ahead.",
    name: "S. Mondal",
    role: "Office manager, Krishnanagar",
    initials: "SM",
  },
  {
    quote: "I like that it comes from an hour away rather than a plant in another state. The bottles go back for recycling on the same route.",
    name: "R. Biswas",
    role: "Shantipur",
    initials: "RB",
  },
];

export const FAQ = [
  {
    q: "Where exactly does the water come from?",
    a: "A single deep tubewell in Nadia district, West Bengal, drawing from a confined aquifer at roughly 220 feet. It is bottled at the same site  we never truck in water from elsewhere or blend sources.",
  },
  {
    q: "If it is reverse-osmosis purified, is it stripped of minerals?",
    a: "RO does remove nearly everything, so stage six meters calcium and magnesium back in and brings the water to about 7.2 pH. That is why it tastes like water rather than tasting like nothing at all.",
  },
  {
    q: "How does ordering work?",
    a: "Pick your bottles here and the site opens WhatsApp with the order already written out  items, total and delivery address. We confirm stock in that chat, send you the payment options, and post dispatch and tracking to the same thread. One conversation from order to doorstep, and nothing is charged on this website.",
  },
  {
    q: "How do I pay?",
    a: "In the WhatsApp chat, after we confirm your order: UPI, a secure card link, or cash on delivery  whichever you prefer. We never ask for card details on this site or over the phone.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "Across West Bengal, with cash on delivery available everywhere we ship. Orders over ₹300 ship free; below that a flat ₹40 applies. We message before dispatch.",
  },
  {
    q: "What does 'one bottle, one litre' actually fund?",
    a: "Tubewell repair, filtration units for village schools, and safe monsoon storage in the villages nearest our own source. We report the running total on this page and update it each quarter.",
  },
  {
    q: "Are the bottles recyclable?",
    a: "The bottle and cap are both food-grade PET and fully recyclable. Our delivery routes collect empties on the return leg wherever a household asks us to.",
  },
];

export const FOOTER_LINKS = [
  {
    title: "Explore",
    links: [
      { label: "The Source", href: "#source" },
      { label: "Seven Stages", href: "#purity" },
      { label: "Bottles", href: "#bottles" },
      { label: "Our Promise", href: "#promise" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#source" },
      { label: "Sustainability", href: "#promise" },
      { label: "Distributors", href: "#bottles" },
      { label: "Careers", href: "#promise" },
    ],
  },
];
