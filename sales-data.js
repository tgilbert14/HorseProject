/* ============================================================
   Horse Selector — Sale price benchmarks
   --------------------------------------------------------------
   Real, published post-sale statistics for the major thoroughbred
   auctions, used by the "Price sanity check" feature to tell a buyer
   whether a reserve/price is below, within, or above the TYPICAL
   range for that sale (and book/session where published).

   IMPORTANT FRAMING (kept honest on purpose):
   - This checks whether a price is normal FOR A GIVEN SALE/BOOK. It is
     NOT a per-horse appraisal. A standout individual is worth well above
     the median; a plain one, well below. Median/average are the market's
     aggregate, not this horse's fair value.
   - `medianUSD` / `avgUSD` drive the comparison because the app's price
     fields are in USD. Non-USD sales keep their native figure + currency
     so the label can show the real amount (guineas / EUR / AUD).
   - Every figure is sourced (see `source`/`url`). Fields a sale company
     did not publish are omitted rather than guessed.

   FX (2024 averages) used for native -> USD conversion:
     1 GBP = 1.28 USD · 1 guinea = 1.05 GBP = 1.344 USD ·
     1 EUR = 1.08 USD · 1 AUD = 0.66 USD.
   Figures are the 2024 renewals unless noted. Refresh each sale season.
   ============================================================ */

