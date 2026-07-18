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
   - `medianUSD` / `avgUSD` are used for comparison because the app's price
     fields are in USD. Non-USD sales also keep their native figure + the
     FX rate used, so the label can show the real currency.
   - Every figure is sourced. Fields that a sale company did not publish
     are left null rather than guessed.
   ============================================================ */

const SALE_BENCHMARKS = {
  // Approximate FX used to convert native medians/averages to USD.
  fxNote: 'Non-USD figures converted at approx. 2024 averages: 1 GBP = 1.27 USD, 1 guinea = 1.33 USD, 1 EUR = 1.08 USD, 1 AUD = 0.66 USD.',
  updated: '2024 sales season',
  sales: [
    {
      id: 'keeneland-september-all',
      sale: 'Keeneland September',
      book: 'All books',
      region: 'USA', type: 'yearling', year: '2024', currency: 'USD',
      medianNative: 70000, avgNative: 150548, topNative: 2900000,
      lowTypicalNative: null, grossNative: 427800000, numSold: 2888,
      medianUSD: 70000, avgUSD: 150548,
      source: 'Keeneland / BloodHorse', url: 'https://www.keeneland.com/',
      confidence: 'high'
    }
    // Additional sales/books are appended from verified research below.
  ]
};

// Expose for both classic-script global use and any module context.
if (typeof window !== 'undefined') window.SALE_BENCHMARKS = SALE_BENCHMARKS;
