# Horse Selector — Viability Assessment & Roadmap

*Prepared July 2026 · a research-backed answer to one question:*
**"Can this become an app people would actually want to use?"**

---

## TL;DR

**Verdict: YES — but only with a deliberate pivot.** Three independent adversarial
reviews (a skeptical investor, a working bloodstock buyer, and a contrarian bull)
converged on the same call with high confidence: **viable-with-pivot.**

- **As built** — a thoroughbred-specific, uncalibrated **BUY / PASS "oracle"** aimed at
  professionals under sale-ring time pressure — it **fails.** Two structural reasons:
  **no willing-to-pay market** and **no moat.**
- **What works** is a hard turn in positioning: from *"an algorithm that out-picks the
  pros"* to a **free, transparent, mobile-first education & due-diligence notebook** for
  the **bottom of the ownership pyramid** — first-time small owners and syndicate /
  micro-share members. That is the one segment incumbents ignore, and the only one growing.
- **This is a great free tool / education funnel — not a venture-scale business.** The
  total market is too small and shrinking for that. Build it for love and usefulness (and
  maybe a modest funnel), not for a fundraise.

The good news: the app is **competently engineered**, its **category taxonomy is
domain-correct**, and its **famous-horse presets are a genuinely novel teaching asset**.
The pivot is mostly *positioning and trust*, not a rebuild.

---

## 1. What the app is today

A single-page vanilla-JS PWA (no backend, GitHub Pages, `localStorage`) that scores a
racehorse for **auction buying** or **breeding** across nine weighted categories, rolls
them into a **0–100 score + 5-pillar breakdown (Genetics / Soundness / Performance /
Value / Mind) + a BUY/SHORTLIST/PASS verdict + a "confidence %"**, benchmarks against
**23 famous-horse presets**, and supports compare / CSV-JSON export / custom weights.

It is polished (racing-green & parchment themes, live scoring, service worker) and the
bones are solid. The problem was never the engineering — it's **who it's for and what it
claims.**

---

## 2. The verdict, in one table

| Lens | Verdict | Confidence | One-line takeaway |
|---|---|---|---|
| Skeptical investor | viable-with-pivot | High | "Narrow-and-build as a free tool; kill the fundable-venture ambition." |
| Working buyer / novice owner | viable-with-pivot | High | "Ship it, but reframe from oracle to notebook; aim at the novice, not the pro." |
| Contrarian bull | viable-with-pivot | Medium | "Real uncontested white space, but the value is organization & education, not prediction." |

All three independently reached **viable-with-pivot.** That convergence — from a bull, a
bear, and a domain user — is the strongest signal in this report.

---

## 3. Market reality: small, concentrated, shrinking — with one growth pocket

The thoroughbred bloodstock market is **real but structurally small and in long-term
decline**, and spend is heavily concentrated at the top.

| Metric | Figure | Source |
|---|---|---|
| Global thoroughbred auction turnover | ~**$3–3.5B/yr** (~$4B incl. private, strong year) | racing² / EquerryCo (2024) |
| North American auctions, all sales | **$1.28B across 14,303 head** | BloodHorse / TrueNicks "State of the Market" (2024) |
| Keeneland September (largest sale) | $427.8M (2024) → **$531.5M record** (2025) | Keeneland |
| …but concentrated in | ~**120 buying entities spending $1M+**; top buyer 33 horses/$14.2M | Keeneland (2025) |
| US registered foal crop | **~17,700, down 2.4% YoY** (down ~3.4% projected 2025); ~half of the late-1980s | The Jockey Club / TDN |
| US pari-mutuel handle | **$11.27B, down 3.35%** — falling every year since 2021 | BloodHorse |
| **Micro-ownership (the growth story)** | MyRacehorse **50,000+ owners** since 2018; shares from ~$100 | MyRacehorse / BloodHorse |

**What this means for the app:**

- The *willing-to-pay* audience for a thoroughbred evaluation tool is **a few thousand
  people globally**, with real money concentrated in ~100–150 professional operations that
  already employ agents, vets, and validated data services — **the least likely** to adopt
  a free heuristic PWA. This is a niche, not a market.
