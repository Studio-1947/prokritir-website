/**
 * The Journal  long-form posts for /journal and /journal/:slug.
 *
 * Same principle as brand.js: all copy lives here so the page components stay
 * presentational and an editor never has to open JSX to fix a sentence.
 *
 * ⚠️ PLACEHOLDER DATA  replace before launch:
 *    · AUTHORS           sample bylines, not real staff
 *    · impact figures in `one-bottle-one-litre`  illustrative, not audited
 *    · lab numbers quoted in `how-to-read-a-water-label`  typical ranges,
 *      swap for the figures on your own current test report
 *
 * A post body is a list of blocks so the renderer stays dumb:
 *    { t: "p"     , x: "…" }            paragraph
 *    { t: "h2"    , x: "…" }            section heading
 *    { t: "ul"    , x: ["…", "…"] }     bulleted list
 *    { t: "ol"    , x: ["…", "…"] }     numbered list
 *    { t: "note"  , x: "…" }            aside / callout panel
 *    { t: "quote" , x: "…", cite: "…" } pull quote
 */

import { IMAGES } from "@/lib/brand";

// ⚠️ Sample bylines written to show the layout.
export const AUTHORS = {
  ipsita: { name: "Dr. Ipsita Roy", role: "Water quality lead", initials: "IR" },
  sourav: { name: "Sourav Das", role: "Plant operations, Nadia", initials: "SD" },
  ananya: { name: "Ananya Sen", role: "Editor", initials: "AS" },
};

export const JOURNAL_INTRO = {
  eyebrow: "The Journal",
  title: "Notes from",
  titleAccent: "the water table.",
  body:
    "Field notes, lab notes and the occasional argument  written in Nadia by the people who draw, test and bottle the water. No press releases. If a number appears here, we will tell you where it came from.",
};

