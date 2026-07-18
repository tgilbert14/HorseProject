# 🐎 Horse Selector — Auction Buying & Breeding Evaluation Tool

**Live app → [tgilbert14.github.io/HorseProject](https://tgilbert14.github.io/HorseProject/)**

A standalone, browser-based decision tool for evaluating racehorses at auction or for breeding selection. No installation, no account, no server — runs entirely in your browser with data saved locally.

---

## What It Does

Buying or breeding a racehorse means weighing dozens of variables at once, often under time pressure. Horse Selector is a plain-English **notebook that organises your judgement** — it teaches you *what to look at and why*, checks whether a price is sane against **real sale data**, surfaces red flags, and helps you manage a shortlist through a sale. It's built especially for **first-time and syndicate owners** who want to understand a horse and hold their own with an agent and vet — not to replace them.

> **It organises judgement; it does not predict winners.** See the honest note under [Scoring System](#scoring-system) and the [Disclaimer](#disclaimer).

### Evaluation Modes
| Mode | Use Case |
|---|---|
| **Auction Buy** | Score a yearling, weanling, or racing prospect before bidding |
| **Breeding — Mare** | Evaluate a mare's produce record, fertility, and pedigree for pairing |
| **Breeding — Stallion** | Compare stallions by fee, progeny stats, and nick with your mares |

---

## Factors Scored

The app models **9 weighted categories**, each backed by bloodstock research:

### 1. Pedigree *(default ~30% of score)*
The single most predictive factor at the yearling stage.
- **Sire AEI / CI** — Average Earnings Index measures progeny earnings vs the average thoroughbred. Elite sires consistently exceed 2.0.
- **Dam produce record** — Number of winners and black-type (stakes) horses from foals. A productive dam statistically outweighs her own race record.
- **Black-type proximity** — Italicized/bolded names in the sales catalogue. Closer up = stronger.
- **Nicking grade** — Statistical compatibility of sire line × broodmare sire line (A+ nicks produce disproportionate stakes winners).
- **Dosage Index** — Speed-vs-stamina balance derived from chef-de-race ancestors. ~2–4 = speed bias, <1 = stamina/turf.
- **Inbreeding coefficient** — Light linebreeding (3×4, 4×4) to superior ancestors can concentrate quality; >6% raises risk.

### 2. Conformation *(~22%)*
Rate 10 structural traits on a 1–10 scale:
Balance, shoulder angle, hindquarter, cannon bone, knees, pasterns, hooves, neck, topline, and walk quality. Walk is weighted most heavily — a free, overstepping walk strongly correlates with athletic ability.

### 3. Veterinary *(~15%)*
- Repository X-rays (OCD lesions, chips, sesamoid abnormalities)
- Throat scope (laryngeal grade — Grade III/IV = roaring risk)
- Heart/cardio, wind/breathing, eyes

### 4. Physical Metrics *(~5%)*
Height (hands), weight, heart girth, cannon bone circumference — scored against breed-appropriate ideal ranges.

### 5. Performance *(~8%, raced horses)*
Starts/wins/places, total earnings, best speed figure (Beyer/Timeform), highest class won, soundness history.

### 6. Auction / Price *(~10%)*
Reserve, your market estimate, consignor reputation, and all-in cost. For value, the app's **price sanity check** compares your reserve to the *real published median* for the sale/book you pick (13 sales) — a grounded read on whether the price is normal for that sale (the older quality ÷ price "Value Score" is kept only as a rough sort).

### 7. Breeding *(weighted higher in breeding modes)*
- **Mare**: produce record, fertility, reproductive age
- **Stallion**: stud fee, book size, % winners from runners, % stakes winners, cross/nicking grade

### 8. Temperament *(~5%)*
Bold, focused horses are rated higher. Difficult temperament is a real factor in training costs and injury risk.

### 9. Foaling Date *(~5%)*
Northern Hemisphere thoroughbreds all share a universal January 1 birthday. January–March foals have a meaningful age advantage through early career.

---

## Scoring System

- Each category returns a **0–100 sub-score** from hand-tuned formulas anchored to industry benchmarks. They are **not** statistically calibrated to real race or sale outcomes — treat the score as a structured summary of *your inputs*, not a prediction (see [Disclaimer](#disclaimer)).
- Overall score = **weighted average** of the categories you populated (blank categories are excluded, not counted as zero).
- **Guided read (recommended).** The form leads with a 5-pillar teaching checklist — *what to look at, why it matters, your current read,* and *which fields you still need* — with the single number kept deliberately secondary.
- **Price sanity check (recommended for value).** Pick the sale/book a horse is in and the app compares your reserve to that sale's **real published median** (13 sales/books) — is the price below, within, or above normal *for that sale*? This is the grounded way to judge value.
- **Value Score** = Overall Score ÷ (reserve ÷ $10,000) is a rough quality-per-dollar ratio kept only for the "Sort: Value Score" option; it structurally favours cheaper horses, so prefer the price sanity check.
- Click **⚖ Weights** in the header to customise category weights per mode.

---

## Features

| Feature | Details |
|---|---|
| **Price sanity check** | Pick the sale (and book) your horse is in, and the app compares your reserve to that sale's **real published median** — telling you whether the price is below, within, or above the normal range for that sale. Grounded in actual market data (13 sales/books), not a formula. |
| **Due-diligence report** | One click generates a clean, printable *"bring this to your agent & vet"* summary — the on-paper read, the five pillars, red flags, the price check, and a pre-bid checklist. Print, Save-as-PDF, or **copy a shareable link** that opens the report for whoever you send it to (no account, data rides in the link). |
| **New-owner onboarding** | A first-run welcome orients newcomers; the whole app is keyboard-accessible with focus-managed dialogs and respects your light/dark system preference. |
| **Guided read** | The 5 pillars render as a live teaching checklist — *what to look at, why it matters, your current read,* and *which fields you still need* to assess each pillar. The single score is deliberately secondary. |
| **Learn from the legends** | Pick a legendary horse (Frankel, Secretariat, Winx…) and see a plain-language breakdown of *why* their page is elite — a benchmark to learn from, not a bar your prospect must clear. |
| **Plain-language glossary** | A built-in jargon buster (AEI, black-type, nick, repository, scope grade, pinhook…) written for first-time buyers. |
| **Auto-save draft** | Your in-progress horse is saved as you type and offered back on your next visit, so you never lose work. |
| **Real Horse Presets** | Load verified public-record data for 23 famous horses (Secretariat, Frankel, American Pharoah, Winx, etc.) with one click |
| **Live Scoring** | Score updates in real time as you fill the form |
| **Saved Horses** | All entries persist in browser localStorage — no account needed |
| **Side-by-Side Compare** | Select 2–4 horses; a **5-pillar radar chart** shows each horse's shape at a glance, plus a full field-by-field table with best/worst highlighting |
| **Sale management** | Tag each horse **Watching / Shortlist / Passed / Bought**, filter by status, and see a live overview (how many are buy-leaning, shortlisted, etc.) |
| **Sale-day shortlist** | One compact, **printable / CSV** table of your saved horses — hip, pedigree, score, read, price-vs-sale, red flags, status — built for the ring |
| **Bulk add** | Paste a list from a catalogue (`Name, Sire, Dam, Reserve` per line) to create many horses at once |
| **Sort & Search** | By overall score, value score, name, price, or date added |
| **CSV Export** | Full spreadsheet-ready export including all scores, ready for Excel/Sheets |
| **JSON Backup / Restore** | Full backup of all horse records |
| **Per-mode Weights** | Each evaluation mode keeps its own weight settings |
| **Selection Guide** | Built-in reference tab explaining every factor and why it matters |

---

## How to Use

1. **New here?** Load a legend (try Frankel) and read *Learn from the legends* to see what an elite page looks like.
2. Pick your **Evaluation Mode** (top-right) and either load a preset or click **Enter your own horse**.
3. Fill in what you know — the **Guided read** checklist shows what to look at and what's still missing, and the **price sanity check** tells you if the reserve is sane for the sale.
4. Click **💾 Save Horse** (your draft auto-saves as you type, so you won't lose work).
5. In **Saved Horses**, set a status (Watching / Shortlist / Passed / Bought), **Compare** horses on the radar, or open a horse's **Report** to print or send a due-diligence sheet to your agent & vet.
6. Before the ring, hit **🖨 Shortlist** for a compact printable / CSV list of everything you're tracking.

---

## Preset Horses Included

All preset data uses **public-record sources only**: Jockey Club, Weatherbys, Equibase, Racing Post, BHA, and publicly advertised stud farm fee schedules. Conformation, vet findings, and temperament are intentionally blank in presets — those require in-person evaluation.

| Horse | Notable For |
|---|---|
| Secretariat | 1973 Triple Crown; Belmont by 31 lengths (record still stands) |
| American Pharoah | 2015 Triple Crown + Breeders' Cup (Grand Slam) |
| Justify | 2018 Triple Crown, undefeated in 6 starts |
| Frankel | Undefeated 14 starts; highest Timeform rating ever (147) |
| Zenyatta | 19 of 20 wins; only mare to win BC Classic; bought for $60k |
| Flightline | Beyer 124 (2022 BC Classic) — highest in over 20 years |
| Arrogate | World-record earnings $17.4M; Travers Beyer 122 |
| California Chrome | Bought for $8,000; won Kentucky Derby & Preakness |
| Cigar | 16-race win streak (1994–96); two-time US Horse of the Year |
| Galileo | Champion sire 12× in GB/Ireland; sired Frankel |
| Dubawi | Stud fee £250,000 (2024); dominant international sire |
| Northern Dancer | Most influential sire of the 20th century |
| Into Mischief | Leading North American sire multiple years; $250k fee |
| Curlin | Career-best Beyer 117; $10.5M earnings (then US record) |
| Tapit | Three-time NA leading sire by earnings |
| Storm Cat | $500,000 stud fee (2001 NA record) |
| A.P. Indy | Sold for $2.9M as yearling (world record); sire of Pulpit, Malibu Moon |
| War Front | Claiborne's flagship; dominant European turf influence |
| Medaglia d'Oro | Sire of Rachel Alexandra, Songbird |
| Winx | 33-race win streak (world record); 25 G1s; world-record earnings |
| Black Caviar | Undefeated 25-from-25; world's best sprinter |
| Enable | 14 G1s including 2× Prix de l'Arc de Triomphe |
| Rachel Alexandra | 2009 Horse of the Year; first filly to beat colts in Preakness in 30 years |

---

## Data Storage

All data is stored in your **browser's localStorage**. Nothing is sent to any server. Use **Export JSON** regularly to back up your horses — clearing browser data will erase them. (The app warns you if a save fails and nudges you when your data is newer than your last backup.)

---

## Project Docs

- **[Viability & roadmap](docs/VIABILITY.md)** — the research-backed product assessment (market, users, competitors, methodology) that shaped this app's direction, plus the phased build log.
- **[User validation kit](docs/USER-VALIDATION.md)** — a ready-to-run plan to test the app with real first-time / syndicate owners, with a printable **[field pack](docs/user-validation-field-pack.pdf)** (moderator sheet, per-participant log, survey).

---

## Disclaimer

This tool is a structured decision aid, not a substitute for a qualified bloodstock agent and veterinarian. Always conduct an in-person inspection and independent veterinary review before bidding at auction.

**On the score:** the number is a transparent roll-up of *the data you enter* — it organizes your judgement, it does not predict racing success. No model does that reliably at the yearling stage: in published research even the single strongest signal available (the sale price itself) correlates with later race ratings at only about *r*≈0.36. Read the on-paper score as a checklist and a discussion prompt for your agent and vet, never as a forecast. The **"Data filled"** gauge shows how many of the 9 categories you've populated — it is input-completeness, not statistical confidence.

---

*Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, no server required.*