const SALE_BENCHMARKS = {
  fxNote: 'Non-USD medians/averages converted at 2024 averages: 1 guinea = 1.344 USD, 1 EUR = 1.08 USD, 1 AUD = 0.66 USD.',
  updated: '2024 sales season',
  sales: [
    {
      id: 'keeneland-september-all', sale: 'Keeneland September', book: 'All books',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 70000, avgNative: 150548, medianUSD: 70000, avgUSD: 150548,
      source: 'Keeneland / TDN',
      url: 'https://www.keeneland.com/media/news/record-keeneland-september-yearling-sale-reflects-global-confidence-us-thoroughbred',
      confidence: 'high'
    },
    {
      id: 'keeneland-september-book1', sale: 'Keeneland September', book: 'Book 1',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 300000, avgNative: 394575, medianUSD: 300000, avgUSD: 394575,
      source: 'Keeneland (final press release)',
      url: 'https://www.keeneland.com/media/news/record-keeneland-september-yearling-sale-reflects-global-confidence-us-thoroughbred',
      confidence: 'high'
    },
    {
      id: 'keeneland-september-book2', sale: 'Keeneland September', book: 'Book 2',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 207500, avgNative: 262376, medianUSD: 207500, avgUSD: 262376,
      source: 'Daily Racing Form / TDN',
      url: 'https://www.drf.com/news/keeneland-september-book-2-posts-gains-average-median',
      confidence: 'high'
    },
    {
      id: 'fasig-tipton-saratoga-select', sale: 'Fasig-Tipton Saratoga Select Yearlings', book: 'All sessions',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 425000, avgNative: 533506, medianUSD: 425000, avgUSD: 533506,
      source: 'Fasig-Tipton / BloodHorse',
      url: 'https://www.bloodhorse.com/horse-racing/thoroughbred-sales/results/2024/10143/fasig-tipton-saratoga-select-yearling-sale-2024/overview',
      confidence: 'high'
    },
    {
      id: 'fasig-tipton-july-kentucky', sale: 'Fasig-Tipton Kentucky July Yearlings', book: 'All sessions',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 90000, avgNative: 112461, medianUSD: 90000, avgUSD: 112461,
      source: 'Fasig-Tipton (July Sale press release)',
      url: 'https://fasigtipton.com/2024/The-July-Sale/0709',
      confidence: 'high'
    },
    {
      id: 'obs-march-2yo', sale: 'OBS March 2-Year-Olds in Training', book: 'All sessions',
      region: 'USA', type: '2yo', year: '2024', currency: 'USD',
      medianNative: 75000, avgNative: 148742, medianUSD: 75000, avgUSD: 148742,
      source: 'OBS / Ocala-News / BloodHorse',
      url: 'https://www.ocala-news.com/2024/03/15/ocala-breeders-sale-yields-66-5-million-from-447-horses/',
      confidence: 'high'
    },
    {
      id: 'obs-spring-2yo', sale: 'OBS Spring 2-Year-Olds in Training', book: 'All sessions',
      region: 'USA', type: '2yo', year: '2024', currency: 'USD',
      medianNative: 70000, avgNative: 129679, medianUSD: 70000, avgUSD: 129679,
      source: 'OBS Sales (Spring Sale press release)',
      url: 'https://obssales.com/blog/2024/04/19/nyquist-filly-tops-spring-sale-finale/',
      confidence: 'high'
    },
    {
      id: 'keeneland-november', sale: 'Keeneland November Breeding Stock', book: 'All books',
      region: 'USA', type: 'breeding-stock', year: '2024', currency: 'USD',
      medianNative: 40000, avgNative: 91491, medianUSD: 40000, avgUSD: 91491,
      source: 'Keeneland (final press release)',
      url: 'https://www.keeneland.com/media/news/buoyant-trade-drives-strong-results-keeneland-november-breeding-stock-sale-concludes',
      confidence: 'high'
    },
    {
      id: 'tattersalls-october-all', sale: 'Tattersalls October Yearling', book: 'All books (1–4)',
      region: 'UK', type: 'yearling', year: '2024', currency: 'guineas',
      medianNative: 58000, avgNative: 144465, medianUSD: 77952, avgUSD: 194161,
      source: 'Racing Post / Tattersalls',
      url: 'https://www.racingpost.com/bloodstock/sales-reports/buyers-break-200-million-guineas-mark-as-tattersalls-hails-breathtaking-october-yearling-sale-trade-anbvC9Y7kzQq/',
      confidence: 'high'
    },
    {
      id: 'tattersalls-october-book1', sale: 'Tattersalls October Yearling', book: 'Book 1',
      region: 'UK', type: 'yearling', year: '2024', currency: 'guineas',
      medianNative: 250000, avgNative: 370501, medianUSD: 336000, avgUSD: 497953,
      source: 'Racing Post / Tattersalls / BloodHorse',
      url: 'https://www.bloodhorse.com/horse-racing/thoroughbred-sales/results/2024/10168/tattersalls-october-yearling-sale-2024-book-1/overview',
      confidence: 'medium'
    },
    {
      id: 'goffs-orby', sale: 'Goffs Orby Yearling', book: 'Orby (Book 1)',
      region: 'Ireland', type: 'yearling', year: '2024', currency: 'EUR',
      medianNative: 80000, avgNative: 128594, medianUSD: 86400, avgUSD: 138882,
      source: 'Goffs / TDN',
      url: 'https://www.thoroughbreddailynews.com/praise-for-goffs-as-135k-sioux-nation-colt-brings-curtain-down-on-orby-sale/',
      confidence: 'high'
    },
    {
      id: 'arqana-august', sale: 'Arqana August Yearling (Deauville)', book: 'All sessions',
      region: 'France', type: 'yearling', year: '2024', currency: 'EUR',
      medianNative: 140000, avgNative: 217058, medianUSD: 151200, avgUSD: 234423,
      source: 'Breednet / Arqana / BloodHorse',
      url: 'https://www.breednet.com.au/news/32265/2024-arqana-august-yearling-sale-ends-on-a-high--',
      confidence: 'high'
    },
    {
      id: 'magic-millions-gold-coast', sale: 'Magic Millions Gold Coast Yearling', book: 'All sessions (January)',
      region: 'Australia', type: 'yearling', year: '2024', currency: 'AUD',
      medianNative: 200000, avgNative: 275675, medianUSD: 132000, avgUSD: 181946,
      source: 'Magic Millions (official sale stats)',
      url: 'https://catalogue.magicmillions.com.au/salestats/24GPR/1',
      confidence: 'high'
    }
  ]
};

// Expose for both classic-script global use and any module context.
if (typeof window !== 'undefined') window.SALE_BENCHMARKS = SALE_BENCHMARKS;
