/* ============================================================
   Horse Selector — Preset dataset
   --------------------------------------------------------------
   All entries below use PUBLIC-RECORD data only:
     - Pedigree, foaling date, sex, country: official stud books
       (Jockey Club, Weatherbys, Coolmore/Darley public listings)
     - Race record (starts/wins/places/earnings): Equibase, BHA,
       Racing Post historical archives
     - Highest Beyer Speed Figure: Daily Racing Form / NYRA records
       (only horses that raced in the Beyer era, post-1991, are populated)
     - Stud fees: publicly advertised farm fee schedules for the
       most recently published season
     - Sire AEI, dam produce counts: Equineline / Bloodhorse archives
   --------------------------------------------------------------
   Conformation ratings, vet findings, and temperament are NOT
   publicly available for individual horses. Those fields are left
   blank — the user supplies them from their own inspection.
   ============================================================ */

const HORSE_PRESETS = [

  /* ---------------- TRIPLE CROWN / CHAMPIONS ---------------- */

  {
    name: 'Secretariat',
    sex: 'Stallion',
    foalDate: '1970-03-30',
    color: 'Chestnut',
    country: 'USA',
    consignor: 'Meadow Stable (bred)',
    venue: 'Not sold at auction (homebred)',

    sire: 'Bold Ruler',
    dam: 'Somethingroyal',
    damsire: 'Princequillo',
    blackType3: 3,           // G1 family

    pStarts: 21, pWins: 16, pPlaces: 3,
    pEarnings: 1316808,
    pClass: 5,               // G1 winner (Triple Crown)
    pSound: 2,               // raced sound
    notes: '1973 US Triple Crown winner. Belmont Stakes by 31 lengths in track-record 2:24 (still standing). Pre-Beyer era — speed figure not populated.'
  },

  {
    name: 'American Pharoah',
    sex: 'Stallion',
    foalDate: '2012-02-02',
    color: 'Bay',
    country: 'USA',
    consignor: 'Zayat Stables (bred)',
    venue: 'Fasig-Tipton Saratoga 2013 (RNA $300k)',

    sire: 'Pioneerof the Nile',
    dam: 'Littleprincessemma',
    damsire: 'Yankee Gentleman',
    blackType3: 3,
    sireFee: 60000,          // Pioneerof the Nile fee at time of mating

    pStarts: 11, pWins: 9, pPlaces: 1,
    pEarnings: 8650300,
    pSpeed: 105,             // career-best Beyer (Haskell)
    pClass: 5, pSound: 2,

    bStudFee: 200000,        // Coolmore Ashford 2024
    bProven: 2,
    notes: '2015 US Triple Crown + Breeders\' Cup Classic (Grand Slam). Now standing at Coolmore America (Ashford Stud).'
  },

  {
    name: 'Justify',
    sex: 'Stallion',
    foalDate: '2015-03-28',
    color: 'Chestnut',
    country: 'USA',
    consignor: 'John Gunther (bred)',
    venue: 'Keeneland September 2016 ($500,000)',

    sire: 'Scat Daddy',
    dam: 'Stage Magic',
    damsire: 'Ghostzapper',
    blackType3: 2,
    sireFee: 35000,          // Scat Daddy final advertised fee

    pStarts: 6, pWins: 6, pPlaces: 0,
    pEarnings: 3798000,
    pSpeed: 107,             // career-best Beyer (Belmont)
    pClass: 5, pSound: 2,

    aReserve: 500000,        // hammer price as yearling
    aConsignor: 2,

    bStudFee: 250000,        // Coolmore Ashford 2024
    bProven: 1,              // first crops on track
    notes: '2018 US Triple Crown, undefeated. Sold for $500k as a yearling at Keeneland September.'
  },

  {
    name: 'Frankel',
    sex: 'Stallion',
    foalDate: '2008-02-11',
    color: 'Bay',
    country: 'GB',
    consignor: 'Juddmonte Farms (bred)',
    venue: 'Not sold at auction (homebred)',

    sire: 'Galileo',
    dam: 'Kind',
    damsire: 'Danehill',
    blackType3: 3,

    pStarts: 14, pWins: 14, pPlaces: 0,
    pEarnings: 4789144,      // GBP converted approx — public Racing Post record
    pClass: 5, pSound: 2,
    notes: 'Undefeated in 14 starts. Highest Timeform rating ever assigned (147). Now at Banstead Manor Stud, Juddmonte. UK stud fee: £275,000 (2024).',

    bStudFee: 350000,        // approximate USD conversion of £275k
    bProven: 2
  },

  {
    name: 'Zenyatta',
    sex: 'Mare',
    foalDate: '2004-04-01',
    color: 'Bay',
    country: 'USA',
    consignor: 'Maverick Production',
    venue: 'Keeneland September 2005 ($60,000)',

    sire: 'Street Cry',
    dam: 'Vertigineux',
    damsire: 'Kris S.',
    blackType3: 2,

    pStarts: 20, pWins: 19, pPlaces: 1,
    pEarnings: 7304580,
    pSpeed: 112,             // career-best Beyer (BC Classic 2009)
    pClass: 5, pSound: 2,

    aReserve: 60000,
    aConsignor: 1,

    bMareAge: 22,            // born 2004
    notes: 'Won 19 of 20 starts. 2009 Breeders\' Cup Classic (only mare to do so). Bought for $60k as yearling — one of the great auction bargains.'
  },

  {
    name: 'Galileo',
    sex: 'Stallion',
    foalDate: '1998-03-30',
    color: 'Bay',
    country: 'IRE',
    consignor: 'David Tsui / Coolmore (bred)',
    venue: 'Not sold publicly',

    sire: "Sadler's Wells",
    dam: 'Urban Sea',
    damsire: 'Miswaki',
    blackType3: 3,

    pStarts: 8, pWins: 6, pPlaces: 1,
    pEarnings: 1572188,
    pClass: 5, pSound: 2,

    bProven: 2,
    bPctSW: 18.5,            // approx lifetime stakes-winners-to-runners %
    notes: 'Champion sire of Great Britain & Ireland 12 times. Sired Frankel, Nathaniel, New Approach, etc. Stud fee was historically "Private" — widely reported €600k+. Died 2021.'
  },

  {
    name: 'Northern Dancer',
    sex: 'Stallion',
    foalDate: '1961-05-27',
    color: 'Bay',
    country: 'CAN',
    consignor: 'E.P. Taylor / Windfields (bred)',
    venue: 'Offered at CTHS yearling sale 1962 — RNA at $25,000',

    sire: 'Nearctic',
    dam: 'Natalma',
    damsire: 'Native Dancer',
    blackType3: 2,

    pStarts: 18, pWins: 14, pPlaces: 2,
    pEarnings: 580806,
    pClass: 5, pSound: 1,    // bowed tendon ended career
    notes: '1964 Kentucky Derby & Preakness winner. Most influential sire of 20th century. Stud fee peaked at $1,000,000 live foal in the 1980s — record at the time.',

    bProven: 2
  },

  /* ---------------- MODERN COMMERCIAL SIRES (current fees) ---------------- */

  {
    name: 'Into Mischief',
    sex: 'Stallion',
    foalDate: '2005-05-09',
    color: 'Bay',
    country: 'USA',
    consignor: 'Spendthrift Farm (stands)',

    sire: 'Harlan\'s Holiday',
    dam: 'Leslie\'s Lady',
    damsire: 'Tricky Creek',

    pStarts: 6, pWins: 3, pPlaces: 1,
    pEarnings: 597080,
    pClass: 4,
    pSound: 1,

    bStudFee: 250000,        // Spendthrift 2024
    bProven: 2,
    bPctSW: 11.5,
    bBookSize: 220,
    notes: 'Leading North American sire multiple years. Stud fee $250,000 at Spendthrift Farm (2024).'
  },

  {
    name: 'Curlin',
    sex: 'Stallion',
    foalDate: '2004-03-25',
    color: 'Chestnut',
    country: 'USA',
    consignor: 'Hill \'n\' Dale (stands)',

    sire: 'Smart Strike',
    dam: 'Sherriff\'s Deputy',
    damsire: 'Deputy Minister',

    pStarts: 16, pWins: 11, pPlaces: 2,
    pEarnings: 10501800,
    pSpeed: 117,             // career-best Beyer (Stephen Foster 2008)
    pClass: 5, pSound: 2,

    bStudFee: 225000,        // Hill 'n' Dale 2024
    bProven: 2,
    bPctSW: 9.0,
    notes: '2007 & 2008 US Horse of the Year. 2008 Dubai World Cup. Career earnings $10.5M (then a US record).'
  },

  {
    name: 'Tapit',
    sex: 'Stallion',
    foalDate: '2001-03-13',
    color: 'Gray',
    country: 'USA',
    consignor: 'Gainesway Farm (stands)',

    sire: 'Pulpit',
    dam: 'Tap Your Heels',
    damsire: 'Unbridled',

    pStarts: 6, pWins: 3, pPlaces: 0,
    pEarnings: 557300,
    pClass: 3,
    pSound: 1,

    bStudFee: 185000,        // Gainesway 2024 (down from $300k peak)
    bProven: 2,
    bPctSW: 11.0,
    notes: 'Three-time North American leading sire by earnings (2014–2016). Stud fee peaked at $300,000.'
  },

  /* ---------------- INTERNATIONAL ---------------- */

  {
    name: 'Dubawi',
    sex: 'Stallion',
    foalDate: '2002-02-09',
    color: 'Bay',
    country: 'IRE',
    consignor: 'Darley / Dalham Hall (stands)',

    sire: 'Dubai Millennium',
    dam: 'Zomaradah',
    damsire: 'Deploy',

    pStarts: 8, pWins: 5, pPlaces: 1,
    pEarnings: 1545917,
    pClass: 5, pSound: 2,

    bStudFee: 350000,        // approx USD of advertised £250,000 (Darley 2024)
    bProven: 2,
    bPctSW: 13.0,
    notes: 'Standing at Darley Dalham Hall Stud (UK). Stud fee £250,000 (2024) — top-tier international.'
  }
];
