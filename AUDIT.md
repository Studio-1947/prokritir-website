# Prokritir Jol  Website Audit

**Date:** 2026-08-05
**Branch:** `backup/UI-changes/rahul`
**Scope:** `frontend/` (React 19 / CRA + craco / Tailwind) and `backend/` (FastAPI + MongoDB)

## Method

Walked the site as a customer would  land, read, open the order modal, place an order, hit the
success page  and read every file on that path. Where a claim could be measured rather than
guessed, it was measured: a production build was run for real bundle numbers, `yarn audit` for
dependency counts, contrast ratios computed against the actual `--ink-900` base, and the
Google Fonts request issued to confirm it resolves.

Not covered: live browser testing (no browser tooling in this environment), so anything that
depends on seeing rendered pixels or real device performance is called out as such rather than
asserted. Load and penetration testing were out of scope.

## Summary

| Severity | Count | What it means |
| --- | ---: | --- |
| 🔴 Critical | 10 | Loses orders, loses data, or creates legal exposure. Fix before launch. |
| 🟠 Medium | 15 | Costs traffic, conversions, or accessibility. Fix in the first month. |
| 🟡 Basic | 18 | Polish, hygiene, and maintainability. Fix when convenient. |

The single most important thing in this report: **the order pipeline has a data-loss path**
(C1) and **the checkout form is close to unusable on a phone** (C7). Everything else is
secondary to those two.

---

# 🔴 Critical

### C1. Orders can be silently lost  memory is the primary store

