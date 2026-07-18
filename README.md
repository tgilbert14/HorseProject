# 🐎 Horse Selector — Auction Buying & Breeding Evaluation Tool

**Live app → [tgilbert14.github.io/HorseProject](https://tgilbert14.github.io/HorseProject/)**

A standalone, browser-based decision tool for evaluating racehorses at auction or for breeding selection. No installation, no account, no server — runs entirely in your browser with data saved locally.

---

## What It Does

Buying or breeding a racehorse involves dozens of variables assessed simultaneously under time pressure. This app structures that process into a **scored, comparable, exportable record** so you never miss a red flag, overpay without a benchmark, or forget why you passed on a horse last year.

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

### 2. Conformation *(~20%)*
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
Reserve vs your market estimate generates a **Value Score** (quality ÷ price) — surfaces underpriced prospects. Consignor reputation and all-in cost tracking included.

### 7. Breeding *(weighted higher in breeding modes)*
- **Mare**: produce record, fertility, reproductive age
- **Stallion**: stud fee, book size, % winners from runners, % stakes winners, cross/nicking grade

### 8. Temperament *(~5%)*
Bold, focused horses are rated higher. Difficult temperament is a real factor in training costs and injury risk.

### 9. Foaling Date *(~5%)*
Northern Hemisphere thoroughbreds all share a universal January 1 birthday. January–March foals have a meaningful age advantage through early career.

---

## Scoring System

- Each category returns a **0–100 sub-score** based on formulas calibrated to industry benchmarks.
- Overall score = **weighted average** of populated categories (missing data is excluded, not penalized as zero).
- **Value Score** = Overall Score ÷ (reserve price / $10,000) — use "Sort: Value Score" to find quality below market price.
- Click **⚖ Weights** in the header to customize category weights per mode and save your preferences.

---

## Features

| Feature | Details |
|---|---|
| **Price sanity check** | Pick the sale (and book) your horse is in, and the app compares your reserve to that sale's **real published median** — telling you whether the price is below, within, or above the normal range for that sale. Grounded in actual market data, not a formula. |
| **Guided read** | The 5 pillars render as a live teaching checklist — *what to look at, why it matters, your current read,* and *which fields you still need* to assess each pillar. The single score is deliberately secondary. |
| **Learn from the legends** | Pick a legendary horse (Frankel, Secretariat, Winx…) and see a plain-language breakdown of *why* their page is elite — a benchmark to learn from, not a bar your prospect must clear. |
| **Plain-language glossary** | A built-in jargon buster (AEI, black-type, nick, repository, scope grade, pinhook…) written for first-time buyers. |
| **Auto-save draft** | Your in-progress horse is saved as you type and offered back on your next visit, so you never lose work. |
| **Real Horse Presets** | Load verified public-record data for 23 famous horses (Secretariat, Frankel, American Pharoah, Winx, etc.) with one click |
| **Live Scoring** | Score updates in real time as you fill the form |
| **Saved Horses** | All entries persist in browser localStorage — no account needed |
| **Side-by-Side Compare** | Select 2–4 horses; best/worst values highlighted automatically |
| **Sort & Search** | By overall score, value score, name, price, or date added |
| **CSV Export** | Full spreadsheet-ready export including all scores, ready for Excel/Sheets |
| **JSON Backup / Restore** | Full backup of all horse records |
| **Per-mode Weights** | Each evaluation mode keeps its own weight settings |
| **Selection Guide** | Built-in reference tab explaining every factor and why it matters |

---

## How to Use

1. Select your **Evaluation Mode** (top-right dropdown)
2. Optionally load a famous horse from **Quick Load Presets** to see how scoring works
3. Fill in the form — **Live Score** updates as you go
4. Click **💾 Save Horse**
5. Switch to **Saved Horses** to browse, compare, or export

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

All data is stored in your **browser's localStorage**. Nothing is sent to any server. Use **Export JSON** regularly to back up your horses — clearing browser data will erase them.

---

## Disclaimer

This tool is a structured decision aid, not a substitute for a qualified bloodstock agent and veterinarian. Always conduct an in-person inspection and independent veterinary review before bidding at auction.

**On the score:** the number is a transparent roll-up of *the data you enter* — it organizes your judgement, it does not predict racing success. No model does that reliably at the yearling stage: in published research even the single strongest signal available (the sale price itself) correlates with later race ratings at only about *r*≈0.36. Read the on-paper score as a checklist and a discussion prompt for your agent and vet, never as a forecast. The **"Data filled"** gauge shows how many of the 9 categories you've populated — it is input-completeness, not statistical confidence.

---

*Built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies, no server required.*
