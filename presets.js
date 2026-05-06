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

const HORSE_PRESETS=[

  /* ---------------- TRIPLE CROWN / CHAMPIONS ---------------- */

  {
    name: 'Secretariat',
    photoUrl: 'https://s3.amazonaws.com/wp-s3-equusmagazine.com/wp-content/uploads/2024/01/03164351/Perspective-Secretariat-Conf-from-TCC-PL0110858_AE-1536x1232.jpg',
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

    pStarts: 21,pWins: 16,pPlaces: 3,
    pEarnings: 1316808,
    pClass: 5,               // G1 winner (Triple Crown)
    pSound: 2,               // raced sound
    notes: '1973 US Triple Crown winner. Belmont Stakes by 31 lengths in track-record 2:24 (still standing). Pre-Beyer era — speed figure not populated.'
  },

  {
    name: 'American Pharoah',
    photoUrl: 'https://media.coolmore.com/uploads/2025/10/American-Pharoah-conformation-shot-1.jpg',
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

    pStarts: 11,pWins: 9,pPlaces: 1,
    pEarnings: 8650300,
    pSpeed: 105,             // career-best Beyer (Haskell)
    pClass: 5,pSound: 2,

    bStudFee: 200000,        // Coolmore Ashford 2024
    bProven: 2,
    notes: '2015 US Triple Crown + Breeders\' Cup Classic (Grand Slam). Now standing at Coolmore America (Ashford Stud).'
  },

  {
    name: 'Justify',
    photoUrl: 'https://www.thoroughbreddailynews.com/wp-content/uploads/2023/10/Justify.jpg',
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

    pStarts: 6,pWins: 6,pPlaces: 0,
    pEarnings: 3798000,
    pSpeed: 107,             // career-best Beyer (Belmont)
    pClass: 5,pSound: 2,

    aReserve: 500000,        // hammer price as yearling
    aConsignor: 2,

    bStudFee: 250000,        // Coolmore Ashford 2024
    bProven: 1,              // first crops on track
    notes: '2018 US Triple Crown, undefeated. Sold for $500k as a yearling at Keeneland September.'
  },

  {
    name: 'Frankel',
    photoUrl: 'https://www.thoroughbreddailynews.com/wp-content/uploads/2021/10/frankel_Juddmonte.jpg',
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

    pStarts: 14,pWins: 14,pPlaces: 0,
    pEarnings: 4789144,      // GBP converted approx — public Racing Post record
    pClass: 5,pSound: 2,
    notes: 'Undefeated in 14 starts. Highest Timeform rating ever assigned (147). Now at Banstead Manor Stud, Juddmonte. UK stud fee: £275,000 (2024).',

    bStudFee: 350000,        // approximate USD conversion of £275k
    bProven: 2
  },

  {
    name: 'Zenyatta',
    photoUrl: 'https://cdn-images.bloodhorse.com/i/bloodhorse-images/2024/04/4d47833363974219b02ec54f58156abe.jpg?width=450&maxheight=297&mode=max',
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

    pStarts: 20,pWins: 19,pPlaces: 1,
    pEarnings: 7304580,
    pSpeed: 112,             // career-best Beyer (BC Classic 2009)
    pClass: 5,pSound: 2,

    aReserve: 60000,
    aConsignor: 1,

    bMareAge: 22,            // born 2004
    notes: 'Won 19 of 20 starts. 2009 Breeders\' Cup Classic (only mare to do so). Bought for $60k as yearling — one of the great auction bargains.'
  },

  {
    name: 'Galileo',
    photoUrl: 'https://www.thoroughbreddailynews.com/wp-content/uploads/2015/07/Galileo-head03.jpg',
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

    pStarts: 8,pWins: 6,pPlaces: 1,
    pEarnings: 1572188,
    pClass: 5,pSound: 2,

    bProven: 2,
    bPctSW: 18.5,            // approx lifetime stakes-winners-to-runners %
    notes: 'Champion sire of Great Britain & Ireland 12 times. Sired Frankel, Nathaniel, New Approach, etc. Stud fee was historically "Private" — widely reported €600k+. Died 2021.'
  },

  {
    name: 'Northern Dancer',
    photoUrl: 'https://cloudfront.horsenetwork.com/sites/4/2017/06/northen-dancer-thoroughbred.jpg',
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

    pStarts: 18,pWins: 14,pPlaces: 2,
    pEarnings: 580806,
    pClass: 5,pSound: 1,    // bowed tendon ended career
    notes: '1964 Kentucky Derby & Preakness winner. Most influential sire of 20th century. Stud fee peaked at $1,000,000 live foal in the 1980s — record at the time.',

    bProven: 2
  },

  /* ---------------- MODERN COMMERCIAL SIRES (current fees) ---------------- */

  {
    name: 'Into Mischief',
    photoUrl: 'https://www.thoroughbreddailynews.com/wp-content/uploads/2024/09/Into_Mischief_2019_SA5_7433_print_Sarah_Andrew.jpg',
    sex: 'Stallion',
    foalDate: '2005-05-09',
    color: 'Bay',
    country: 'USA',
    consignor: 'Spendthrift Farm (stands)',

    sire: 'Harlan\'s Holiday',
    dam: 'Leslie\'s Lady',
    damsire: 'Tricky Creek',

    pStarts: 6,pWins: 3,pPlaces: 1,
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
    photoUrl: 'https://www.secretariat.com/wp-content/uploads/2024/09/Curlin-portrait_Shiflet-.jpg',
    sex: 'Stallion',
    foalDate: '2004-03-25',
    color: 'Chestnut',
    country: 'USA',
    consignor: 'Hill \'n\' Dale (stands)',

    sire: 'Smart Strike',
    dam: 'Sherriff\'s Deputy',
    damsire: 'Deputy Minister',

    pStarts: 16,pWins: 11,pPlaces: 2,
    pEarnings: 10501800,
    pSpeed: 117,             // career-best Beyer (Stephen Foster 2008)
    pClass: 5,pSound: 2,

    bStudFee: 225000,        // Hill 'n' Dale 2024
    bProven: 2,
    bPctSW: 9.0,
    notes: '2007 & 2008 US Horse of the Year. 2008 Dubai World Cup. Career earnings $10.5M (then a US record).'
  },

  {
    name: 'Tapit',
    photoUrl: 'https://gainesway.com/wp-content/uploads/2016/08/tapitGainesway_014.jpg',
    sex: 'Stallion',
    foalDate: '2001-03-13',
    color: 'Gray',
    country: 'USA',
    consignor: 'Gainesway Farm (stands)',

    sire: 'Pulpit',
    dam: 'Tap Your Heels',
    damsire: 'Unbridled',

    pStarts: 6,pWins: 3,pPlaces: 0,
    pEarnings: 557300,
    pClass: 3,
    pSound: 1,

    bStudFee: 185000,        // Gainesway 2024 (down from $300k peak)
    bProven: 2,
    bPctSW: 11.0,
    notes: 'Three-time North American leading sire by earnings (2014–2016). Stud fee peaked at $300,000.'
  },

  /* ---------------- MORE US CHAMPIONS ---------------- */

  {
    name: 'Flightline',
    photoUrl: 'https://www.westpointtb.com/wp-content/uploads/2019/08/Tapit-Feathered18c_4653w-2.jpg',
    sex: 'Stallion',
    foalDate: '2018-03-01',
    color: 'Bay',
    country: 'USA',
    consignor: 'Hronis Racing / Kayak (bred)',
    venue: 'Keeneland September 2019 ($1,000,000)',

    sire: 'Tapit',
    dam: 'Feathered',
    damsire: 'War Front',
    blackType3: 3,
    sireFee: 185000,

    pStarts: 6,pWins: 6,pPlaces: 0,
    pEarnings: 3994200,
    pSpeed: 124,             // BC Classic 2022 — highest Beyer in decades
    pClass: 5,pSound: 2,

    aReserve: 1000000,
    aConsignor: 2,

    bStudFee: 225000,        // Lane's End 2024
    bProven: 1,
    notes: 'Undefeated in 6 starts. 2022 BC Classic Beyer of 124 — highest in over 20 years. Standing at Lane\'s End Farm, $225,000 (2024).'
  },

  {
    name: 'Arrogate',
    photoUrl: 'https://www.thoroughbredracing.com/media/filer_public_thumbnails/filer_public/dd/26/dd26ee6f-bb42-426f-9fc2-6846acc9dbc6/arrogatepaddockcc.jpg__760x480_q85_crop_subsampling-2_upscale.jpg',
    sex: 'Stallion',
    foalDate: '2013-02-28',
    color: 'Gray',
    country: 'USA',
    consignor: 'Juddmonte (bred)',
    venue: 'Keeneland September 2014 ($560,000)',

    sire: 'Unbridled\'s Song',
    dam: 'Bubbler',
    damsire: 'Distorted Humor',
    blackType3: 2,

    pStarts: 11,pWins: 7,pPlaces: 1,
    pEarnings: 17422600,     // world record earnings at time of retirement
    pSpeed: 122,             // Travers Stakes 2016 (world record at the time)
    pClass: 5,pSound: 2,

    aReserve: 560000,
    aConsignor: 2,

    bStudFee: 75000,         // Juddmonte 2024 (reduced from $75k start)
    bProven: 2,
    notes: 'World-record earnings $17.4M at retirement. 2016 Breeders\' Cup Classic, 2017 Dubai World Cup & Pegasus World Cup. Travers Beyer of 122.'
  },

  {
    name: 'California Chrome',
    photoUrl: 'https://www.thoroughbredracing.com/media/filer_public_thumbnails/filer_public/f0/cb/f0cbd91a-89ee-4ce7-b993-1f9ea4bbccc4/california_chrome.jpg__760x480_q85_crop_subsampling-2_upscale.jpg',
    sex: 'Stallion',
    foalDate: '2011-02-18',
    color: 'Chestnut',
    country: 'USA',
    consignor: 'Perry & Steve Martin (bred)',
    venue: 'Barretts March 2012 ($8,000)',

    sire: 'Lucky Pulpit',
    dam: 'Love the Chase',
    damsire: 'Not For Love',
    blackType3: 1,

    pStarts: 27,pWins: 16,pPlaces: 4,
    pEarnings: 14752650,
    pSpeed: 102,
    pClass: 5,pSound: 2,

    aReserve: 8000,          // famously cheap yearling purchase
    aConsignor: 0,

    bStudFee: 15000,         // Taylor Made / standing internationally
    bProven: 2,
    notes: '2014 Kentucky Derby & Preakness winner. Bought for just $8,000 — the great auction story. Co-Horse of the Year 2014 & 2016. Standing internationally.'
  },

  {
    name: 'Cigar',
    photoUrl: 'https://static.americasbestracing.net/s3fs-public/styles/large_hero_16_9/public/article/Cigar95ClassicDickstein.jpg?itok=0jyNR18z&c=d2f7afd508fc3d33b87f16503cbf8646',
    sex: 'Stallion',
    foalDate: '1990-04-18',
    color: 'Bay',
    country: 'USA',
    consignor: 'Allen Paulson (bred)',
    venue: 'Keeneland July 1991',

    sire: 'Palace Music',
    dam: 'Solar Slew',
    damsire: 'Seattle Slew',
    blackType3: 3,

    pStarts: 33,pWins: 19,pPlaces: 9,
    pEarnings: 9999815,
    pSpeed: 114,             // BC Classic 1995
    pClass: 5,pSound: 2,
    notes: '16-race win streak 1994–96 (tied Citation\'s modern record). Two-time US Horse of the Year. Retired to Ashford Stud; found to be infertile.'
  },

  {
    name: 'Rachel Alexandra',
    photoUrl: 'https://visithorsecountry.com/wp-content/uploads/2025/07/Stonestreet-Farm-3.png',
    sex: 'Mare',
    foalDate: '2006-02-09',
    color: 'Bay',
    country: 'USA',
    consignor: 'Stonestreet (bred)',
    venue: 'Ocala Breeders\' Sales April 2007 ($490,000)',

    sire: 'Medaglia d\'Oro',
    dam: 'Lotta Kim',
    damsire: 'Smoke Glacken',
    blackType3: 2,

    pStarts: 17,pWins: 13,pPlaces: 2,
    pEarnings: 3506770,
    pSpeed: 105,             // Preakness 2009
    pClass: 5,pSound: 2,

    aReserve: 490000,
    aConsignor: 1,

    bMareAge: 20,
    bFoalsProduced: 6,
    bWinnersProduced: 3,
    bBTProduced: 1,
    notes: '2009 US Horse of the Year — first filly to win in over 30 years. Won Preakness Stakes, defeating colts. Dam of several winners incl. Jess\'s Dream.'
  },

  {
    name: 'Medaglia d\'Oro',
    photoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOQfPZZY1QcrUPivotBMDWfhLDPZgNeyYf4Z4r5xRlk8Ub3jdLIW7Nt-fOal2jrBZjjGzhDFeS901ehTvBr8s6W6YKFtbUFte1Gs9iDw&s=10',
    sex: 'Stallion',
    foalDate: '1999-04-14',
    color: 'Dark Bay',
    country: 'USA',
    consignor: 'Darley America (stands)',

    sire: 'El Prado',
    dam: 'Cappucino Bay',
    damsire: 'Bailjumper',
    blackType3: 2,

    pStarts: 17,pWins: 8,pPlaces: 4,
    pEarnings: 5754720,
    pSpeed: 108,             // Whitney Handicap 2003
    pClass: 5,pSound: 2,

    bStudFee: 150000,        // Darley 2024
    bProven: 2,
    bPctSW: 10.5,
    notes: 'Sire of Rachel Alexandra, Songbird, Drefong. Champion sire by quality. Standing at Darley America (Jonabell Farm).'
  },

  {
    name: 'Storm Cat',
    photoUrl: 'https://wcms.drf.com/sites/default/files/photos/Storm%20Cat02.6-22-12.BL_.jpg',
    sex: 'Stallion',
    foalDate: '1983-02-27',
    color: 'Dark Bay',
    country: 'USA',
    consignor: 'Overbrook Farm (stood)',

    sire: 'Storm Bird',
    dam: 'Terlingua',
    damsire: 'Secretariat',
    blackType3: 3,

    pStarts: 8,pWins: 4,pPlaces: 3,
    pEarnings: 570610,
    pClass: 4,pSound: 1,   // career shortened by injury

    bStudFee: 500000,        // Overbrook — peak fee (2001), one of highest ever
    bProven: 2,
    bPctSW: 13.0,
    notes: 'Stud fee peaked at $500,000 (2001) — North American record at the time. Sire of Giant\'s Causeway, Hennessy, Cat Thief. Broodmare sire influence enormous. Died 2013.'
  },

  {
    name: 'A.P. Indy',
    photoUrl: 'https://static.americasbestracing.net/s3fs-public/styles/large_hero_16_9/public/article/APIndy-Lanes-End-Eberhardt-2006.jpg?itok=3ObfCLwN&c=24ebfb6fe2264ea55e9161fa59dce4b4',
    sex: 'Stallion',
    foalDate: '1989-03-31',
    color: 'Dark Bay',
    country: 'USA',
    consignor: 'Lane\'s End Farm (stood)',

    sire: 'Seattle Slew',
    dam: 'Weekend Surprise',
    damsire: 'Secretariat',
    blackType3: 3,

    pStarts: 11,pWins: 8,pPlaces: 2,
    pEarnings: 2979815,
    pSpeed: 114,
    pClass: 5,pSound: 1,   // missed Kentucky Derby with foot issue

    bStudFee: 300000,        // Lane's End peak fee
    bProven: 2,
    bPctSW: 12.0,
    notes: '1992 Breeders\' Cup Classic & Belmont Stakes winner, 1992 Horse of the Year. Sold as yearling for $2.9M (Keeneland July 1990, world record at time). Sire of Malibu Moon, Pulpit, Mineshaft. Died 2020.'
  },

  {
    name: 'War Front',
    sex: 'Stallion',
    photoUrl: 'https://cdn.bloodhorse.com/sroimages//medium/0000136975_1.jpg',
    foalDate: '2002-01-15',
    color: 'Bay',
    country: 'USA',
    consignor: 'Claiborne Farm (stands)',

    sire: 'Danzig',
    dam: 'Starry Dreamer',
    damsire: 'Rubiano',
    blackType3: 2,

    pStarts: 9,pWins: 4,pPlaces: 1,
    pEarnings: 523200,
    pClass: 3,pSound: 1,

    bStudFee: 250000,        // Claiborne 2024
    bProven: 2,
    bPctSW: 12.5,
    notes: 'Claiborne Farm\'s flagship sire. Sire of Declaration of War, Air Force Blue, U S Navy Flag. Dominant influence on European turf pedigrees. Stud fee $250,000 (2024).'
  },

  /* ---------------- INTERNATIONAL ---------------- */

  {
    name: 'Enable',
    sex: 'Mare',
    photoUrl: 'https://i.guim.co.uk/img/media/da1a161891acf042a27709957b438fcb2b474404/40_0_4655_2794/master/4655.jpg?width=620&dpr=2&s=none&crop=none',
    foalDate: '2014-02-22',
    color: 'Bay',
    country: 'IRE',
    consignor: 'Khalid Abdullah / Juddmonte (bred)',
    venue: 'Not sold at auction (homebred)',

    sire: 'Nathaniel',
    dam: 'Concentric',
    damsire: 'Sadler\'s Wells',
    blackType3: 3,

    pStarts: 18,pWins: 14,pPlaces: 3,
    pEarnings: 10862946,
    pClass: 5,pSound: 2,

    bMareAge: 12,
    bFoalsProduced: 3,
    bWinnersProduced: 1,
    notes: 'Won 14 G1s incl. 2× Prix de l\'Arc de Triomphe (2017, 2018). Racing Post Rating 130. Now a Juddmonte broodmare.'
  },

  {
    name: 'Winx',
    sex: 'Mare',
    photoUrl: 'https://images.theconversation.com/files/616228/original/file-20240829-20-meichk.jpg?ixlib=rb-4.1.0&q=30&auto=format&w=600&h=404&fit=crop&dpr=2',
    foalDate: '2011-09-14',
    color: 'Bay',
    country: 'AUS',
    consignor: 'Magic Millions 2013 ($230,000 AUD)',

    sire: 'Street Cry',
    dam: 'Vegas Showgirl',
    damsire: 'Al Akbar',
    blackType3: 2,

    pStarts: 43,pWins: 37,pPlaces: 5,
    pEarnings: 26143280,     // AUD — world record at retirement
    pClass: 5,pSound: 2,

    bMareAge: 15,
    bFoalsProduced: 3,
    bWinnersProduced: 1,
    notes: '33-race win streak (world record). World\'s highest-rated racehorse (Timeform 130 = Frankel). 25× G1 wins. Bought for $230k AUD as yearling. World record earnings at retirement.'
  },

  {
    name: 'Black Caviar',
    sex: 'Mare',
    photoUrl: 'https://tilthecowscomehome.org/wp-content/uploads/2024/08/GettyImages-145885310-1-scaled.jpg',
    foalDate: '2006-08-18',
    color: 'Gray',
    country: 'AUS',
    consignor: 'Peter Moody Racing (trained)',
    venue: 'Magic Millions 2007 ($210,000 AUD)',

    sire: 'Bel Esprit',
    dam: 'Helsinge',
    damsire: 'Desert Sun',
    blackType3: 2,

    pStarts: 25,pWins: 25,pPlaces: 0,
    pEarnings: 7953000,      // AUD
    pClass: 5,pSound: 2,

    bMareAge: 20,
    bFoalsProduced: 4,
    bWinnersProduced: 2,
    notes: 'Undefeated in 25 starts — all G1 or G2. World\'s best sprinter. Australian Racing Hall of Fame. Also represented Australia at Royal Ascot (won 2012).'
  },

  {
    name: 'Dubawi',
    sex: 'Stallion',
    photoUrl: 'https://cdn.darleystallions.com/sites/default/files/drupal-media/AA%20Stalion%20headers/Europe/Desktop/Dubawi_header.jpg',
    foalDate: '2002-02-09',
    color: 'Bay',
    country: 'IRE',
    consignor: 'Darley / Dalham Hall (stands)',

    sire: 'Dubai Millennium',
    dam: 'Zomaradah',
    damsire: 'Deploy',

    pStarts: 8,pWins: 5,pPlaces: 1,
    pEarnings: 1545917,
    pClass: 5,pSound: 2,

    bStudFee: 350000,        // approx USD of advertised £250,000 (Darley 2024)
    bProven: 2,
    bPctSW: 13.0,
    notes: 'Standing at Darley Dalham Hall Stud (UK). Stud fee £250,000 (2024) — top-tier international.'
  }
];