- The core is **shrinking** (foal crop, owners, wagering all declining). Building for
  thoroughbred bloodstock means targeting a *contracting* base.
- The **one growing segment — micro-ownership** — is where the reachable, motivated users
  are. But note the catch (Section 4): those members don't currently make sale-ring picks.
- The much larger adjacent TAM (US sport/recreation horses: **6.7M horses, $177B economic
  impact, ~2.7M show horses**) exists, but the app's entire engine (AEI, dosage, nicks,
  black-type, Beyer) is thoroughbred-racing-specific and **does not transfer** without a
  new scoring model. That is a *different app*, not an expansion.

---

## 4. Who actually wants this

**No professional segment reduces a horse to a single composite score.** Pros triangulate
the catalogue page, repository x-rays read by *their own* vet, repeated barn visits
watching the walk ("the eye"), agent-network intelligence, and live comparable prices with
a disciplined bid ceiling — weighted *holistically and re-weighted per horse*. A
fixed-weight 0–100 number contradicts how expert judgement actually works, and an
uncalibrated one is the fastest way to lose their trust.

**The "older user hand-entering ~40 fields at the sale ring under time pressure" persona is
fiction.** The per-horse decision window is seconds to a couple of minutes; buyers use a
pen-annotated paper catalogue, on-site repository terminals, and their phone for live
pedigree and bidding. Nobody fills a long web form while a horse is in the ring. The app's
natural home is **pre-sale prep** (the night before) and **barn-side note capture**.

**The genuinely underserved, emotionally motivated segment is the bottom of the pyramid:**
first-time / small owners and syndicate / micro-share members. Fractional platforms pulled
in tens of thousands of novices with disposable money but **zero evaluation literacy** —
and first-owner guides literally tell them *"you can't do this alone, bring a vet/agent."*
That is textbook unmet demand for **education and confidence**.

> **The target user is the aspiring small owner / new syndicate principal** — real money,
> emotional pull, feels out of their depth. **The job to nail:** *"Give me a trustworthy,
> structured way to understand a yearling's page, its red flags, and whether the price is
> sane, so I can hold my own with my agent and vet and not make a costly mistake."*
> Sell **education and confidence**, not a BUY/PASS verdict.

One honest caveat (a real risk, Section 10): many novices *defer the buying decision
entirely* to an agent or buy a pre-assembled share. So the job is less "should I bid on
this yearling?" and more **"help me understand and pressure-test a horse someone is
proposing to me"** — and learn enough to graduate.

---

## 5. Competitive landscape: the data side is owned; the decision side is empty

The market is **mature on data and nearly empty on the decision layer** — which is exactly
where Horse Selector sits.

| Category | Incumbents | Pricing | Why it matters |
|---|---|---|---|
| Pedigree / nicking | **Equineline** (Jockey Club data), **TrueNicks**, **Werk / eNicks** | Equineline ~$249/yr; TrueNicks ~**$1.50/hip**, ~$199 broodmare; eNicks free for enrolled sires | Outcome-calibrated letter grades recomputed daily vs real stakes winners. The genetics pillar is **duplicative**. |
| Performance | **Brisnet / BRIS**, **Equibase**, **Racing Post** | Freemium → per-card | Empirically-derived Beyer/BRIS speed & class figures. |
| Veterinary | **Keeneland / Fasig-Tipton / Tattersalls repositories** | Free to buyers' *own vet* only | X-rays/scopes are **legally gated** — no third-party app can ever source or verify them. |
| Conformation / soundness | **Sleip AI** (markerless gait, ~2mm asymmetry), **Stride SAFE** | SaaS | Objective, lab-validated numbers make 1–10 sliders look crude. |
| Genomics | **Etalon** (~$149–379), **Plusvital / Zinto** speed gene | Per-test | Objective aptitude/temperament markers. |
| Ownership funnel | **MyRacehorse** | Shares from ~$100 | Owns the app's *ideal user* — but leaves them with no evaluation tools. |
| The real incumbent | **Spreadsheets + annotated paper catalogues** | Free | Flexible, familiar, offline. This is what the app must beat on *speed and structure*. |