[`backend/server.py:163-169`](backend/server.py#L163-L169)

```python
IN_MEMORY_ORDERS[order_id] = doc
try:
    await db.orders.insert_one(doc)
except Exception as e:
    logger.warning(f"MongoDB save skipped or failed, using in-memory store: {e}")
return order
```

If MongoDB is unreachable the write fails, a warning is logged, and the endpoint **returns 200
anyway**. The customer sees a success page and an order number for an order that exists only in
one process's memory. It disappears on the next restart or deploy.

Three separate failures fall out of this:

1. **Data loss.** A restart drops every order not written to Mongo.
2. **False confirmation.** The customer is told the order is placed. Nobody will ship it.
3. **Immediate 404s under more than one worker.** `GET /api/orders/{id}` checks
   `IN_MEMORY_ORDERS` first ([`server.py:174`](backend/server.py#L174)). With multiple Uvicorn
   workers or replicas, the success-page fetch can land on a process that never saw the order 
   the customer completes checkout and is told "Order not found."

There is also **no notification of any kind** when an order arrives  no email, no SMS, no
webhook. Nobody at the business learns about an order except by querying the database.

**Fix:** make the database write the source of truth. If it fails, return 5xx and tell the
customer the order did not go through. Drop `IN_MEMORY_ORDERS` or demote it to a cache. Add an
order notification before launch.

### C2. A missing build-time variable points production at `localhost`

[`frontend/src/lib/api.js:3`](frontend/src/lib/api.js#L3)

```js
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
```

CRA inlines this at **build** time. If the variable is not set in the deploy pipeline the
fallback is baked into the bundle, and every shipped browser tries to reach its own machine.
On an HTTPS site the request is also blocked as mixed content. The failure is invisible  no
error surfaces to the user beyond a dead order button.

**Fix:** fail the build when the variable is absent rather than falling back, and check the
compiled bundle for `localhost` as a release gate.

### C3. CORS allows any origin *with credentials*

[`backend/server.py:188-194`](backend/server.py#L188-L194)

```python
allow_credentials=True,
allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
allow_methods=["*"],
allow_headers=["*"],
```

The default is `*`. Starlette combined with `allow_credentials=True` reflects the caller's
Origin header back, so **any website can call this API with credentials attached**. Methods and
headers are wide open too. Impact is limited today because there is no session or cookie auth 
which is exactly why this is easy to miss and dangerous the day auth is added.

**Fix:** require `CORS_ORIGINS` explicitly (no wildcard default), and restrict methods to
`GET, POST`.

### C4. Order lookup is unauthenticated and returns full customer PII

[`backend/server.py:172-182`](backend/server.py#L172-L182)

`GET /api/orders/{order_id}` returns name, phone, email, full street address, and delivery
notes to anyone who has the ID. No auth, no rate limit. The ID is a UUIDv4 so brute force is
impractical  but it sits in the URL bar as `/success/:orderId`, which gets shared, screenshotted,
kept in browser history, and logged by every proxy in between. The route also has no `noindex`.

**Fix:** either require a second factor to view an order (last 4 digits of the phone number is
enough for this scale), or return only non-identifying fields to the success page, or expire
the link. Add `noindex` to the route regardless.

### C5. Placeholder legal and regulatory content is presented as fact

Five separate instances, and the code comments say so out loud:

| Item | Location | Problem |
| --- | --- | --- |
| Privacy Policy link | [`Footer.jsx:121`](frontend/src/components/Footer.jsx#L121) | `href="#footer"`  dead |
| Terms of Service link | [`Footer.jsx:122`](frontend/src/components/Footer.jsx#L122) | `href="#footer"`  dead |
| FSSAI licence `12824999000123` | [`brand.js:48`](frontend/src/lib/brand.js#L48) | Displayed as fact |
| Testimonials | [`brand.js:162-183`](frontend/src/lib/brand.js#L162-L183) | Marked *"replace with real, consented customer quotes before this page goes live"*  attributed to named people |
| Impact counters | [`brand.js:152-157`](frontend/src/lib/brand.js#L152-L157) | Marked *"Illustrative figures  swap for audited numbers"*  presented as achievements |

The site collects name, phone, email, and address, which under India's **DPDP Act 2023** requires
a published privacy notice  the link exists but goes nowhere. Packaged drinking water is an
FSSAI-licensed category, so a placeholder licence number on a live commercial site is a
regulatory exposure, not a typo. Invented testimonials and unaudited impact figures are the kind
of claim consumer-protection and advertising rules treat as misleading.

**Fix:** these are all content decisions, not code. Real policy pages, the real licence number,
consented quotes or none at all, audited figures or none at all.

### C6. "Free delivery" contradicts the actual shipping rule

The Twelve Pack (₹200) and Litre Case (₹400) both list **"Free delivery"** as a perk
([`brand.js:130`](frontend/src/lib/brand.js#L130), [`brand.js:140`](frontend/src/lib/brand.js#L140)).

Shipping is actually free only above ₹300  enforced identically on both sides
([`server.py:144`](backend/server.py#L144), [`OrderModal.jsx:71`](frontend/src/components/OrderModal.jsx#L71)):

```python
shipping = 0 if subtotal >= 300 else 40
```

So a customer who orders **one Twelve Pack** reads "Free delivery" on the card, adds it to the
cart, and is charged ₹40 at checkout. The site also contradicts itself: the FAQ states the ₹300
rule correctly ([`brand.js:196`](frontend/src/lib/brand.js#L196)).

This is the worst possible place for a broken promise  it appears at the moment of payment,
which is where trust is cheapest to lose.

**Fix:** either drop the perk from the ₹200 tier, or make the Twelve Pack genuinely ship free.

### C7. The checkout form is close to unusable on a phone

[`OrderModal.jsx:246-325`](frontend/src/components/OrderModal.jsx#L246-L325)

Every field is a bare `<input>` with no `type`, `name`, `inputMode`, or `autoComplete`  only
Email has `type="email"`. There is also no `<form>` element wrapping them.

| Field | Ships as | Should be |
| --- | --- | --- |
| Phone | `<input>` | `type="tel" inputMode="tel" autoComplete="tel"` |
| Pincode | `<input>` | `inputMode="numeric" autoComplete="postal-code"` |
| Full name | `<input>` | `autoComplete="name"` |
| Address | `<input>` | `autoComplete="street-address"` |
| City / State | `<input>` | `autoComplete="address-level2" / "address-level1"` |

Consequences, in order of how much they cost:

- Phone and pincode summon the **full alphabetic keyboard** on mobile. Typing a 10-digit number
  through a QWERTY layout is the single most abandoned interaction in Indian e-commerce.
- **Autofill is completely dead.** No browser, OS, or password manager can fill any field.
- **Enter does not submit**  there is no form, so there is no implicit submission.

This is the checkout of a cash-on-delivery store. It is the highest-leverage fix on the page and
costs perhaps thirty minutes.

### C8. A catalogue failure leaves an infinite spinner and no error

[`OrderModal.jsx:28-31`](frontend/src/components/OrderModal.jsx#L28-L31) sets an error on failure:

```js
listProducts().then(setProducts).catch(() => setError("Could not load products."));
```

But the error element is rendered **only inside the `step === 2` block**
([`OrderModal.jsx:332-336`](frontend/src/components/OrderModal.jsx#L332-L336)). The user is on
step 1. What they get instead is
[`OrderModal.jsx:238-242`](frontend/src/components/OrderModal.jsx#L238-L242):

```jsx
{!products.length && (<div>… Loading catalogue…</div>)}
```

Backend down, network blip, CORS misconfigured (see C3)  all produce a spinner that never
resolves, with no message and no retry. The customer has no way to know anything is wrong.

**Fix:** hoist the error block above the step branches, and add a retry button.

### C9. 7.3 MB of assets and a 458 kB single JS chunk on first load

Measured from a real production build:

| Asset | Size | Note |
| --- | ---: | --- |
| `main.js` | **458.51 kB gzip** (1.61 MB raw) | One chunk. No code splitting at all. |
| `main.css` | 14.72 kB gzip | |
| `Untitled.glb` | 4.2 MB | Fetched eagerly  see below |
| `prokritir_jol_500ml.glb` | 1.8 MB | **Unused fallback, still deployed** |
| `bottle.png` | 690 KB | Hero fallback frame *and* a 44 px modal thumbnail |
| pack shots | 632 KB | |
| **Total static** | **7.3 MB** | |

The GLB is not lazy. [`BottleModel.jsx:67`](frontend/src/components/BottleModel.jsx#L67) calls
`useGLTF.preload(MODEL)` at **module scope**, so the 4.2 MB download begins the moment the Hero's
module is evaluated  competing with the JS bundle, the fonts, and the hero photography for
bandwidth on first paint.

For an audience in Nadia and semi-urban West Bengal on 4G, this is the difference between a sale
and a bounce.

**Fix, in order of payoff:** stop deploying the unused GLB (−1.8 MB, free); compress the active
GLB with `gltf-transform optimize` (typically −70%); generate a small thumbnail for the modal
instead of reusing the 690 KB hero PNG; lazy-load `BottleModel` behind `React.lazy` so the model
and the whole three.js/drei stack leave the initial chunk.

### C10. The animated background runs at a documented 20–35 fps

[`SiteBackground.jsx:27-42`](frontend/src/components/SiteBackground.jsx#L27-L42)  the code
records its own measurement and ships the slow setting:

```
true   fluid drifts, glass refracts   ~20–35 fps
false  fluid still, glass refracts    ~100 fps
```

`ANIMATE_BACKGROUND = true`. That figure is from a desktop at 1440×900. The page also runs a
**second WebGL context** for the bottle and roughly 28 `GlassSurface` panels, each re-running a
9-node SVG filter every frame the backdrop moves.

On a mid-range Android  the majority device for this audience  expect materially worse, plus
real risk of GPU memory pressure from two simultaneous WebGL contexts.

The escape hatch already exists and is one line. The honest trade is whether drifting liquid is
worth two-thirds of the frame rate on the devices most of your customers actually hold.

*Not verified on a device  this is the code's own measurement plus the mobile multiplier.*

---

# 🟠 Medium

### M1. The modal has no dialog semantics
[`OrderModal.jsx:121-137`](frontend/src/components/OrderModal.jsx#L121-L137)  no `role="dialog"`,
no `aria-modal`, no focus trap, no focus restore on close, and **no Escape to close**. Keyboard
users tab straight out of the modal into the page behind it; screen readers never announce that a
dialog opened. The backdrop is a `<div>` with an `onClick`. The mobile nav drawer has the same
gaps  [`Nav.jsx:153-161`](frontend/src/components/Nav.jsx#L153-L161) has an `aria-label` but no
`aria-expanded` or `aria-controls`.

### M2. No social metadata, and nothing in the HTML to scrape
`index.html` contains **zero** `og:`, `twitter:`, or `canonical` tags (verified). CRA ships an
empty `<div id="root">`, and link-preview crawlers do not execute JavaScript. Every share on
WhatsApp, Facebook, or LinkedIn produces a **blank preview card**  and WhatsApp is the primary
distribution channel for this market.

### M3. No `robots.txt`, no `sitemap.xml`, no `manifest.json`, and soft 404s
None of the three files exist. [`App.js:20`](frontend/src/App.js#L20) maps `path="*"` to the
landing page, so **every** URL returns the full page with HTTP 200  an unbounded crawlable
space of duplicate content with no way for a crawler to learn a URL is wrong.

### M4. No structured data
Three products with prices, a five-question FAQ, and a local business  and no `Product`,
`Offer`, `FAQPage`, or `LocalBusiness` JSON-LD. This is the cheapest available SEO win for a
site of this shape.

### M5. Validation is loose enough to accept undeliverable orders
Pincode accepts 4–12 characters ([`server.py:65`](backend/server.py#L65),
[`OrderModal.jsx:80`](frontend/src/components/OrderModal.jsx#L80))  Indian pincodes are exactly
six digits. Phone accepts 7–20 characters of anything at all
([`server.py:60`](backend/server.py#L60)). Neither side does a format check. The result is orders
that pass validation and cannot be delivered. The submit button is also merely *disabled*
([`OrderModal.jsx:407`](frontend/src/components/OrderModal.jsx#L407)) with no indication of which
field is at fault  see B14.

### M6. No rate limiting or bot protection on order creation
`POST /api/orders` is open. Cash on delivery means there is no payment step to filter fraud, so a
trivial script can flood the business with fake deliveries to real addresses.

### M7. Two contrast failures, both computed
Against `--ink-900` (`#040c13`):

| Element | Colour | Ratio | Required |
| --- | --- | ---: | --- |
| Process stage numbers `01`–`06` ([`Process.jsx:45`](frontend/src/components/sections/Process.jsx#L45)) | `text-white/25` | **2.15:1** | 3:1 (large text) |
| Form placeholders ([`OrderModal.jsx:442`](frontend/src/components/OrderModal.jsx#L442)) | `text-white/25` | **2.15:1** | 4.5:1 (body text) |

The placeholders are the worse of the two  they carry the address-format examples in checkout.

### M8. The two-tier text hierarchy does not exist in the render
[`index.css:28-29`](frontend/src/index.css#L28-L29):

```css
--paper-dim:   rgba(255, 255, 255, 0.72);
--paper-faint: rgba(255, 255, 255, 0.72);
```

Identical. Components choose carefully between `dim` and `faint` throughout the codebase, and
every one of those choices is a no-op.

### M9. Framer Motion ignores `prefers-reduced-motion`
The CSS animations are handled ([`index.css:351-354`](frontend/src/index.css#L351-L354)) and both
WebGL layers check the media query. But every `Reveal` (`initial={{opacity:0, y:26}}` +
`whileInView`), every hero entrance, and the modal transitions run regardless of the user's
setting. A `<MotionConfig reducedMotion="user">` at the app root fixes all of them at once.

### M10. Footer navigation is decorative
All four social icons point to `href="#footer"`
([`Footer.jsx:58-68`](frontend/src/components/Footer.jsx#L58-L68)). The Company column
([`brand.js:219-226`](frontend/src/lib/brand.js#L219-L226)) sends *About Us* to `#source`,
*Careers* to `#promise`, *Distributors* to `#bottles`, and *Sustainability* to `#promise`.
Clicking "Careers" scrolls you to the impact section. Better to omit a link than to fake it.

### M11. Reopening the modal quickly wipes the cart
[`OrderModal.jsx:39-44`](frontend/src/components/OrderModal.jsx#L39-L44) clears the cart on a
250 ms `setTimeout` that is never cleared on cleanup. Close the modal and click a tier's Order
button within 250 ms, and the stale timer fires after the new cart is set  emptying it.

### M12. 99 dependency advisories, and the framework is unmaintained
`yarn audit`: **99 vulnerabilities (67 high, 31 moderate, 1 low)** across 1,619 packages. Most sit
in the `react-scripts@5.0.1` dev toolchain and do not ship to browsers, but **Create React App is
no longer maintained**, so that tree will not improve on its own.

Separately, the `resolutions` block pins several packages *below* what their dependents request 
`form-data@4.0.4` against `^4.0.5`, `js-yaml@4.1.1` against `^4.3.0`,
`@babel/plugin-transform-modules-systemjs@7.29.4` against `^7.29.7`. Resolutions exist to close
vulnerabilities; these downgrades can re-open them.

### M13. No error boundary anywhere
A single throw in any section  or a failed WebGL context on a device that cannot allocate two 
unmounts the whole tree and leaves a blank page.

### M14. Every route shares one title, and the order page is indexable
No `react-helmet` or `document.title` management exists. `/success/:orderId` renders a customer's
name, phone, and full address under the title "Prokritir Jol · Nature's Water", with no `noindex`.

### M15. Seven products exist that no user can reach
The backend catalogue carries masala and chai SKUs
([`server.py:38-47`](backend/server.py#L38-L47)), but `open()` always defaults to
`category="water"` ([`orderContext.jsx:10`](frontend/src/lib/orderContext.jsx#L10)) and nothing
ever passes anything else. Either dead code to delete or a feature that was never wired up.

---

# 🟡 Basic

| # | Finding | Location |
| --- | --- | --- |
| B1 | `theme-color` is `#e4ebf1`  a *light* colour on a `#040c13` site. Mobile browser chrome will clash with the page. | [`index.html:6`](frontend/public/index.html#L6) |
| B2 | Google Fonts requested twice  a `<link>` in the HTML *and* an `@import` in the CSS. The `@import` also serialises discovery behind CSS parse. Drop the `@import`. | [`index.html:12`](frontend/public/index.html#L12), [`index.css:4`](frontend/src/index.css#L4) |
| B3 | None of the 12 `<img>` tags carry `loading`, `decoding`, or `width`/`height`. Missing dimensions cause layout shift; no lazy-loading below the fold. | all `.jsx` |
| B4 | Hero and section photography are hotlinked from Unsplash and Pexels  third-party uptime and no control over the asset on a commercial site. | [`brand.js:21-38`](frontend/src/lib/brand.js#L21-L38) |
| B5 | `lang="en"` with no `lang="bn"` on any Bengali string. Screen readers will pronounce প্রকৃতির জল with an English voice. | throughout |
| B6 | The marquee duplicates its content for the seamless loop with no `aria-hidden` on the second run  screen readers read the list twice. | [`Marquee.jsx:11`](frontend/src/components/sections/Marquee.jsx#L11) |
| B7 | FAQ buttons have `aria-expanded` but no `aria-controls`; panels have no `id` or `role="region"`. | [`Faq.jsx:40-66`](frontend/src/components/sections/Faq.jsx#L40-L66) |
| B8 | `aria-current="true"` should be `aria-current="location"` for in-page section nav. | [`Nav.jsx:117`](frontend/src/components/Nav.jsx#L117) |
| B9 | README is one line: *"# Here are your Instructions"*. No setup, env var, or deploy docs. `docker-compose.yml` hardcodes localhost URLs and is dev-only, with nothing describing production. | `README.md` |
| B10 | 41 of 46 shadcn/ui components are unused; only button, dialog, label, toast, and toggle are imported. Their Radix packages stay in `package.json`, inflating install time and audit surface. | `frontend/src/components/ui/` |
| B11 | `Untitled.glb`  a production asset with a placeholder filename. | `frontend/public/` |
| B12 | No analytics or conversion tracking of any kind. You currently cannot tell whether any issue in this report is costing you orders. |  |
| B13 | The FAQ promises free shipping "over ₹300"; the code is `>= 300`. Trivially more generous than promised, but it is the sentence customers will quote. | [`brand.js:196`](frontend/src/lib/brand.js#L196), [`server.py:144`](backend/server.py#L144) |
| B14 | Disabled "Place order" gives no reason. Pair with M5  tell the user which field is short. | [`OrderModal.jsx:405-416`](frontend/src/components/OrderModal.jsx#L405-L416) |
| B15 | `@app.on_event("shutdown")` is deprecated in FastAPI; use a lifespan handler. | [`server.py:203`](backend/server.py#L203) |
| B16 | `GET /api/products` declares `response_model=List[dict]`  no schema, no client contract. | [`server.py:102`](backend/server.py#L102) |
| B17 | Prices are duplicated between `brand.js` and `server.py`. They will drift; the marketing copy is what customers will hold you to. | both |
| B18 | No frontend tests at all. The backend has one file; root `tests/` holds only an empty `__init__.py`. |  |

---

## What is already right

Worth stating, because several of these are things sites at this stage usually get wrong:

- **The server never trusts client prices.** [`server.py:116-141`](backend/server.py#L116-L141)
  resolves every line item from its own catalogue and recomputes the total. This is the single
  most important correctness property in e-commerce and it is done properly.
- **Every customer field has Pydantic bounds** ([`server.py:58-66`](backend/server.py#L58-L66)) 
  loose (see M5), but present and enforced server-side.
- **`scroll-padding-top: 96px`** ([`index.css:54`](frontend/src/index.css#L54)) correctly clears
  the fixed nav for anchor targets  routinely missed.
- **Global `:focus-visible` outlines** are defined ([`index.css:367-371`](frontend/src/index.css#L367-L371)).
- **`prefers-reduced-motion` is honoured** for all CSS animation and both WebGL layers.
- **Testimonial avatars are monograms, not stock portraits**  a deliberate refusal to put a
  stranger's face beside words they never said ([`Voices.jsx:8-10`](frontend/src/components/sections/Voices.jsx#L8-L10)).
- **The code comments are genuinely excellent**  they explain *why*, record measurements, and
  document the trade-offs taken. That is why several findings above could be confirmed from the
  source rather than guessed at.

---

## Suggested order of work

**Before launch**  C1, C2, C5, C6, C7, C8. Data loss, a dead API URL, legal exposure, a broken
price promise, and the two defects that break checkout itself.

**Launch week**  C3, C4, C9, C10, M2, M3, M6. Security posture, page weight, and the SEO and
social basics that decide whether anyone arrives at all.

**First month**  M1, M5, M7, M9, M13, M14, and the rest of the medium tier. Accessibility,
validation quality, and resilience.

**As convenient**  the basic tier, plus a decision on M12: CRA is unmaintained, and migrating to
Vite is a day of work that retires most of the dependency backlog at once.