export const POSTS = [
  // ───────────────────────────────────────────────────────────── 01
  {
    slug: "two-hundred-and-twenty-feet",
    title: "Two hundred and twenty feet down",
    subtitle: "What a confined aquifer actually is, and why the age of the water matters more than the depth of the well.",
    category: "The Source",
    date: "2026-08-18",
    author: "sourav",
    image: IMAGES.stream,
    imageAlt: "A slow forest stream running over pale rock",
    featured: true,
    excerpt:
      "Depth is the number everyone quotes and the least interesting one on the page. What matters is the clay above the water, and how long it took to get there.",
    body: [
      { t: "p", x: "Every bottled water brand in India will tell you how deep its well is, and the number is almost always beside the point. Depth on its own tells you how far someone was willing to drill. It tells you nothing about what the water passed through on the way down, how long it has been sitting there, or whether anything from the surface can still reach it. Those three things are the whole story, and only one of them is a number you can print on a label." },
      { t: "p", x: "Our well in Nadia goes to roughly two hundred and twenty feet. Below the paddy soil and the shallow water that farmers pump for irrigation, there is a bed of clay  dense, grey, laid down long before any of this was farmland. Under the clay sits the water we draw. In hydrogeology that arrangement has a name: a confined aquifer." },

      { t: "h2", x: "What confined actually means" },
      { t: "p", x: "An unconfined aquifer is open to the sky. Rain that falls on the field this morning percolates down through soil and sand and joins it, and so does everything the rain carried with it  fertiliser, effluent, whatever ran off the road. It refills quickly, which sounds like a virtue until you realise that anything refilling quickly is also contaminating quickly." },
      { t: "p", x: "A confined aquifer is capped. The clay layer above it is effectively impermeable on any timescale that matters to a human being, so the water underneath is not in conversation with this year's monsoon. It entered the ground somewhere else, at the aquifer's recharge zone, and travelled sideways through sand and gravel for a very long time to arrive under our feet." },
      { t: "note", x: "The practical consequence: surface contamination that would show up in a shallow tubewell within a season may take decades or longer to reach a confined aquifer, if it ever does. That is the protection you are buying with the clay  not with the drill." },

      { t: "h2", x: "Old water is filtered water" },
      { t: "p", x: "Water that has spent that long moving slowly through sand has already been through the most thorough filtration anyone has ever designed, and it was free. Suspended solids are gone. Most organic matter is gone. What remains is dissolved mineral content picked up from the rock itself, which is exactly the part you want to keep." },
      { t: "p", x: "This is why our purification hall is quieter than people expect. When the incoming water is already clean, the seven stages are not rescuing a bad input  they are guarding against the small, boring risks that remain: a trace of iron, a bacterium introduced at the pump head, the possibility that something changed since last week's test and nobody noticed yet." },
      { t: "quote", x: "It arrives already clean. Our job is mostly not to ruin it.", cite: "The line we keep repeating in the plant" },

      { t: "h2", x: "Why we meter the draw" },
      { t: "p", x: "A confined aquifer's great weakness is the flip side of its strength. Because it refills slowly, it is entirely possible to take water out faster than it comes back  and to do so for years before anything visibly goes wrong. What goes wrong first is not the taste. It is the water level, then the ground above it, then the neighbours' wells." },
      { t: "p", x: "So the well is metered, and the draw is capped below our estimate of the natural recharge rate. In practice that means three things:" },
      {
        t: "ul", x: [
          "A flow meter on the wellhead logs every litre drawn, read and recorded daily rather than at the end of the month.",
          "A dip meter reads the static water level before the first draw of the day, so a downward trend shows up as a trend and not as a crisis.",
          "Production is planned around that ceiling. When demand runs ahead of it, the answer is a longer lead time on orders, not a longer day on the pump.",
        ]
      },
      { t: "p", x: "It is an unglamorous constraint and it costs us orders in the summer. It is also the only version of this business that still exists in thirty years." },

      { t: "h2", x: "What depth does not buy you" },
      { t: "p", x: "Two things, worth saying plainly. Depth does not guarantee low arsenic  parts of the Bengal basin carry arsenic at depth, which is why testing matters more than geology and why we test rather than assume. And depth does not survive bad handling. Water drawn from two hundred feet and then held in an open tank, moved through a dirty line, or bottled into a container that has been sitting in the sun is just water with a good origin story." },
      { t: "p", x: "The aquifer gives us a head start. Everything after the pump is ours to lose." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 02
  {
    slug: "putting-the-minerals-back",
    title: "Why we take the minerals out, then put them back",
    subtitle: "Reverse osmosis removes almost everything. That is the point, and also the problem.",
    category: "Purity",
    date: "2026-07-22",
    author: "ipsita",
    image: IMAGES.droplet,
    imageAlt: "A single droplet meeting still water",
    excerpt:
      "An RO membrane cannot be told what to keep. So stage six exists to undo, carefully, part of what stage three did.",
    body: [
      { t: "p", x: "The most common complaint about RO water is that it tastes like nothing. People say it the way you would describe a room with no furniture  technically fine, obviously wrong. They are not imagining it, and the explanation is not marketing." },

      { t: "h2", x: "A membrane cannot take instructions" },
      { t: "p", x: "A reverse-osmosis membrane has pores of roughly 0.0001 microns. Water molecules pass. Nearly everything else  dissolved salts, heavy metals, pesticide residue, bacteria, viruses  does not. That indiscriminacy is exactly why RO is the right tool for drinking water in this part of the country, where the things you most want removed are dissolved rather than suspended." },
      { t: "p", x: "But the membrane has no opinions. It cannot pass calcium while rejecting arsenic; both are simply too large. So the water leaving stage three is close to laboratory-grade, with a total dissolved solids reading in the single digits, and it tastes exactly as flat as that sounds." },
      { t: "note", x: "Taste in water is almost entirely dissolved mineral content. Strip the minerals and you have not made the water purer to drink  you have made it duller to drink, which most people read as a fault in the bottle." },

      { t: "h2", x: "What stage six adds back" },
      { t: "p", x: "After the ultraviolet and ozone stages, the water passes a dosing stage that meters mineral salts back in  principally calcium and magnesium, in proportions chosen for taste rather than for nutrition. Two honest caveats about that:" },
      {
        t: "ul", x: [
          "Bottled water is not a meaningful source of dietary minerals. Anyone telling you their water will fix a magnesium deficiency is selling something. Food does that job by two orders of magnitude.",
          "Calcium and magnesium are what your palate reads as 'water'. Restore them and the flatness goes. That is the entire claim, and it is enough of one.",
        ]
      },
      { t: "p", x: "The target is roughly 7.2 pH and a TDS in the region that most people find pleasant rather than the lowest number we could achieve. We could ship at TDS 8 and put it on the label as a purity boast. It would be a worse drink." },

      { t: "h2", x: "The number nobody should chase" },
      { t: "p", x: "There is a persistent idea, helped along by the little TDS pens sold outside every water shop, that lower is always better. It is not. A low TDS reading tells you dissolved solids are absent; it cannot tell you which dissolved solids were absent to begin with, and it says nothing at all about bacteria, which have no effect on the reading." },
      { t: "quote", x: "A TDS meter can tell you a water is empty. It cannot tell you it is safe.", cite: "Dr. Ipsita Roy" },
      { t: "p", x: "If you want to know whether water is safe, you need a microbiological test and a heavy-metal panel, done on a schedule, by someone with no stake in the result. The pen is a conductivity meter with good marketing." },

      { t: "h2", x: "What we actually test, and how often" },
      {
        t: "ol", x: [
          "Every batch, in-house: pH, TDS, turbidity, residual ozone, and a visual and taste check before the batch is cleared to ship.",
          "Weekly, in-house: microbiological plating  total plate count, coliforms, E. coli.",
          "Quarterly, external: a full panel at an accredited laboratory, including heavy metals and pesticide residue, on a sample drawn from a sealed retail bottle rather than from the line.",
        ]
      },
      { t: "p", x: "The last detail matters more than it sounds. Testing from the line tells you about your water. Testing from a sealed bottle, pulled at random from stock, tells you about your water, your bottle, your cap, your filler and your storage. Only one of those is the thing a customer actually opens." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 03
  {
    slug: "how-to-read-a-water-label",
    title: "How to read a water label",
    subtitle: "Six things printed on every bottle in India, and what each one is really telling you.",
    category: "Guide",
    date: "2026-06-30",
    author: "ananya",
    image: IMAGES.field,
    imageAlt: "A golden field at low sun",
    excerpt:
      "Most of a water label is legally mandated and quietly informative. Here is how to get something useful out of it in about twenty seconds.",
    body: [
      { t: "p", x: "Bottled water in India is one of the more tightly regulated things you can buy at a railway stall, and the label carries more information than almost anyone reads. This is a short guide to reading someone else's  including ours  with a bit of suspicion." },

      { t: "h2", x: "1. Packaged drinking water vs. natural mineral water" },
      { t: "p", x: "These are two different products under two different standards. Natural mineral water must come from a protected source and be bottled essentially as it emerges, with only very limited treatment. Packaged drinking water may come from any source and is treated to make it safe  which, in a country with our groundwater, is usually the more honest option." },
      { t: "p", x: "Neither category is automatically better. A mineral water from a poorly protected spring is worse than a well-run treated water. What the category tells you is what questions to ask next." },

      { t: "h2", x: "2. The ISI mark and the licence number" },
      { t: "p", x: "Packaged drinking water carries IS 14543; natural mineral water carries IS 13428. The mark is mandatory, so its presence proves very little  but the licence number under it is checkable against the BIS register, and a number that does not resolve is the single loudest warning sign on a label." },
      { t: "note", x: "Worth doing once, at a stall you use often: look up the licence number rather than trusting the logo. Counterfeiters reproduce marks perfectly well. Registers are harder to fake." },

      { t: "h2", x: "3. The FSSAI number" },
      { t: "p", x: "Fourteen digits, identifying the licence holder rather than the product. It answers a narrow but important question: does a real, registered entity take legal responsibility for what is in this bottle? Ours is printed on every bottle and in the footer of this site." },

      { t: "h2", x: "4. Batch number, date of packing, best before" },
      { t: "p", x: "The batch number is the part that matters and the part nobody looks at. It is the thread that ties the bottle in your hand back to a specific run, a specific set of test results, and  if something ever goes wrong  a specific recall. A label with a date but no legible batch code is a label that cannot be traced backwards." },
      { t: "p", x: "The best-before date is about the container, not the water. Sealed water does not spoil; PET slowly does, particularly in heat and sunlight, and can start to lend the water a faint plastic note long before anything becomes unsafe." },

      { t: "h2", x: "5. The mineral table" },
      { t: "p", x: "Usually a small block on the back, and the only genuinely comparative thing on the label. Broadly, what the rows mean:" },
      {
        t: "ul", x: [
          "TDS  total dissolved solids, in mg/L. A rough proxy for how much the water will taste of anything. Very low readings drink flat; very high ones can drink chalky or metallic.",
          "pH  most drinking water sits between 6.5 and 8.5, and where it lands inside that band is a matter of taste, not safety. Claims about alkaline water correcting body pH are not supported by evidence.",
          "Calcium and magnesium  the two ions doing most of the work in how water actually tastes.",
          "Sodium  worth a glance if anyone in the household is on a restricted-sodium diet, and otherwise unremarkable at these concentrations.",
        ]
      },

      { t: "h2", x: "6. The source statement" },
      { t: "p", x: "The most revealing line on the label, precisely because it is the vaguest. 'Bottled at source' means something. A district name means something. A corporate address in another state, with no mention of where the water was drawn, means the source is not a thing the company wants to discuss." },
      { t: "quote", x: "If a label will not tell you where the water came from, that is the answer to the question.", cite: "Ananya Sen" },

      { t: "h2", x: "And the twenty-second version" },
      { t: "p", x: "Check that the seal ring is intact and not spinning freely. Check that the batch code and packing date are printed and legible. Check that the label names a place. If all three hold, you are almost certainly fine  and if the bottle is warm from a rack in the sun, buy the one from the back of the shelf." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 04
  {
    slug: "the-monsoon-problem",
    title: "The monsoon problem",
    subtitle: "Bengal gets more water in July than in any other month, and less of it is safe to drink.",
    category: "Health",
    date: "2026-05-14",
    author: "ipsita",
    image: IMAGES.village,
    imageAlt: "Lush green paddy country in rural Bengal",
    excerpt:
      "The rain that fills the tanks also lifts the water table into the contamination, floods the latrines, and turns a working tubewell into a hazard for a fortnight.",
    body: [
      { t: "p", x: "There is a grim seasonal rhythm to waterborne illness across the delta, and it tracks the rain almost exactly. Cases climb from late June, peak through the heaviest weeks of the monsoon, and fall back in October. This is not because there is less water. It is because there is more." },

      { t: "h2", x: "Three things the rain does at once" },
      {
        t: "ol", x: [
          "It raises the shallow water table, sometimes to within a few feet of the surface  so a shallow tubewell that was drawing from clean sand in April is now drawing from the zone that surface water has just reached.",
          "It floods pit latrines and drainage, moving exactly the contamination you least want into exactly the water everyone is about to drink.",
          "It moves standing water sideways across flat ground, so contamination that was previously a local problem becomes a village-scale one within hours.",
        ]
      },
      { t: "p", x: "A deep confined aquifer is largely insulated from all three  that is the point of the clay cap, and the subject of an earlier post. But most people in rural Bengal are not drinking from a deep confined aquifer in July. They are drinking from a shallow hand pump fifty metres from a flooded latrine." },

      { t: "h2", x: "The failure is usually the wellhead, not the well" },
      { t: "p", x: "This is the part that surprises people. When a village tubewell goes bad during the monsoon, the water underground is often still fine. What has failed is the top two metres: a cracked concrete apron, a plinth that has sunk below the surrounding ground, a missing drainage channel so that waste water pools around the pipe and follows it straight back down." },
      { t: "note", x: "A cracked apron is a several-hundred-rupee repair that prevents a village-wide outbreak. This is the least glamorous and most cost-effective intervention in rural water, and it is why apron and plinth repair  not new wells  takes the largest share of our one-litre fund." },

      { t: "h2", x: "What actually helps in a household" },
      { t: "p", x: "None of this is novel, and all of it is more effective than anything sold in a bottle:" },
      {
        t: "ul", x: [
          "A rolling boil for one minute  genuinely rolling, and one minute is sufficient; longer boiling adds nothing but fuel cost.",
          "Storage in a narrow-necked covered vessel with a tap or a dedicated ladle. Recontamination from hands and cups at the storage stage is a large share of household transmission and gets almost no attention.",
          "Chlorine tablets or drops used correctly, with the full contact time observed rather than the bottle being drunk immediately.",
          "Soap at the point where food is prepared. Not water treatment at all, and still one of the highest-return interventions there is.",
        ]
      },
      { t: "quote", x: "Clean water put into a dirty pot is dirty water. We spent a year learning that the vessel matters as much as the source.", cite: "Field notes, Nadia" },

      { t: "h2", x: "Where we fit, and where we do not" },
      { t: "p", x: "It would be convenient for us to argue that everyone should buy bottled water during the monsoon. It is not true and it is not affordable. Bottled water is a reasonable answer for travel, for offices, for events, and for households that can absorb the cost  and it is no answer at all for the villages nearest our own well, where the actual fix is a repaired apron, a working filter at the school, and a covered storage pot in each house." },
      { t: "p", x: "So that is where the fund goes. Not because it makes a better advertisement, but because it is what the season requires." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 05
  {
    slug: "one-bottle-one-litre",
    title: "One bottle, one litre: where it actually went",
    subtitle: "An accounting of the promise on the label  what we funded, what it cost, and what did not work.",
    category: "Impact",
    date: "2026-04-02",
    author: "sourav",
    image: IMAGES.tubewell,
    imageAlt: "A village hand pump against open sky",
    excerpt:
      "Every bottle funds a litre of clean water for a family in rural Bengal. Here is the ledger behind that sentence, including the part where we got it wrong.",
    body: [
      { t: "p", x: "A one-for-one promise is easy to print and hard to audit, and most of them stay unaudited. This post is our attempt to show the working: what the money did, in which villages, and where it was spent badly before it was spent well." },
      { t: "note", x: "⚠️ The figures below are illustrative sample data shown to demonstrate this report's format. They will be replaced with independently verified numbers before launch, and updated each quarter thereafter." },

      { t: "h2", x: "What a litre 'given back' means" },
      { t: "p", x: "It does not mean we bottle a second litre and deliver it. Trucking bottled water into a village with a working aquifer beneath it would be absurd  expensive, high-carbon, and useless the moment we stopped. It means we fund the capacity to produce a litre of safe drinking water locally, and we count against the cost of doing so." },
      { t: "p", x: "Three programmes carry almost all of it:" },
      {
        t: "ul", x: [
          "Tubewell repair and apron reconstruction  the cracked-plinth problem, fixed properly, with a drainage channel and a follow-up inspection after the first monsoon.",
          "Filtration units for village schools, with a maintenance contract attached, because a filter with no cartridge budget is a two-year object.",
          "Covered narrow-necked storage vessels for households, distributed alongside a short session on why the vessel matters.",
        ]
      },

      { t: "h2", x: "The ledger" },
      {
        t: "ol", x: [
          "1,20,000 litres of capacity funded, cumulative since launch, calculated at conservative daily-yield assumptions per installation rather than at rated capacity.",
          "14 villages reached across Nadia district, all within delivery distance of our own site so that follow-up visits are a routine cost rather than an expedition.",
          "6 tubewells repaired and under ongoing maintenance, each re-inspected after the following monsoon.",
          "4 school filtration units installed, each with a funded two-year cartridge and servicing budget held separately from the installation cost.",
        ]
      },

      { t: "h2", x: "The part that did not work" },
      { t: "p", x: "In the first year we funded two filtration units at village schools without a maintenance line. Both were working perfectly at the six-month visit. One was out of service at fourteen months, with a cartridge nobody had a budget to replace, and had become a shelf." },
      { t: "quote", x: "We had counted the litres at installation. The right time to count them is the second monsoon.", cite: "Sourav Das" },
      { t: "p", x: "Two changes came out of that. Every installation now carries a funded servicing budget from day one, held back rather than counted as delivered. And nothing is counted as impact until it has been inspected after a full monsoon cycle  which means our published numbers lag reality by about a year, and are worth considerably more as a result." },

      { t: "h2", x: "What we still cannot tell you" },
      { t: "p", x: "Honest limits, since a report without them is advertising. We do not have independent health-outcome data; measuring reductions in waterborne illness properly requires a study design and a budget we do not currently have. Our yield assumptions are conservative estimates, not meter readings, because most of these installations are hand pumps with no meter. And the whole programme sits within about forty kilometres of our plant, which makes it verifiable and also makes it small." },
      { t: "p", x: "We would rather publish a small number we can stand behind than a large one we cannot." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 06
  {
    slug: "after-the-last-sip",
    title: "After the last sip",
    subtitle: "What actually happens to a PET bottle in West Bengal, and the uncomfortable arithmetic of recycling.",
    category: "Sustainability",
    date: "2026-02-11",
    author: "ananya",
    image: IMAGES.field,
    imageAlt: "Open country at the end of the day",
    excerpt:
      "India recycles more of its PET than most countries manage. That is a real achievement and a weak defence, and we should say why.",
    body: [
      { t: "p", x: "Selling water in plastic and then writing about sustainability invites a fair amount of scepticism, so let us start from the least flattering position: the most environmentally sound bottle of water is the one nobody needed to buy. A tap you can trust beats us on every measure that exists. Where that tap is missing, the question becomes which bottle, and what happens to it afterwards." },

      { t: "h2", x: "The bottle itself" },
      { t: "p", x: "Ours is food-grade PET  polyethylene terephthalate  with a polypropylene cap and a tamper-evident ring. PET's genuine advantage is that it is one of the few plastics with an established, economically viable recycling stream. It has real value as a feedstock, which means somebody is willing to pay to collect it. That single fact does more for its recovery rate than any amount of consumer intention." },
      { t: "note", x: "Rinse it, and leave the cap on. Loose caps are small enough to fall through sorting screens and are frequently lost at the facility; attached, they travel with the bottle and are separated later by density in the wash. This is genuinely useful and almost universally done wrong." },

      { t: "h2", x: "The informal system does the work" },
      { t: "p", x: "India's PET recovery rate is high by international standards, and very little of the credit belongs to formal municipal collection. It belongs to an informal network of waste pickers, aggregators and small reprocessors who identify PET by sight and hand, sort it more accurately than most machines, and operate on margins that would be considered impossible anywhere else." },
      { t: "p", x: "That system works, and it works on the backs of people with no protective equipment, no security and no bargaining position. Any honest account of recycling in this country has to hold both halves of that sentence at once." },

      { t: "h2", x: "What we do, specifically" },
      {
        t: "ul", x: [
          "Our delivery vehicles collect empties on the return leg wherever a household or office asks. The route is already being driven; the marginal cost is close to zero and the recovery rate on those addresses is close to total.",
          "Labels are a single material with a wash-off adhesive, so they separate cleanly in the wash rather than contaminating the flake.",
          "No sleeve wrap over the bottle body, and no coloured or metallised label stock. Clear PET is worth more as feedstock, which means it actually gets recycled rather than being downcycled into fibre.",
          "Cases are shipped in shrink film that is itself a recyclable single polymer, and we are still looking for a better answer there. That one is not solved.",
        ]
      },

      { t: "h2", x: "The arithmetic nobody likes" },
      { t: "p", x: "Recycled PET has a real ceiling. Each cycle shortens the polymer chains; food-grade recycled PET requires a decontamination process that is energy-intensive and not universally available; and a meaningful share of every collected batch is lost to contamination before it becomes anything. Recycling is a way of slowing a loss, not of closing a loop." },
      { t: "quote", x: "Recycling is damage control with good public relations. The reduction has to come first.", cite: "Ananya Sen" },
      { t: "p", x: "Which is why the twelve-pack and the litre case exist and are priced the way they are. A litre bottle uses meaningfully less plastic per litre than two 500 ml bottles, and a case shipped once uses less packaging and less fuel per litre than twelve singles bought separately over a fortnight. If you can drink from the larger format, do  it is better on every axis, including your own cost." },

      { t: "h2", x: "What we have not fixed" },
      { t: "p", x: "The shrink film. The caps, which are a different polymer and a different stream. And the fundamental fact that we ship water  a heavy, low-value, locally abundant substance  in vehicles that burn diesel. Keeping the delivery radius tight helps, and it does not make the number zero." },
    ],
  },

  // ───────────────────────────────────────────────────────────── 07
  {
    slug: "nirmalata-no-machine",
    title: "নির্মলতা: the stage that runs on no machine",
    subtitle: "Six stages are instrumentation. The seventh is a person in a room with a glass.",
    category: "Craft",
    date: "2025-12-05",
    author: "sourav",
    image: IMAGES.stream,
    imageAlt: "Still water over pale stone",
    excerpt:
      "Every batch is tasted in Nadia before it leaves. Not because the instruments are unreliable  because of the specific things they are not measuring.",
    body: [
      { t: "p", x: "Nirmalata  নির্মলতা  is a difficult word to translate in one go. Clarity is close. Cleanness, in the sense of something being unclouded rather than merely disinfected, is closer. It is the word we use for the last stage of the process, which involves no equipment at all: before a batch is cleared, somebody pours a glass and drinks it." },

      { t: "h2", x: "Why bother, when six instruments already agreed" },
      { t: "p", x: "Because instruments answer the questions they were built to answer. A conductivity meter reports dissolved solids. A turbidity meter reports scattered light. A plate count, three days later, reports what grew. Each is far more sensitive than a person within its own narrow band, and every one of them is blind outside it." },
      { t: "p", x: "The human palate is unreasonably good at a specific class of problem: the faint chlorine note that means a carbon block is nearing the end of its life; the flat, slightly sweet edge of a mineral dose that has drifted low; a trace of plastic from a batch of preforms stored somewhere warm. None of these are safety failures. All of them are quality failures, and all of them would have shipped." },
      { t: "note", x: "Every one of those three examples has actually happened here, and in every case the tasting caught it before any instrument reading had moved outside its acceptable band." },

      { t: "h2", x: "How it is actually done" },
      {
        t: "ol", x: [
          "The sample is drawn from a sealed retail bottle from the batch, not from the line  the bottle and the cap are part of what is being tasted.",
          "It is brought to room temperature. Cold water suppresses almost everything you are trying to notice, which is why bad water is always served cold.",
          "Two people taste independently and write down what they find before comparing. One person tasting alone drifts; two people conferring first will agree with whoever spoke.",
          "A disagreement holds the batch. It does not average out into a pass.",
        ]
      },
      { t: "quote", x: "বিশুদ্ধতাই আমাদের মাতৃভাষা।", cite: "Purity is our mother tongue" },

      { t: "h2", x: "The point is that someone is accountable" },
      { t: "p", x: "There is a second reason for the stage, less about the palate. A process made entirely of automated checks distributes responsibility until nobody holds any of it  the readings were in range, the log was signed, and the batch that tasted wrong went out anyway because no step in the system had the standing to stop it." },
      { t: "p", x: "Stage seven gives a named person the authority to hold a batch on their own judgement, without producing a number to justify it. That authority is used a handful of times a year. Knowing it exists changes how the other six stages are run every day." },

      { t: "h2", x: "What it costs" },
      { t: "p", x: "About twenty minutes per batch, and occasionally a day of production. Both are cheap. The alternative  a customer opening a bottle and finding the faint plastic edge that we would have caught in a room in Nadia  is not." },
    ],
  },
];

// Newest first, so the pages never have to think about ordering.
export const SORTED_POSTS = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

export const getPost = (slug) => POSTS.find((p) => p.slug === slug) || null;

export const getAuthor = (post) => AUTHORS[post?.author] || AUTHORS.ananya;

/** Everything except this post, newest first  for the "keep reading" row. */
export const getRelated = (slug, n = 3) =>
  SORTED_POSTS.filter((p) => p.slug !== slug).slice(0, n);

const blockWords = (b) => {
  const text = Array.isArray(b.x) ? b.x.join(" ") : b.x || "";
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

/** Computed rather than stored, so it cannot drift out of date with an edit. */
export const readingMinutes = (post) =>
  Math.max(2, Math.round((post?.body || []).reduce((n, b) => n + blockWords(b), 0) / 210));

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