**The white space is genuine but thin:** *no one* packages genetics + soundness +
performance + value + temperament into one organized, plain-language, free, offline,
phone-native view for a non-expert. Every incumbent is a **paid, jargon-heavy,
single-vertical, desktop-era silo.**

**But "free" is not a moat** (TrueNicks is ~$1.50/hip; a 5-cross pedigree is free), and the
app has **no proprietary data**. Its only defensible role is as an **organizer / teacher /
aggregator that sits *on top of* the paid data** — never a rival data source.

---

## 6. The credibility problem — the score framing is the core liability

A skeptical equine-science review read the full scoring engine and grounded it against the
literature. The **category choices are sound**; the **scoring is the problem.**

- **No score predicts a racehorse at the yearling stage.** The single best signal available
  — the *sale price itself*, which already bakes in every agent's and vet's opinion —
  correlates with later race ratings at only **r ≈ 0.36 (~13% of variance)** (1,735-yearling
  Timeform study). Racing ability is only weakly heritable (earnings-based measures like AEI
  often <0.25, some <0.10). **A hand-built score cannot beat that ceiling** — yet the app
  emits a crisp **BUY ≥ 80 / PASS < 68** as if the boundary were meaningful.
- **The "confidence %" was a filled-field counter** — `directSignals/9`, floored at 20% —
  *mislabeled as statistical confidence.* Filling more fields raised "confidence" even if
  every value was a guess. *(Fixed in this PR — see Phase 0.)*
- **The "Value Score" (`score ÷ price`) is circular** — because price is the denominator,
  the **cheaper** of two similar horses always wins. It has no anchor to comparable sales or
  a fair-price estimate, so it is not value analysis.
- **Dosage collapsed to 75-or-50** (nearly every horse falls in-range → no discrimination).
- **The auction sub-score rewards wishful pricing** — `marketEst / reserve`, both
  user-supplied and unverifiable.
- **Nothing is calibrated.** The presets scoring high (Secretariat, Frankel) is *circular
  back-fitting* on their elite race records, not predictive validation.

**Where the app is genuinely fine and should be kept:** the taxonomy
(genetics/soundness/performance/value/mind) mirrors how pros think; log-scaling earnings &
stud fees is correct; win/place-rate and Beyer scaling are reasonable; and the **vet HARD
STOP** override on a serious repository finding is good practice.

> **The honest reframe:** stop *predicting*, start *organizing judgement.* Replace the point
> score's authority with a transparent, weighted **checklist** explicitly labeled *"this
> reflects the data you entered, not a probability of racing success."* Keep the 5-pillar
> breakdown as a teaching aid; demote the composite BUY/PASS boundary to a discussion prompt.

---

## 7. Technical & UX audit (this repo)

Concrete issues found by reading the source:

