# Prokritir Jol  PRD

## Original Problem Statement
> Build a landing page: a ro water bottle company , named Prokritir Jol (Which meand Nature's Water). Wanted to rotate the water bottle with the interaction of scrolling, (the water bottle will spin in 3d and open the cap of the bottle and someone from a rural bengali Indian will drink the water from the bottle, this entire story we need to showcase through the website. this should interactive storytelling based website. in the bottom footer a small intro. I have attached the water bottle Image.

## User Choices
- **3D approach**: Hybrid  pseudo-3D image rotation for the bottle + real Bengali village photography for the drinking story
- **Story sequence**: Hero (bottle floats/rotates) → Nature Source (deep tubewell + RO filters in lush green rural Bengal) → bottle spins in 3D → cap opens/lifts → Rural Bengali & Nepali youth drinking → Purity/Mission → Footer
- **Imagery**: Authentic Unsplash/Pexels stock photography of rural Bengal villagers and Nepali youth
- **Language**: English primary + Bengali (প্রকৃতির জল) accents
- **Backend**: None  purely static storytelling landing page

## Architecture
- Frontend-only React 19 (CRA + Craco) with TailwindCSS + framer-motion
- Single `Landing` page (`/app/frontend/src/pages/Landing.jsx`)
- Sticky `h-screen` viewport stage inside a 600vh scroll track; all scenes driven by `useScroll` + `useTransform` bound to `scrollYProgress`
- Bottle rendered as two clipped image layers (body & cap)  the cap layer is transformed independently to simulate opening
- No spring smoothing on scene transforms (raw scrollYProgress) → perfectly locked scroll animation

## Components
- `Nav.jsx`  fixed top bar with brand + section anchors + Order CTA
- `BackgroundStage.jsx`  5 layered background scenes (hero navy → village → water splash → drinking portraits → mission)
- `BottleScene.jsx`  sticky bottle with rotate/scale/y transforms + independent cap-lift
- `StoryOverlay.jsx`  6 chapter overlays whose opacity/y is scroll-linked
- `ChapterRail.jsx`  right-side numbered progress dots
- `Footer.jsx`  bilingual marquee + brand intro + explore/company/contact grid
- `lib/brand.js`  constants (images, brand strings, chapter labels)

## Implemented Features (2026-01)
- 6-chapter cinematic scroll story: Prologue → Source → Purity → Reveal → People → Epilogue
- Scroll-linked bottle rotation (0° → 720°+) with scale changes
- Cap lift/detach animation between progress 0.55–0.78 with water droplet trail
- Parallax nature source (lush village + tubewell inset)
- 7-layer purity RO filtration story
- Twin rural Bengali & Nepali youth drinking scenes
- Editorial mission chapter with "Read the promise" + "Order a case" CTAs
- Bengali (প্রকৃতির জল) branding accents throughout
- Bilingual marquee footer with brand intro, contact, FSSAI compliance line

## Order-capture Flow (2026-01, added post-MVP)
- Backend catalogue: 6 SKUs (500 ml × 1/12/24 ₹20/200/380 · 1 L × 1/12/24 ₹40/400/760)
- `POST /api/orders` computes totals server-side (never trusts client prices), applies free shipping ≥ ₹300, else ₹40
- Human-readable order number `PJ-YYMMDD-XXXX`
- `GET /api/orders/{id}` returns full order including customer address
- Two-step `OrderModal` (product picker → delivery form) opens from Nav CTA & Mission "Order a case" CTA
- `/success/:orderId` page: order number w/ copy-to-clipboard, receipt items, address block, and impact stat "N litres given back"
- **NO payment gateway yet**  currently a COD/reservation flow. Backend/Modal ready to plug into Razorpay/Stripe at the last step.

## Design System
- Colors: `#061021` (deep navy) / `#0A192F` (navy) / `#135033` (emerald) / `#00E5FF` (cyan accent) / `#F8F9FA` (off-white)
- Typography: Playfair Display (headlines) + Manrope (body) + Hind Siliguri (Bengali)
- Effects: bottle glow via drop-shadow, grain overlay, glassmorphism text cards, hairline dividers

## Backlog / Nice-to-haves (P1/P2)
- P1: prefers-reduced-motion fallback (static poster hero) for accessibility
- P1: Real product order flow (Stripe/Razorpay) via `/api/orders`
- P2: Localised Bengali full-page mode toggle
- P2: Retailer locator map + distributor form (backend needed)
- P2: Newsletter signup with Resend
- P2: Timeline of impact ("N litres returned to villages" ticker)

## Test Credentials
Not applicable  no auth in this build.