- **Correctness — the "slider at 1 = untouched" hack** *(fixed in this PR).* Any
  conformation/walk slider set to **1** (which the app's *own* rubric defines as "major
  structural concerns") was silently **discarded** as if unrated — you literally could not
  record the worst score — and untouched sliders leaked a phantom mid-range value into the
  score on first load. Now tracked with an explicit touched-state flag; **1 is a valid
  rating** and untouched sliders are ignored.
- **Documentation / feature drift** *(fixed in this PR).* The README and in-app Guide
  described a "Simple mode toggle," "Strict verified mode," and "Auction fast entry" that
  exist only as **dead CSS** (`btnSimpleMode`, `btnAuctionFast`, `score-mode-row`);
  `currentScoreMode()` is hardcoded. Removed dead CSS and corrected the docs.
- **Offline / privacy — 18 hotlinked external image domains** for preset photos. The
  service worker caches **only same-origin** assets, so these **break offline**, will rot
  over time (one is a `gstatic.com` thumbnail that will 404), and leak referrer data.
  *Mitigated in this PR* with `referrerpolicy="no-referrer"`; the durable fix (bundling
  compressed local images) is Phase 1.
- **Data durability — `localStorage` only.** No accounts, no sync, no server backup. A
  cleared browser or a new device wipes every saved horse. For anyone tracking a real
  shortlist across a sale, this is a **trust and retention risk.**
- **Data-entry burden.** ~40 fields to fully score one horse — many of them numbers that
  already live in a TrueNicks / Equineline / Brisnet report the user is holding. This is the
  friction most likely to make even the *right* user abandon a shortlist.

*Note: the deeper scoring re-architecture (Section 6) is intentionally deferred to the
roadmap — it's a product decision for the owner, not a silent rewrite.*

---

## 8. The pivot: from *oracle* to *notebook*

| | **From (fails)** | **To (works)** |
|---|---|---|
| **User** | Professional bloodstock agent; "old-timer at the ring" | First-time small owner / syndicate member |
| **Job** | "Tell me whether to bid" | "Help me understand a horse & hold my own" |
| **Output** | BUY / PASS verdict + confidence % | Transparent checklist + learning + price sanity |
| **Claim** | "Beats the pros' judgement" | "Organizes *your* judgement; avoids a costly mistake" |
| **Moment** | Live in the sale ring | Pre-sale prep + barn-side notes |
| **Moat** | (none — duplicates paid data) | UX, plain language, presets, cross-pillar consolidation |
| **Money** | Direct subscription (won't happen) | Free habit → confidence-based value & distribution deals |

---

## 9. Roadmap

### Phase 0 — Credibility pass ✅ *(shipped in this PR)*
Cheap, unambiguous trust fixes that move the app toward "wantable" regardless of direction:
- Renamed **"confidence %" → "Data filled (X/9 categories)"**; removed the misleading 20%
  floor and the implication of predictive reliability.
- Reframed the hero from a verdict to an **"on-paper read"** with an honest disclaimer;
  added a **"How to read the score honestly"** section (the r≈0.36 ceiling, the Value Score
  caveat, presets-as-learning) to the Guide and README.
- **Fixed the slider-1 correctness bug** (browser-verified: Walk=1 → conformation 0; Walk=10
  → 100; untouched sliders ignored).
- Removed dead CSS + corrected doc/feature drift; added image `referrerpolicy`; fixed the
  preset count (22 → 23); bumped version + SW cache.

### Phase 1 — Novice education MVP *(the pivot proper)* — ✅ largely shipped
- ✅ **Guided read:** the 5 pillars now render as a **teaching checklist** ("what to look
  at, why it matters, your read, and which fields you still need"), with a **"· limited
  data"** flag when a strong-looking read rests on very few inputs. The single number is
  demoted to a small, clearly-labeled "on-paper read."
- ✅ **Learn from the legends:** presets became an interactive, annotated *"why this page is
  elite"* experience — explicitly framed as a benchmark to learn from, **not** a bar the
  user's horse must clear (the old leaderboard that ranked a live horse next to Frankel is gone).
- ✅ **Auto-save draft** so a first-time buyer never loses work; ✅ **plain-language glossary**
  (24 terms) for the jargon.
- ✅ **Offline-safe images:** failed/offline preset photos now fall back to tasteful
  coat-coloured portrait placeholders (initials on the horse's coat colour) instead of a bare
  emoji or a broken image. *(True bundling of licensed local image files remains a follow-up.)*

### Phase 2 — Trust & the one defensible feature
- ✅ **Real price-sanity check — shipped.** A log-scale gauge + below/within/above bands
  compare the user's reserve to a sale's **real published median** ("is this price normal
  *for this sale*?", explicitly not a per-horse appraisal). Grounded in a **sourced dataset
  of 13 sales/books** (`sales-data.js`): Keeneland September (overall + Book 1 + Book 2),
  Keeneland November, Fasig-Tipton Saratoga & July, OBS March & Spring, Tattersalls October
  (overall + Book 1), Goffs Orby, Arqana August, Magic Millions — 2024 figures with citations
  and native-currency support (guineas / EUR / AUD). The book-level data is the teaching
  payload: a $70k price is "typical" for Keeneland September overall but "well below typical"
  for Book 1. This is the single differentiator worth a thin data feed.
- ✅ **Ingest, not recompute:** the pedigree and performance cards now tell the user to
  *record what their calibrated provider says* — paste the AEI from equineline, the nick grade
  from TrueNicks/eNicks, the Beyer from Brisnet/Equibase — framing the app as an organiser on
  top of the paid data, not a rival to it.
- ✅ **Durable storage (client-side):** an explicit *"your horses live only in this browser"*
  warning, a JSON-backup timestamp indicator, and a nudge when your data is newer than your
  last backup. *(A true cloud account / cross-device sync needs a backend and is out of scope
  for the static PWA — see Phase 3.)*

### Phase 3 — Distribution & (modest) monetization
- ✅ **The shareable "bring this to your agent/vet" report — shipped.** One click generates a
  clean, printable due-diligence summary (on-paper read, five pillars, red flags, price sanity,
  and a pre-bid checklist) — the confidence artifact the monetization thesis rests on.
- ⏳ Distribution through the **one growing channel**: partner with / embed in syndicate &
  micro-ownership platforms and first-owner education funnels (organic discovery of a free niche
  PWA is near-zero). *(Go-to-market, not code.)*
- ⏳ Optional cloud account / cross-device sync + guided vetting of a *specific proposed
  syndicate share*. Frame every paid step as *"avoid a five-figure mistake,"* never *"win with
  our algorithm."*

### Shipped since (follow-up iterations)
Beyond the phased plan above, later passes added: a **shareable report link** (send the
due-diligence sheet with no backend), **toast** notifications, **accessibility** (focus-managed
dialogs, OS-theme preference), a **first-run welcome**, storage-failure handling, and a
**sale-management** layer — per-horse status (Watching / Shortlist / Passed / Bought) with a
filter and overview, a 5-pillar **compare radar**, a printable/CSV **sale-day shortlist**, and
**bulk add** from a catalogue paste. All browser-verified. The deferred items remain the
backend-dependent ones (cloud sync) and go-to-market (distribution).

---

## 10. What NOT to do

- **Don't chase professionals with "analytics."** Without a calibrated data feed you cannot
  beat TrueNicks / EquinEdge and will be dismissed for false precision on sight.
- **Don't market a "confidence %" on admittedly un-validated math.** It collapses trust the
  moment a knowledgeable user traces it.
- **Don't build for the sale-ring-live-bidding moment.** Nobody fills forms while a horse is
  in the ring.
- **Don't expand into the broad sport-horse market** hoping for the bigger TAM — it requires
  abandoning the entire thoroughbred-specific engine. Prove the novice wedge first.
- **Don't raise money against this.** The TAM doesn't support a venture-scale outcome under
  any realistic scenario.

---

## 11. Honest bottom line

**Can this be an app people actually want? Yes — for the right people, framed the right
way.** A free, transparent, mobile-first **learning-and-due-diligence notebook** for
first-time owners and syndicate members fills a real, uncontested gap that every paid
incumbent ignores, and it plays to the app's genuine strengths: a sound taxonomy, clean
engineering, and the delightfully novel famous-horse presets.

What it **cannot** be is a BUY/PASS oracle for professionals or a venture-scale business.
The market is too small and shrinking, the pros won't trust hand-authored formulas, and the
novices who'd love it won't pay much. Treat it as a **sustainably useful free product and a
possible funnel** — build it for the person who feels lost holding a $100 share and a
dream, and give them the confidence to hold their own. That version is very much worth
building.

---

### Appendix — key sources
Keeneland; BloodHorse / TrueNicks "State of the Market"; The Jockey Club & TDN foal-crop
data; MyRacehorse; American Horse Council 2023 Economic Impact Study; Equineline, TrueNicks,
Werk/eNicks, Brisnet, Equibase pricing pages; Keeneland/Fasig-Tipton/Tattersalls repository
docs; Sleip AI & Stride SAFE; Etalon & Plusvital; Cambridge Core *Comparative Exercise
Physiology* (yearling price vs Timeform, r=0.363); PubMed heritability studies (25393770,
15920096); Kentucky Equine Research & BloodHorse on conformation-vs-performance.

*Full research corpus (8-agent market / user / competitor / domain / adversarial workflow)
on file with this branch.*
