/* ===== Horse Selector — app logic =====
   Storage:  localStorage key 'horses' (array of records)
             localStorage key 'weights:<mode>' (object)
*/

const APP_VERSION='1.10.0'; // bump this each release to trigger update prompt

const STORAGE_KEY='horses';
const WEIGHTS_KEY=(m) => `weights:${m}`;

// scoring mode is fixed to 'estimated' — public records + sensible fallbacks.
function currentScoreMode() {return 'estimated';}

// ---------- Default category weights per mode ----------
const DEFAULT_WEIGHTS={
  'auction': {
    pedigree: 30,conformation: 22,veterinary: 15,
    physical: 5,performance: 8,auction: 10,
    breeding: 0,temperament: 5,foalDate: 5
  },
  'breeding-mare': {
    pedigree: 28,conformation: 12,veterinary: 8,
    physical: 3,performance: 10,auction: 5,
    breeding: 28,temperament: 3,foalDate: 3
  },
  'breeding-stallion': {
    pedigree: 25,conformation: 12,veterinary: 8,
    physical: 3,performance: 12,auction: 0,
    breeding: 35,temperament: 2,foalDate: 3
  }
};

const CATEGORY_LABELS={
  pedigree: 'Pedigree',conformation: 'Conformation',
  veterinary: 'Veterinary',physical: 'Physical',
  performance: 'Performance',auction: 'Auction/Price',
  breeding: 'Breeding',temperament: 'Temperament',foalDate: 'Foaling Date'
};

// ---------- Storage helpers ----------
function loadHorses() {
  try {return JSON.parse(localStorage.getItem(STORAGE_KEY))||[];}
  catch {return [];}
}
function saveHorses(arr) {
  try {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(arr));
  } catch(err) {
    // Quota exceeded or storage blocked (e.g. private mode). Warn instead of failing silently.
    alert('Could not save — your browser storage may be full or disabled.\n\n'
      +'Export a JSON backup from the Import / Export tab, then clear space, so you don\'t lose your horses.');
    return false;
  }
  document.getElementById('countSaved').textContent=arr.length;
  return true;
}
function loadWeights(mode) {
  try {
    const w=JSON.parse(localStorage.getItem(WEIGHTS_KEY(mode)));
    return w||{...DEFAULT_WEIGHTS[mode]};
  } catch {return {...DEFAULT_WEIGHTS[mode]};}
}
function saveWeights(mode,w) {
  localStorage.setItem(WEIGHTS_KEY(mode),JSON.stringify(w));
}

// ---------- Utility ----------
const clamp=(v,lo,hi) => Math.max(lo,Math.min(hi,v));
const num=(v) => {
  const n=parseFloat(v);
  return isFinite(n)? n:null;
};
const fmtUSD=(n) => n==null? '—':
  '$'+Math.round(n).toLocaleString('en-US');

// Non-blocking toast (also announced to screen readers via the aria-live host).
function toast(msg,type,ms) {
  const host=document.getElementById('toastHost');
  if(!host) {return;}
  const el=document.createElement('div');
  el.className='toast toast-'+(type||'success');
  el.textContent=msg;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(),300);
  },ms||2800);
}

// Map a numeric metric onto 0-100 score given target range
function rangeScore(value,lo,hi,ideal) {
  if(value==null) return null;
  if(ideal==null) ideal=(lo+hi)/2;
  if(value<lo||value>hi) {
    const dist=value<lo? (lo-value):(value-hi);
    const span=hi-lo;
    return clamp(40-(dist/span)*80,0,40);
  }
  // inside range: bell-curve toward ideal
  const half=Math.max(ideal-lo,hi-ideal);
  const off=Math.abs(value-ideal)/half;
  return clamp(100-off*30,70,100);
}

// ---------- Per-category sub-scores (each returns 0-100 or null if no data) ----------
function scorePedigree(h) {
  const parts=[];
  // Sire AEI: 1.0 = avg → 50, 2.0 = elite → 90, 3+ → 100
  if(h.sireAEI!=null) parts.push(clamp(20+h.sireAEI*30,0,100));
  if(h.sireFee!=null) {
    // log scale: $5k → 30, $50k → 70, $250k → 95
    const f=h.sireFee;
    if(f>0) parts.push(clamp(15+Math.log10(f)*18,0,100));
  }
  if(h.damFoals!=null&&h.damFoals>0) {
    const winRate=(h.damWinners||0)/h.damFoals;
    const btRate=(h.damBlackType||0)/h.damFoals;
    parts.push(clamp(winRate*80+btRate*200,0,100));
  }
  if(h.damsireAEI!=null) parts.push(clamp(20+h.damsireAEI*30,0,100));
  if(h.blackType3!=null) parts.push([30,55,75,95][h.blackType3]??50);
  if(h.nick!=null) parts.push([30,55,78,95][h.nick]??50);
  if(h.dosageIndex!=null) {
    // Most racehorses fall 1.0–4.0; both extremes acceptable; reward "balanced specialist"
    const di=h.dosageIndex;
    if(di>=0.5&&di<=5) parts.push(75);
    else parts.push(50);
  }
  if(h.inbreeding!=null) {
    // Wright %: 0–3% ideal (light line breeding), 3–6% ok, 6+ penalize
    const ib=h.inbreeding;
    if(ib<=3) parts.push(85);
    else if(ib<=6) parts.push(65);
    else parts.push(clamp(65-(ib-6)*10,0,65));
  }
  return parts.length? avg(parts):null;
}

function scoreConformation(h) {
  // Essentials — Overall impression + Walk. These are the only fields a typical
  // user fills; if either is set, that's the score.
  const essentials=[];
  if(h.cImpression!=null) essentials.push(h.cImpression*1.4); // weighted heavier
  if(h.cWalk!=null) essentials.push(h.cWalk*1.6);
  if(essentials.length) {
    const w=(h.cImpression!=null? 1.4:0)+(h.cWalk!=null? 1.6:0);
    return clamp((essentials.reduce((a,b) => a+b,0)/w-1)/9*100,0,100);
  }
  // Detailed sliders fallback (advanced users)
  const keys=['cBalance','cShoulder','cHip','cCannon','cKnees',
    'cPasterns','cHooves','cNeck','cTopline'];
  const weighted={
    cBalance: 1.3,cShoulder: 1.3,cHip: 1.3,cCannon: 1.0,cKnees: 1.1,
    cPasterns: 1.0,cHooves: 1.0,cNeck: 0.7,cTopline: 0.8
  };
  let sum=0,w=0;
  keys.forEach(k => {
    const v=h[k];
    if(v!=null) {sum+=v*weighted[k]; w+=weighted[k];}
  });
  if(!w) return null;
  return clamp((sum/w-1)/9*100,0,100);
}

function scoreVeterinary(h) {
  const parts=[];
  // Single-tier shortcut field (essentials)
  if(h.vRepository!=null) parts.push([0,50,80,100][h.vRepository]??70);
  // Detailed individual findings (advanced)
  if(h.vXrays!=null) parts.push([0,50,80,100][h.vXrays]??70);
  if(h.vScope!=null) parts.push([0,50,80,100][h.vScope]??70);
  if(h.vHeart!=null) parts.push([30,75,100][h.vHeart]??70);
  if(h.vWind!=null) parts.push([20,70,100][h.vWind]??70);
  if(h.vEyes!=null) parts.push([30,100][h.vEyes]??70);

  // Concern flags — each ticked flag is a penalty, 12pt per flag.
  const flags=['flagWind','flagThroat','flagOCD','flagHeart','flagSoundness']
    .filter(k => h[k]).length;
  if(parts.length===0&&flags===0) return null;
  const base=parts.length? avg(parts):60;
  return clamp(base-flags*12,0,100);
}

function scorePhysical(h) {
  const parts=[];
  if(h.height!=null) parts.push(rangeScore(h.height,14.3,16.3,15.3));
  if(h.girth!=null) parts.push(rangeScore(h.girth,60,80,72));
  if(h.cannonIn!=null) parts.push(rangeScore(h.cannonIn,7.5,9.5,8.25));
  return parts.length? avg(parts.filter(x => x!=null)):null;
}

function scorePerformance(h) {
  const starts=h.pStarts||0;
  if(starts===0&&h.pClass==null&&h.pEarnings==null) return null;
  const parts=[];
  if(starts>0) {
    const winPct=(h.pWins||0)/starts;
    const placePct=((h.pWins||0)+(h.pPlaces||0))/starts;
    parts.push(clamp(winPct*200+placePct*50,0,100));
  }
  if(h.pEarnings!=null&&h.pEarnings>=0) {
    // log: $10k=30, $100k=60, $1M=90, $5M+=100
    if(h.pEarnings>0) parts.push(clamp(Math.log10(h.pEarnings)*18-12,0,100));
    else parts.push(20);
  }
  if(h.pSpeed!=null&&h.pSpeed>0) {
    // Beyer: 70=avg, 100=G1, 110+=elite
    parts.push(clamp((h.pSpeed-50)*1.6,0,100));
  }
  if(h.pClass!=null) parts.push([20,45,65,80,90,100][h.pClass]??50);
  if(h.pSound!=null) parts.push([20,60,100][h.pSound]??70);
  return parts.length? avg(parts):null;
}

function scoreAuction(h) {
  // Higher score when market value > reserve (i.e., good buy)
  if(h.aReserve==null&&h.aMarketEst==null&&h.aConsignor==null) return null;
  const parts=[];
  if(h.aReserve!=null&&h.aMarketEst!=null&&h.aReserve>0) {
    const ratio=h.aMarketEst/h.aReserve;
    parts.push(clamp(ratio*50,0,100));
  }
  if(h.aConsignor!=null) parts.push([40,70,95][h.aConsignor]??60);
  return parts.length? avg(parts):null;
}

function scoreBreeding(h,mode) {
  const parts=[];
  if(mode==='breeding-mare'||h.bFoalsProduced!=null) {
    if(h.bFoalsProduced!=null&&h.bFoalsProduced>0) {
      const winRate=(h.bWinnersProduced||0)/h.bFoalsProduced;
      const btRate=(h.bBTProduced||0)/h.bFoalsProduced;
      parts.push(clamp(winRate*70+btRate*250,0,100));
    } else if(h.bFoalsProduced===0) {
      parts.push(50); // unproven
    }
    if(h.bFertility!=null) parts.push([20,65,100][h.bFertility]??70);
    if(h.bMareAge!=null) {
      // peak 6–14
      parts.push(rangeScore(h.bMareAge,4,20,9));
    }
  }
  if(mode==='breeding-stallion'||h.bStudFee!=null) {
    if(h.bStudFee!=null&&h.bStudFee>0)
      parts.push(clamp(15+Math.log10(h.bStudFee)*18,0,100));
    if(h.bPctWinners!=null) parts.push(clamp(h.bPctWinners*1.4,0,100));
    if(h.bPctSW!=null) parts.push(clamp(h.bPctSW*12,0,100));
    if(h.bProven!=null) parts.push([35,65,95][h.bProven]??60);
    if(h.bCross!=null) parts.push([30,60,80,100][h.bCross]??60);
    if(h.bBookSize!=null) parts.push(rangeScore(h.bBookSize,30,200,120));
  }
  return parts.length? avg(parts):null;
}

function scoreTemperament(h) {
  let base=null;
  if(h.temperament!=null) base=[20,55,80,100][h.temperament]??60;
  if(h.flagBehavior) base=(base==null? 50:base)-15;
  return base==null? null:clamp(base,0,100);
}

function scoreFoalDate(h) {
  if(!h.foalDate) return null;
  const d=new Date(h.foalDate);
  if(isNaN(d)) return null;
  const month=d.getMonth(); // 0=Jan
  // Northern hemisphere TB: Jan–Mar best, Apr ok, May+ less ideal
  if(month<=1) return 95;     // Jan, Feb
  if(month===2) return 88;    // Mar
  if(month===3) return 75;    // Apr
  if(month===4) return 60;    // May
  return 50;
}

const avg=(arr) => arr.reduce((a,b) => a+b,0)/arr.length;

const PILLAR_KEYS=[
  'pillarGenetics',
  'pillarSoundness',
  'pillarPerformance',
  'pillarValue',
  'pillarMind'
];

function avgNonNull(values) {
  const kept=values.filter(v => v!=null);
  return kept.length? avg(kept):null;
}

function decisionLabel(score,vetHardStop) {
  if(vetHardStop) return {text: 'PASS — vet HARD STOP',cls: 'decision-pass'};
  if(score==null) return {text: 'Needs more data',cls: 'decision-wait'};
  if(score>=80) return {text: 'BUY',cls: 'decision-buy'};
  if(score>=68) return {text: 'SHORTLIST',cls: 'decision-shortlist'};
  return {text: 'PASS',cls: 'decision-pass'};
}

function logMoneyScore(amount,floor=20,factor=18) {
  if(amount==null||amount<=0) return null;
  return clamp(Math.log10(amount)*factor-floor,0,100);
}

function winRateScore(starts,wins,places) {
  if(!starts||starts<=0) return null;
  const w=(wins||0)/starts;
  const p=((wins||0)+(places||0))/starts;
  return clamp(w*200+p*50,0,100);
}

function defaultIfNull(v,dflt) {
  return v==null? dflt:v;
}

function computeFivePillars(h,mode) {
  const cat={
    pedigree: scorePedigree(h),
    conformation: scoreConformation(h),
    veterinary: scoreVeterinary(h),
    physical: scorePhysical(h),
    performance: scorePerformance(h),
    auction: scoreAuction(h),
    breeding: scoreBreeding(h,mode),
    temperament: scoreTemperament(h),
    foalDate: scoreFoalDate(h)
  };

  // Derived scores from existing model with public-data fallbacks so pillars are always populated.
  const starts=h.pStarts||0;
  const wins=h.pWins||0;
  const places=h.pPlaces||0;
  const winPct=starts>0? wins/starts:null;
  const durabilityByStarts=starts>0? clamp(45+starts*2.2,45,95):null;
  const classByPerformance=h.pClass!=null? [25,45,62,78,90,98][h.pClass]:null;
  const earningsScore=logMoneyScore(h.pEarnings,12,18);
  const studFeeScore=logMoneyScore(h.bStudFee||h.sireFee,15,18);
  const price=h.aReserve||h.aMarketEst||h.bStudFee||null;
  const valueRatioScore=(h.aReserve&&h.pEarnings)
    ? clamp((h.pEarnings/h.aReserve)*12,0,100)
    :null;
  const valueFromVs=valueScore(h,mode)==null? null:clamp(valueScore(h,mode)*8,0,100);
  const consistencyScore=winPct==null? null:clamp(45+winPct*55,40,100);

  const pillars={
    pillarGenetics: avgNonNull([
      cat.pedigree,
      mode.startsWith('breeding')? cat.breeding:null,
      studFeeScore,
      h.blackType3!=null? [35,55,75,95][h.blackType3]:null,
      h.nick!=null? [35,55,78,95][h.nick]:null
    ]),

    pillarSoundness: avgNonNull([
      cat.conformation,
      cat.veterinary,
      cat.physical,
      h.pSound!=null? [35,65,92][h.pSound]:null,
      durabilityByStarts
    ]),

    pillarPerformance: avgNonNull([
      cat.performance,
      mode.startsWith('breeding')? cat.breeding:null,
      classByPerformance,
      earningsScore,
      winRateScore(starts,wins,places)
    ]),

    pillarValue: avgNonNull([
      cat.auction,
      valueFromVs,
      valueRatioScore,
      price!=null? clamp(85-Math.log10(Math.max(price,1))*8,20,85):null,
      mode.startsWith('breeding')? studFeeScore:null
    ]),

    pillarMind: avgNonNull([
      cat.temperament,
      cat.foalDate,
      consistencyScore,
      starts>0? clamp(40+Math.min(starts,25)*2.2,40,95):null
    ])
  };

  // Weighted for buy decisions.
  const w={
    pillarGenetics: 30,
    pillarSoundness: 25,
    pillarPerformance: 20,
    pillarValue: 15,
    pillarMind: 10
  };
  let sum=0;
  let total=0;
  PILLAR_KEYS.forEach(k => {
    if(pillars[k]!=null) {
      sum+=pillars[k]*w[k];
      total+=w[k];
    }
  });
  const score=total? Math.round(sum/total):null;

  // HARD STOP: significant repository finding overrides everything.
  const vetHardStop=h.vRepository===0||h.vXrays===0;
  const decision=decisionLabel(score,vetHardStop);

  // "Data completeness" — how many of the 9 categories the user actually populated.
  // NOTE: this is coverage of your OWN inputs, not statistical confidence in an outcome.
  // (Renamed from "confidence" so it no longer implies predictive reliability, and the
  // former 20% floor is removed so an empty record honestly reads as near-zero data.)
  const directSignals=[
    cat.pedigree,cat.conformation,cat.veterinary,cat.physical,
    cat.performance,cat.auction,cat.breeding,cat.temperament,cat.foalDate
  ].filter(v => v!=null).length;
  const confidence=Math.round((directSignals/9)*100);

  return {score,decision,pillars,confidence,dataFilled:directSignals,dataTotal:9};
}

// ---------- Overall scoring ----------
function computeScores(h,mode) {
  const cat={
    pedigree: scorePedigree(h),
    conformation: scoreConformation(h),
    veterinary: scoreVeterinary(h),
    physical: scorePhysical(h),
    performance: scorePerformance(h),
    auction: scoreAuction(h),
    breeding: scoreBreeding(h,mode),
    temperament: scoreTemperament(h),
    foalDate: scoreFoalDate(h)
  };
  const weights=loadWeights(mode);
  let weightedSum=0,totalW=0;
  Object.keys(weights).forEach(k => {
    if(cat[k]!=null&&weights[k]>0) {
      weightedSum+=cat[k]*weights[k];
      totalW+=weights[k];
    }
  });
  const overall=totalW? weightedSum/totalW:0;
  return {overall: Math.round(overall),categories: cat};
}

function valueScore(h,mode) {
  const s=computeScores(h,mode).overall;
  const price=h.aReserve||h.aMarketEst||h.bStudFee||0;
  if(!price) return null;
  return Math.round((s/(price/10000))*10)/10;
}

// ---------- Form handling ----------
const form=document.getElementById('horseForm');

function readForm() {
  const fd=new FormData(form);
  const h={};
  for(const [k,v] of fd.entries()) {
    if(v===''||v==null) continue;
    const numericFields=new Set([
      'sireFee','sireAEI','sireCI','damFoals','damWinners','damBlackType',
      'damsireAEI','blackType3','nick','dosageIndex','inbreeding',
      'cImpression','cWalk',
      'cBalance','cShoulder','cHip','cCannon','cKnees','cPasterns','cHooves',
      'cNeck','cTopline',
      'height','weight','girth','cannonIn',
      'vRepository','vXrays','vScope','vHeart','vWind','vEyes',
      'pStarts','pWins','pPlaces','pEarnings','pSpeed','pClass','pSound',
      'aReserve','aMaxBid','aMarketEst','aConsignor','aVetCost',
      'bMareAge','bFoalsProduced','bWinnersProduced','bBTProduced','bFertility',
      'bStudFee','bBookSize','bPctWinners','bPctSW','bProven','bCross',
      'temperament',
      'flagWind','flagThroat','flagOCD','flagHeart','flagSoundness','flagBehavior'
    ]);
    if(numericFields.has(k)) {
      const n=num(v);
      if(n!=null) h[k]=n;
    } else {
      h[k]=v;
    }
  }
  // Range sliders (conformation impression, walk, detailed traits) only count once the
  // user has actually moved them. A browser range input has no "empty" state — it sits at
  // its default midpoint — so without this an untouched slider would leak a phantom score,
  // AND a legitimate worst-case rating of 1 could never be distinguished from "not rated".
  // We track a `data-touched` flag set on first input and drop any slider that lacks it.
  form.querySelectorAll('input[type="range"]').forEach(r => {
    if(!r.dataset.touched&&r.name) delete h[r.name];
  });
  // Checkboxes: when unchecked they don't appear in FormData. Normalize to 0/undefined.
  ['flagWind','flagThroat','flagOCD','flagHeart','flagSoundness','flagBehavior']
    .forEach(k => {if(h[k]==null) h[k]=0;});
  return h;
}

function fillForm(h) {
  form.reset();
  // Reset range sliders: clear the "touched" flag and blank the output. An untouched
  // slider is treated as "not rated" by readForm regardless of its default position.
  form.querySelectorAll('input[type="range"]').forEach(r => {
    delete r.dataset.touched;
    if(r.nextElementSibling) r.nextElementSibling.textContent='—';
  });
  // Reset checkboxes.
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => {cb.checked=false;});
  if(!h) {updatePhotoPreview(''); return;}
  Object.keys(h).forEach(k => {
    const el=form.elements.namedItem(k);
    if(!el) return;
    if(el.type==='checkbox') {
      el.checked=!!h[k];
      return;
    }
    el.value=h[k];
    if(el.type==='range') {
      // Only sliders the preset actually provides count as rated.
      el.dataset.touched='1';
      if(el.nextElementSibling) el.nextElementSibling.textContent=h[k];
    }
  });
  updatePhotoPreview(h.photoUrl||'');
  // Refresh pillar summary and live score now that form values are populated.
  updateLiveScore();
}

function updatePhotoPreview(url) {
  const img=document.getElementById('photoPreview');
  const ph=document.getElementById('photoPlaceholder');
  if(!img||!ph) return;
  const safe=url&&/^https?:\/\//i.test(url)? url:'';
  if(safe) {
    img.referrerPolicy='no-referrer';
    img.src=safe;
    img.style.display='block';
    ph.style.display='none';
    img.onerror=() => {img.style.display='none'; ph.style.display='flex';};
  } else {
    img.removeAttribute('src');
    img.style.display='none';
    ph.style.display='flex';
  }
}

form.addEventListener('input',e => {
  if(e.target) {
    if(e.target.name==='photoUrl') updatePhotoPreview(e.target.value);
    // Any user interaction with a slider marks it as an intentional rating (incl. a 1).
    if(e.target.type==='range') e.target.dataset.touched='1';
  }
  updateLiveScore();
  scheduleDraftSave();
});
form.addEventListener('change',() => {updateLiveScore(); scheduleDraftSave();});
function updateLiveScore() {
  const h=readForm();
  const s=computeScores(h,currentMode());
  document.getElementById('liveScore').textContent=
    s.overall||'—';

  const p=computeFivePillars(h,currentMode());
  const pillarScoreEl=document.getElementById('pillarScore');
  const pillarDecisionEl=document.getElementById('pillarDecision');
  const pillarConfidenceEl=document.getElementById('pillarConfidence');
  if(pillarScoreEl) pillarScoreEl.textContent=p.score==null? '—':p.score;
  if(pillarDecisionEl) {
    pillarDecisionEl.textContent=p.decision.text;
    pillarDecisionEl.className=`decision ${p.decision.cls}`;
  }
  if(pillarConfidenceEl) pillarConfidenceEl.textContent=`${p.dataFilled}/9 categories`;
  renderPillarChecklist(h);
  renderPriceSanity(h);
}

form.addEventListener('submit',e => {
  e.preventDefault();
  const h=readForm();
  if(!h.name) {
    toast('Give the horse a name first','error');
    const nameField=form.elements.namedItem('name');
    if(nameField) nameField.focus();
    return;
  }
  const horses=loadHorses();
  // Check for duplicate: if no id yet (new entry), warn if name already exists
  if(!h.id) {
    const exists=horses.find(x => x.name.toLowerCase()===h.name.toLowerCase());
    if(exists) {
      const msg=`You already have a horse named "${exists.name}" saved.\n\nOverwrite it or cancel and edit the name?`;
      if(!confirm(msg)) return;
      // Overwrite the existing one
      const i=horses.findIndex(x => x.name.toLowerCase()===h.name.toLowerCase());
      h.id=horses[i].id;
      horses[i]={...horses[i],...h,updated: Date.now()};
    } else {
      h.id='h_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
      h.created=Date.now();
      horses.push(h);
    }
  } else {
    const i=horses.findIndex(x => x.id===h.id);
    if(i>=0) horses[i]={...horses[i],...h,updated: Date.now()};
  }
  saveHorses(horses);
  clearDraft();
  toast(`Saved: ${h.name}`);
  form.reset();
  form.elements.id.value='';
  form.querySelectorAll('input[type="range"]').forEach(r => {
    delete r.dataset.touched;
    if(r.nextElementSibling) r.nextElementSibling.textContent='—';
  });
  updateLiveScore();
  renderList();
  switchView('list');
});

// ---------- Auto-save draft (so a first-time buyer never loses work) ----------
const DRAFT_KEY='horse-draft';
let draftTimer=null;

function saveDraft() {
  // Only auto-save the "new horse" flow — never shadow an existing saved record.
  if(form.elements.id&&form.elements.id.value) return;
  const h=readForm();
  // Ignore an essentially-empty form (readForm always returns the 6 zeroed flags).
  const meaningful=Object.keys(h).some(k => !/^flag/.test(k)&&h[k]!==''&&h[k]!=null);
  if(!meaningful) {clearDraft(); return;}
  try {localStorage.setItem(DRAFT_KEY,JSON.stringify(h));} catch {}
}
function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer=setTimeout(saveDraft,500);
}
function clearDraft() {
  clearTimeout(draftTimer);
  try {localStorage.removeItem(DRAFT_KEY);} catch {}
}
function loadDraft() {
  try {return JSON.parse(localStorage.getItem(DRAFT_KEY));} catch {return null;}
}

// Offer to restore an unsaved draft on load — never auto-fill without consent.
(function initDraftRestore() {
  const banner=document.getElementById('draftBanner');
  if(!banner) return;
  const draft=loadDraft();
  if(!draft||!draft.name) {banner.classList.add('hidden'); return;}
  const label=document.getElementById('draftBannerName');
  if(label) label.textContent=draft.name;
  banner.classList.remove('hidden');
  document.getElementById('btnRestoreDraft').addEventListener('click',() => {
    fillForm(draft);
    form.elements.id.value=''; // still a new, unsaved entry
    updateLiveScore();
    banner.classList.add('hidden');
    document.getElementById('horseForm').scrollIntoView({behavior: 'smooth',block: 'start'});
  });
  document.getElementById('btnDiscardDraft').addEventListener('click',() => {
    clearDraft();
    banner.classList.add('hidden');
  });
})();

document.getElementById('btnReset').addEventListener('click',() => {
  form.reset();
  form.elements.id.value='';
  form.querySelectorAll('input[type="range"]').forEach(r => {
    delete r.dataset.touched;
    if(r.nextElementSibling) r.nextElementSibling.textContent='—';
  });
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => {cb.checked=false;});
  updatePhotoPreview('');
  clearDraft();
  updateLiveScore();
});

document.getElementById('btnQuickSave').addEventListener('click',() => {
  if(typeof form.requestSubmit==='function') form.requestSubmit();
  else form.dispatchEvent(new Event('submit',{cancelable: true}));
});

document.getElementById('btnSaveFromHero').addEventListener('click',() => {
  if(typeof form.requestSubmit==='function') form.requestSubmit();
  else form.dispatchEvent(new Event('submit',{cancelable: true}));
});

// ---------- View switching ----------
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click',() => switchView(btn.dataset.view));
});
function switchView(name) {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active',t.dataset.view===name));
  document.querySelectorAll('.view').forEach(v =>
    v.classList.toggle('active',v.id==='view-'+name));
  if(name==='list') renderList();
  if(name==='compare') renderCompare();
  if(name==='data') updateBackupStatus();
}

// ---------- Mode ----------
const modeSel=document.getElementById('mode');
modeSel.addEventListener('change',() => {
  applyModeClasses();
  updateLiveScore();
  renderList();
});
function currentMode() {return modeSel.value;}
function applyModeClasses() {
  const m=currentMode();
  document.body.classList.toggle('mode-auction',m==='auction');
  document.body.classList.toggle('mode-mare',m==='breeding-mare');
  document.body.classList.toggle('mode-stallion',m==='breeding-stallion');
}
applyModeClasses();

// ---------- List view ----------
function renderList() {
  const horses=loadHorses();
  const mode=currentMode();
  const search=(document.getElementById('search').value||'').toLowerCase();
  const sortBy=document.getElementById('sortBy').value;

  let items=horses.map(h => {
    const s=computeScores(h,mode);
    return {h,s,vs: valueScore(h,mode)};
  });

  if(search) {
    items=items.filter(x => {
      const blob=`${x.h.name} ${x.h.sire||''} ${x.h.dam||''} ${x.h.consignor||''}`.toLowerCase();
      return blob.includes(search);
    });
  }

  items.sort((a,b) => {
    switch(sortBy) {
      case 'value':
        return (b.vs||-1)-(a.vs||-1);
      case 'name':
        return (a.h.name||'').localeCompare(b.h.name||'');
      case 'price':
        return (a.h.aReserve||1e15)-(b.h.aReserve||1e15);
      case 'date':
        return (b.h.created||0)-(a.h.created||0);
      default:
        return b.s.overall-a.s.overall;
    }
  });

  const list=document.getElementById('horseList');
  if(!items.length) {
    list.innerHTML=`<p style="color:var(--muted);padding:40px;text-align:center;grid-column:1/-1;">
      No horses saved yet. Go to <strong>Add / Edit Horse</strong> to begin.</p>`;
    return;
  }

  list.innerHTML=items.map(({h,s,vs}) => {
    const p=computeFivePillars(h,mode,currentScoreMode());
    const ps=priceSanity(h);
    const color=s.overall>=75? 'var(--good)':
      s.overall>=55? 'var(--warn)':'var(--bad)';
    const ped=[h.sire,h.dam,h.damsire].filter(Boolean).join(' × ')||'—';
    const breakdown=Object.keys(CATEGORY_LABELS).map(k => {
      const v=s.categories[k];
      if(v==null) return '';
      return `<span>${CATEGORY_LABELS[k]}</span>
              <span class="bar" style="width:80px"><div style="width:${v}%"></div></span>`;
    }).join('');
    const safePhoto=h.photoUrl&&/^https?:\/\//i.test(h.photoUrl)? h.photoUrl:null;
    const photoHtml=safePhoto
      ? `<img class="horse-card-photo" src="${escapeHtml(safePhoto)}" alt="${escapeHtml(h.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
      +coatPlaceholder('horse-card-photo-placeholder',h.color,h.name,true)
      :coatPlaceholder('horse-card-photo-placeholder',h.color,h.name,false);
    return `
      <div class="horse-card" data-id="${h.id}">
        ${photoHtml}
        <div class="score-badge" style="--score:${s.overall};--score-color:${color}">
          <span>${s.overall}</span>
        </div>
        <div class="horse-card-body">
          <h3>${escapeHtml(h.name)}</h3>
          <div class="meta">
            ${h.sex? escapeHtml(h.sex):''} ${h.hip? '· Hip '+escapeHtml(h.hip):''}
            ${h.venue? '· '+escapeHtml(h.venue):''}
          </div>
          <div class="ped"><em>By</em> ${escapeHtml(ped)}</div>
          ${p.score==null? '':`<div class="meta">5-pillar: <strong>${p.score}</strong> · ${p.decision.text} · ${p.dataFilled}/9 data</div>`}
          ${h.aReserve? `<div class="price">${fmtUSD(h.aReserve)}${ps.band? ` <span class="ps-chip ${ps.band.cls}">${ps.band.label}</span>`:''}</div>`:''}
          <div class="breakdown">${breakdown}</div>
          <div class="actions">
            <button class="btn" onclick="editHorse('${h.id}')">✏ Edit</button>
            <button class="btn" onclick="openReport('${h.id}')">📋 Report</button>
            <button class="btn" onclick="duplicateHorse('${h.id}')">⧉ Duplicate</button>
            <button class="btn danger" onclick="deleteHorse('${h.id}')">🗑</button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(s) {
  return String(s??'').replace(/[&<>"']/g,c =>
    ({'&': '&amp;','<': '&lt;','>': '&gt;','"': '&quot;',"'": '&#39;'}[c]));
}

// Coat-coloured placeholder so a missing/offline photo looks intentional (not a broken image).
function coatHex(color) {
  const c=String(color||'').toLowerCase();
  if(c.includes('chestnut')) return '#8a4b2a';
  if(c.includes('grey')||c.includes('gray')||c.includes('roan')) return '#7f8489';
  if(c.includes('dark bay')||c.includes('brown')) return '#3c2a1e';
  if(c.includes('bay')) return '#6b3f1d';
  if(c.includes('black')) return '#2b2723';
  return '#4a463f';
}
function horseInitials(name) {
  const s=String(name||'').trim();
  if(!s) return '🐎';
  return s.split(/\s+/).slice(0,2).map(w => w[0]||'').join('').toUpperCase()||'🐎';
}
function coatPlaceholder(cls,color,name,hidden) {
  return `<div class="${cls}" style="${hidden? 'display:none;':''}background:linear-gradient(135deg, ${coatHex(color)}, #171717)">`
    +`<span class="ph-initials">${escapeHtml(horseInitials(name))}</span></div>`;
}

document.getElementById('search').addEventListener('input',renderList);
document.getElementById('sortBy').addEventListener('change',renderList);

window.editHorse=function(id) {
  const h=loadHorses().find(x => x.id===id);
  if(!h) return;
  fillForm(h);
  switchView('form');
  updateLiveScore();
};
window.duplicateHorse=function(id) {
  const h=loadHorses().find(x => x.id===id);
  if(!h) return;
  const copy={...h};
  delete copy.id; delete copy.created;
  copy.name=h.name+' (copy)';
  fillForm(copy);
  switchView('form');
  updateLiveScore();
};
window.deleteHorse=function(id) {
  if(!confirm('Delete this horse?')) return;
  saveHorses(loadHorses().filter(x => x.id!==id));
  renderList();
};

// ---------- Due-diligence report (the shareable "bring this to your agent/vet" sheet) ----------
function redFlags(h) {
  const flags=[];
  if(h.vRepository===0||h.vXrays===0)
    flags.push({level: 'stop',text: 'HARD STOP — significant veterinary repository finding. Do not proceed without a clear explanation from your own vet.'});
  const map={
    flagWind: 'Wind / breathing noise',
    flagThroat: 'Throat grade III–IV (laryngeal)',
    flagOCD: 'OCD / chips on x-rays',
    flagHeart: 'Heart murmur / cardio concern',
    flagSoundness: 'Recurring soundness issue',
    flagBehavior: 'Behaviour / mind concern'
  };
  Object.keys(map).forEach(k => {if(h[k]) flags.push({level: 'warn',text: map[k]});});
  return flags;
}

const DUE_DILIGENCE=[
  'Watch the horse walk in person — is it free, athletic and over-stepping?',
  'Have YOUR OWN vet review the sale repository x-rays and throat scope',
  'Read the pedigree page: the dam’s produce record and black-type proximity',
  'Check the price against comparable sales for this sale and book',
  'Set a hard maximum bid AND a walk-away number before the ring',
  'Budget the all-in cost: vet, transport, insurance, and training',
  'Ask the consignor about any surgeries, treatments, or vices'
];

function buildReport(h) {
  const mode=currentMode();
  const p=computeFivePillars(h,mode);
  const ps=priceSanity(h);
  const flags=redFlags(h);
  const ped=[h.sire,h.dam,h.damsire].filter(Boolean).join(' × ')||'—';
  const metaBits=[
    h.sex&&escapeHtml(h.sex),
    h.hip&&('Hip '+escapeHtml(h.hip)),
    h.venue&&escapeHtml(h.venue),
    h.foalDate&&('foaled '+escapeHtml(String(h.foalDate)))
  ].filter(Boolean).join(' · ');

  const pillarRows=PILLAR_TEACH.map(t => {
    const score=p.pillars[t.key];
    const read=pillarRead(score);
    const missing=t.fields.filter(([n]) => !fieldFilled(h,n));
    const pct=score==null? 0:Math.round(score);
    return `<tr class="rp-pillar pc-${read.cls}">
      <td class="rp-pname">${t.icon} ${t.label}</td>
      <td class="rp-pread">${read.label}</td>
      <td class="rp-pbarcell"><span class="rp-bar"><span class="rp-fill" style="width:${pct}%"></span></span></td>
      <td class="rp-pmiss">${missing.length? 'Still to check: '+missing.map(([,l]) => escapeHtml(l)).join(', '):'✓ key fields entered'}</td>
    </tr>`;
  }).join('');

  const flagsBlock=flags.length
    ? `<div class="rp-flags"><h3>⚠ Red flags to resolve</h3><ul>${flags.map(f => `<li class="rp-flag-${f.level}">${escapeHtml(f.text)}</li>`).join('')}</ul></div>`
    :`<div class="rp-noflags">No red flags recorded — but that only means none were <em>entered</em>. Confirm with an in-person inspection and your vet.</div>`;

  let priceBlock='';
  if(ps.bench) {
    const band=ps.band;
    priceBlock=`<div class="rp-section">
      <h3>Price sanity</h3>
      <p><strong>${escapeHtml(ps.bench.sale)}${ps.bench.book&&ps.bench.book!=='All books'? ' · '+escapeHtml(ps.bench.book):''}</strong>
        (${escapeHtml(ps.bench.year)}) — median <strong>${fmtMoney(ps.bench.medianUSD)}</strong>, average ${fmtMoney(ps.bench.avgUSD)}.</p>
      ${ps.price!=null&&band? `<p>Your price of <strong>${fmtMoney(ps.price)}</strong> is <strong class="pc-${band.cls} rp-band">${band.label}</strong> for this sale. ${escapeHtml(band.note)}</p>`
        :'<p class="rp-muted">Enter a reserve to place it on this sale’s scale.</p>'}
      <p class="rp-muted">This reflects the sale, not this individual — a standout is worth above the median; a plain one, below.</p>
    </div>`;
  }

  return `<article class="report-doc">
    ${h._shared? '<div class="rp-shared no-print">📨 <strong>Shared with you.</strong> Someone sent you this horse to review — it isn’t saved on your device.</div>':''}
    <header class="rp-head">
      <div class="rp-title"><span class="rp-logo">🐎</span>
        <div><h2>${escapeHtml(h.name||'Unnamed horse')}</h2>
        <p class="rp-sub">Due-diligence summary · <em>By</em> ${escapeHtml(ped)}</p></div></div>
      <div class="rp-meta">${metaBits||'&nbsp;'}</div>
    </header>

    <div class="rp-read pc-${p.decision.cls==='decision-buy'? 'strong':p.decision.cls==='decision-pass'? 'weak':'mixed'}">
      <div class="rp-score"><span class="rp-score-num">${p.score==null? '—':p.score}</span><span class="rp-score-cap">on-paper score / 100</span></div>
      <div class="rp-read-txt"><strong>On-paper read: ${p.decision.text}</strong><br>
        <span class="rp-muted">A structured roll-up of the ${p.dataFilled}/9 categories entered — not a prediction of racing success.</span></div>
    </div>

    ${flagsBlock}

    <div class="rp-section">
      <h3>The five pillars</h3>
      <table class="rp-table">${pillarRows}</table>
    </div>

    ${priceBlock}

    <div class="rp-section">
      <h3>Before you bid — due-diligence checklist</h3>
      <ul class="rp-checklist">${DUE_DILIGENCE.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ul>
    </div>

    ${h.notes? `<div class="rp-section"><h3>Notes</h3><p>${escapeHtml(h.notes)}</p></div>`:''}

    <footer class="rp-foot">Generated by Horse Selector — a structured notebook for organising your judgement, not a
      substitute for a bloodstock agent and veterinarian. Always inspect and vet in person before bidding.</footer>
  </article>`;
}

let _reportHorse=null;
function renderReport(h) {
  _reportHorse=h;
  const modal=document.getElementById('reportModal');
  const content=document.getElementById('reportContent');
  if(!modal||!content) return;
  content.innerHTML=buildReport(h);
  modal.classList.remove('hidden');
}
window.openReport=function(id) {
  const h=loadHorses().find(x => x.id===id);
  if(h) renderReport(h);
};

// Encode a horse into a shareable URL (no backend — the data rides in the link hash).
function shareUrl(h) {
  const clean={...h};
  delete clean.id; delete clean.created; delete clean.updated; delete clean._shared;
  const bytes=new TextEncoder().encode(JSON.stringify(clean));
  let bin=''; bytes.forEach(b => bin+=String.fromCharCode(b));
  // URL-safe base64 (base64url) so the payload survives intact in the link fragment.
  const b64=btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  return location.href.split('#')[0]+'#horse='+b64;
}
function decodeSharedHorse(s) {
  let b64=String(s).replace(/-/g,'+').replace(/_/g,'/');
  while(b64.length%4) b64+='=';
  const bin=atob(b64);
  const bytes=Uint8Array.from(bin,c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

(function initReport() {
  const modal=document.getElementById('reportModal');
  if(!modal) return;
  const close=document.getElementById('btnCloseReport');
  const print=document.getElementById('btnPrintReport');
  const share=document.getElementById('btnShareReport');
  if(close) close.addEventListener('click',() => modal.classList.add('hidden'));
  if(print) print.addEventListener('click',() => window.print());
  if(share) share.addEventListener('click',async () => {
    if(!_reportHorse) return;
    const url=shareUrl(_reportHorse);
    let ok=false;
    try {await navigator.clipboard.writeText(url); ok=true;} catch {}
    if(!ok) {
      try {
        const t=document.createElement('textarea');
        t.value=url; t.style.position='fixed'; t.style.opacity='0';
        document.body.appendChild(t); t.select(); ok=document.execCommand('copy'); t.remove();
      } catch {}
    }
    const orig=share.dataset.orig||(share.dataset.orig=share.textContent);
    share.textContent=ok? '✓ Link copied':'⚠ Copy failed';
    setTimeout(() => {share.textContent=orig;},1900);
  });
  modal.addEventListener('click',e => {if(e.target===modal) modal.classList.add('hidden');});
})();

// If the page was opened via a shared link (#horse=…), show that horse's report read-only.
// NOTE: opening a shared horse's report is deferred to the very end of this file — it
// calls buildReport(), which reads consts (PILLAR_TEACH, DUE_DILIGENCE) declared below,
// so it must run after they're initialized.

// ---------- Guided read: the 5-pillar teaching checklist ----------
// Each pillar explains WHAT to look at and WHY, shows your current read, and — most
// importantly for a first-time buyer — flags which key fields you still need to assess it.
const PILLAR_TEACH=[
  {key: 'pillarGenetics',label: 'Genetics & Pedigree',icon: '🧬',
    why: 'Who the sire and dam are, and what the family has already produced. The single best clue you have on a young horse — but on its own still a weak predictor, so weigh it, don’t worship it.',
    look: 'Look for a productive dam (winners & black-type), a proven sire, and black-type close up in the first 2–3 generations.',
    fields: [['sire','sire'],['sireAEI','sire AEI'],['dam','dam'],['damWinners','dam’s winners'],['blackType3','black-type in family'],['nick','nick rating']]},
  {key: 'pillarSoundness',label: 'Physical Soundness',icon: '🦴',
    why: 'The frame, the walk, and the vet’s repository read. This is the pillar that can end a purchase — a serious x-ray finding is a HARD STOP. It needs your own eyes and your own vet.',
    look: 'Look for a free, athletic walk, a balanced frame, and a clean or only-minor vet repository. You must see the horse in person for this.',
    fields: [['cImpression','conformation impression'],['cWalk','walk quality'],['vRepository','vet repository read']]},
  {key: 'pillarPerformance',label: 'Performance',icon: '🏁',
    why: 'What the horse has actually done on the track — races, wins, earnings, speed figures, class. Blank for an unraced yearling, and that’s completely normal.',
    look: 'Look for wins and places relative to starts, a strong best speed figure (Beyer/Timeform), and the highest class of race won.',
    fields: [['pStarts','starts'],['pWins','wins'],['pEarnings','earnings'],['pClass','highest class']]},
  {key: 'pillarValue',label: 'Price & Value',icon: '⚖️',
    why: 'Is the price sane for this kind of horse? A great horse at a crazy price can be a worse buy than a solid one at a fair price. (Heads-up: the built-in ratio favours cheaper horses — sanity-check it against real sale prices.)',
    look: 'Look for a reserve that lines up with what similar pedigrees are making at this sale, and a reputable consignor.',
    fields: [['aReserve','reserve / price'],['aMarketEst','your market estimate'],['aConsignor','consignor reputation']]},
  {key: 'pillarMind',label: 'Mind & Trainability',icon: '🧠',
    why: 'Temperament and, for youngsters, an early foaling date (a February foal has a head start on a May one). A professional, focused attitude lowers training cost and injury risk.',
    look: 'Look for a bold but trainable attitude on the shank, and — for 2yo prospects — an early-in-the-year foaling date.',
    fields: [['temperament','temperament'],['foalDate','foaling date']]}
];

function pillarRead(score) {
  if(score==null) return {label: 'Not yet assessed',cls: 'na'};
  if(score>=75) return {label: 'Strong on paper',cls: 'strong'};
  if(score>=60) return {label: 'Solid',cls: 'solid'};
  if(score>=45) return {label: 'Mixed',cls: 'mixed'};
  return {label: 'Thin / weak',cls: 'weak'};
}

function fieldFilled(h,name) {
  const v=h? h[name]:null;
  return v!=null&&v!=='';
}

function renderPillarChecklist(currentHorse) {
  const el=document.getElementById('pillarChecklist');
  if(!el) return;
  const h=currentHorse||{};
  const p=computeFivePillars(h,currentMode());
  el.innerHTML=PILLAR_TEACH.map(t => {
    const score=p.pillars[t.key];
    const read=pillarRead(score);
    const missing=t.fields.filter(([n]) => !fieldFilled(h,n));
    const filledCount=t.fields.length-missing.length;
    const limited=score!=null&&filledCount<=1;
    const pct=score==null? 0:Math.round(score);
    const missTxt=missing.length
      ? `<div class="pc-missing">Add to assess: ${missing.slice(0,3).map(([,l]) => `<span>${l}</span>`).join('')}</div>`
      :`<div class="pc-missing pc-complete">✓ key fields entered</div>`;
    return `<div class="pc-row pc-${read.cls}">
      <div class="pc-icon" aria-hidden="true">${t.icon}</div>
      <div class="pc-main">
        <div class="pc-top">
          <span class="pc-name">${t.label}</span>
          <span class="pc-read">${read.label}${limited? ' · limited data':''}</span>
        </div>
        <div class="pc-bar" role="img" aria-label="${read.label}"><div class="pc-fill" style="width:${pct}%"></div></div>
        <p class="pc-why">${t.why}</p>
        <p class="pc-look">${t.look}</p>
        ${missTxt}
      </div>
    </div>`;
  }).join('');
}

// ---------- Learn from the legends (presets as an education tool, NOT a leaderboard) ----------
function legendInsights(pr) {
  const out=[];
  const money=n => '$'+Math.round(n).toLocaleString('en-US');
  if(pr.pStarts) {
    let t=`Raced ${pr.pStarts} times for ${pr.pWins||0} win${pr.pWins===1? '':'s'}`;
    if(pr.pPlaces) t+=` and ${pr.pPlaces} placing${pr.pPlaces===1? '':'s'}`;
    if(pr.pWins===pr.pStarts&&pr.pStarts>0) t+=' — undefeated';
    if(pr.pEarnings) t+=`, earning ${money(pr.pEarnings)}`;
    out.push({p: 'Performance',t: t+'.'});
    if(pr.pSpeed) {
      const q=pr.pSpeed>=118? 'among the highest ever recorded':pr.pSpeed>=105? 'a genuine Grade 1 level':'a solid figure';
      out.push({p: 'Performance',t: `Best speed figure (Beyer) of ${pr.pSpeed} — ${q}.`});
    }
  }
  if(pr.sire||pr.dam) {
    let t=`By ${pr.sire||'—'} out of ${pr.dam||'—'}${pr.damsire? ` (damsire ${pr.damsire})`:''}.`;
    if(pr.blackType3>=3) t+=' A Group/Grade 1 family — stakes-class relatives right up close.';
    else if(pr.blackType3===2) t+=' Multiple black-type relatives in the family.';
    out.push({p: 'Genetics',t});
  }
  if(pr.aReserve) {
    let t=`Bought for ${money(pr.aReserve)} as a young horse`;
    if(pr.aReserve<=60000) t+=' — a famous bargain, and proof that price and class don’t always match';
    out.push({p: 'Price & Value',t: t+'.'});
  } else if(pr.bStudFee) {
    out.push({p: 'Price & Value',t: `Now commands a stud fee around ${money(pr.bStudFee)} — the market’s verdict on a proven sire.`});
  }
  return out;
}

function renderLegendsPanel() {
  const sel=document.getElementById('legendSelect');
  const panel=document.getElementById('legendPanel');
  if(!sel||!panel||typeof HORSE_PRESETS==='undefined') return;
  const idx=parseInt(sel.value,10);
  const pr=isNaN(idx)? null:HORSE_PRESETS[idx];
  if(!pr) {
    panel.innerHTML='<p class="hint">Pick a legend above to see what makes an elite page — and why.</p>';
    return;
  }
  const insights=legendInsights(pr);
  const safePhoto=pr.photoUrl&&/^https?:\/\//i.test(pr.photoUrl)? pr.photoUrl:null;
  panel.innerHTML=`
    <div class="legend-card">
      ${safePhoto
        ? `<img class="legend-photo" src="${escapeHtml(safePhoto)}" alt="${escapeHtml(pr.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
          +coatPlaceholder('legend-photo legend-photo-ph',pr.color,pr.name,true)
        :coatPlaceholder('legend-photo legend-photo-ph',pr.color,pr.name,false)}
      <div class="legend-body">
        <h4>${escapeHtml(pr.name)} <span class="hint">${escapeHtml(pr.country||'')}${pr.foalDate? ' · '+String(pr.foalDate).slice(0,4):''}</span></h4>
        ${pr.notes? `<p class="legend-note">${escapeHtml(pr.notes)}</p>`:''}
        <ul class="legend-insights">
          ${insights.map(i => `<li><span class="li-tag">${escapeHtml(i.p)}</span><span>${escapeHtml(i.t)}</span></li>`).join('')}
        </ul>
        <p class="legend-foot">This is what an <strong>elite</strong> page looks like — a benchmark to learn from,
          not a bar your prospect has to clear. Most good, sound, sensibly-priced horses score nowhere near this,
          and that’s completely normal.</p>
      </div>
    </div>`;
}

// ---------- Price sanity check (real published median-by-sale data) ----------
// Answers "is this price normal FOR THIS SALE?" — the one genuinely defensible,
// data-grounded feature. It is NOT a per-horse appraisal.
function getBenchmark(id) {
  if(!id||typeof SALE_BENCHMARKS==='undefined') return null;
  return SALE_BENCHMARKS.sales.find(s => s.id===id)||null;
}

// Band a price against a sale's median. Multipliers approximate the (right-skewed,
// roughly log-normal) spread of auction prices around the median for that sale.
function priceBand(price,median) {
  if(price==null||price<=0||median==null||median<=0) return null;
  const r=price/median;
  if(r<0.4) return {key: 'well-below',label: 'Well below typical',cls: 'pb-low',
    note: 'Much cheaper than most at this sale — could be a genuine bargain, or a sign the market sees a problem. Find out which.'};
  if(r<0.8) return {key: 'below',label: 'Below typical',cls: 'pb-lowmid',
    note: 'At the value end for this sale — worth a closer look if the horse is sound.'};
  if(r<=2.0) return {key: 'within',label: 'In the typical range',cls: 'pb-mid',
    note: 'A normal price for this sale — the price itself raises no flags either way.'};
  if(r<=4.0) return {key: 'above',label: 'Above typical',cls: 'pb-highmid',
    note: 'You would be paying up. Make sure the individual and the page justify a premium.'};
  return {key: 'well-above',label: 'Well above typical',cls: 'pb-high',
    note: 'A premium price for this sale — reserved for the standouts. Be sure this is one.'};
}

function priceSanity(h) {
  const bench=getBenchmark(h&&h.saleBenchmark);
  const price=h? (h.aReserve!=null? h.aReserve:(h.aMarketEst!=null? h.aMarketEst:null)):null;
  if(!bench) return {bench: null,price,band: null};
  return {bench,price,band: priceBand(price,bench.medianUSD)};
}

const fmtMoney=n => n==null? '—':'$'+Math.round(n).toLocaleString('en-US');

function renderPriceSanity(currentHorse) {
  const el=document.getElementById('priceSanity');
  if(!el) return;
  const h=currentHorse||{};
  const {bench,price,band}=priceSanity(h);
  if(!bench) {
    el.innerHTML='<p class="ps-hint">Pick the sale (and book) above and enter a reserve or market estimate to check whether the price is in the normal range for that sale.</p>';
    return;
  }
  const nativeLabel=(bench.currency!=='USD'&&bench.medianNative!=null)
    ? ` (${bench.currency==='guineas'? bench.medianNative.toLocaleString()+' gns':bench.currency+' '+bench.medianNative.toLocaleString()})`
    :'';
  const line=`<div class="ps-bench">
      <strong>${escapeHtml(bench.sale)}${bench.book&&bench.book!=='All books'? ' · '+escapeHtml(bench.book):''}</strong>
      <span class="hint">${escapeHtml(bench.year)} · ${escapeHtml(bench.type)}</span><br>
      Median <strong>${fmtMoney(bench.medianUSD)}</strong>${nativeLabel} · Average ${fmtMoney(bench.avgUSD)}
    </div>`;

  const lo=bench.medianUSD/8,hi=bench.medianUSD*8;
  const posOf=v => {
    const p=(Math.log10(v)-Math.log10(lo))/(Math.log10(hi)-Math.log10(lo))*100;
    return Math.max(0,Math.min(100,p));
  };
  let gauge='';
  if(price!=null&&price>0) {
    const bandLo=posOf(bench.medianUSD*0.4),bandHi=posOf(bench.medianUSD*2.0);
    const mk=posOf(price);
    gauge=`<div class="ps-gauge">
      <div class="ps-track"></div>
      <div class="ps-typical" style="left:${bandLo}%;width:${bandHi-bandLo}%"></div>
      <div class="ps-median" style="left:${posOf(bench.medianUSD)}%" title="median"></div>
      <div class="ps-marker ${band? band.cls:''}" style="left:${mk}%"><span>${fmtMoney(price)}</span></div>
    </div>
    <div class="ps-scale"><span>${fmtMoney(lo)}</span><span>median ${fmtMoney(bench.medianUSD)}</span><span>${fmtMoney(hi)}</span></div>`;
  }
  const verdict=(price!=null&&price>0&&band)
    ? `<div class="ps-verdict ${band.cls}"><span class="ps-band">${band.label}</span> ${escapeHtml(band.note)}</div>`
    :'<p class="ps-hint">Enter a reserve or market estimate above to see where this price sits on the scale.</p>';
  const approxNote=bench.confidence&&bench.confidence!=='high'
    ? ' (this sale’s median is partly derived — treat as approximate)':'';
  el.innerHTML=line+gauge+verdict+
    `<p class="ps-caveat">This asks only “is the price normal <em>for this sale</em>?” — not whether it’s right for <em>this horse</em>.
      A standout individual is worth well above the median; a plain one, well below. ${escapeHtml(bench.year)} figures: ${escapeHtml(bench.source)}${approxNote}.</p>`;
}

// ---------- Compare view ----------
function renderCompare() {
  const horses=loadHorses();
  const sel=document.getElementById('compareSelect');
  if(!horses.length) {
    sel.innerHTML=`<p style="color:var(--muted)">Save horses first.</p>`;
    document.getElementById('compareTable').innerHTML='';
    return;
  }
  sel.innerHTML=horses.map(h =>
    `<label><input type="checkbox" value="${h.id}"> ${escapeHtml(h.name)}</label>`
  ).join('');
  sel.querySelectorAll('input').forEach(cb =>
    cb.addEventListener('change',renderCompareTable));
  renderCompareTable();
}

function renderCompareTable() {
  const ids=[...document.querySelectorAll('#compareSelect input:checked')]
    .map(c => c.value).slice(0,4);
  const horses=loadHorses().filter(h => ids.includes(h.id));
  const out=document.getElementById('compareTable');
  if(horses.length<2) {
    out.innerHTML=`<p style="color:var(--muted)">Pick at least 2 horses.</p>`;
    return;
  }
  const mode=currentMode();
  const scores=horses.map(h => computeScores(h,mode));

  const fields=[
    ['__section','Identity'],
    ['name','Name'],['sex','Sex'],['foalDate','Foal date'],
    ['hip','Hip'],['venue','Venue'],['consignor','Consignor'],
    ['__section','Pedigree'],
    ['sire','Sire'],['sireFee','Sire fee','usd'],
    ['sireAEI','Sire AEI'],['dam','Dam'],
    ['damWinners','Dam winners'],['damBlackType','Dam BT'],
    ['damsire','Damsire'],['nick','Nick'],
    ['__section','Physical'],
    ['height','Height (h)'],['cannonIn','Cannon (in)'],
    ['__section','Veterinary'],
    ['vXrays','X-rays'],['vScope','Scope'],
    ['vHeart','Heart'],['vWind','Wind'],
    ['__section','Auction'],
    ['aReserve','Reserve','usd'],['aMarketEst','Market est','usd'],
    ['__section','Sub-scores'],
    ['_pedigree','Pedigree'],['_conformation','Conformation'],
    ['_veterinary','Veterinary'],['_physical','Physical'],
    ['_performance','Performance'],['_auction','Auction'],
    ['_breeding','Breeding'],['_temperament','Temperament'],
    ['_foalDate','Foal date'],
    ['__section','OVERALL'],
    ['_overall','Overall Score'],
  ];

  const rows=fields.map(([k,label,fmt]) => {
    if(k==='__section')
      return `<tr class="section"><td colspan="${horses.length+1}">${label}</td></tr>`;
    const vals=horses.map((h,i) => {
      let v;
      if(k==='_overall') v=scores[i].overall;
      else if(k.startsWith('_')) v=scores[i].categories[k.slice(1)];
      else v=h[k];
      if(v==null||v==='') return null;
      return v;
    });
    // best/worst highlight for numeric
    const numericVals=vals.map(v => typeof v==='number'? v:null);
    const validNums=numericVals.filter(v => v!=null);
    const max=validNums.length? Math.max(...validNums):null;
    const min=validNums.length? Math.min(...validNums):null;
    const cells=vals.map((v,i) => {
      let cls='';
      if(typeof v==='number'&&validNums.length>1) {
        if(v===max) cls='best';
        else if(v===min&&max!==min) cls='worst';
      }
      let display=v==null? '—':
        (fmt==='usd'? fmtUSD(v):
          (typeof v==='number'? (Math.round(v*10)/10):escapeHtml(v)));
      return `<td class="${cls}">${display}</td>`;
    }).join('');
    return `<tr><th>${label}</th>${cells}</tr>`;
  }).join('');

  out.innerHTML=`<table>
    <thead><tr><th></th>${horses.map(h => `<th>${escapeHtml(h.name)}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody></table>`;
}

// ---------- Import / Export ----------
document.getElementById('btnExportJSON').addEventListener('click',() => {
  const horses=loadHorses();
  const data=JSON.stringify(horses,null,2);
  download('horses-backup.json',data,'application/json');
  try {
    localStorage.setItem('lastBackupAt',String(Date.now()));
    localStorage.setItem('lastBackupCount',String(horses.length));
  } catch {}
  updateBackupStatus();
  toast(`Backup downloaded — ${horses.length} horse${horses.length===1? '':'s'}`);
});

function updateBackupStatus() {
  const el=document.getElementById('backupStatus');
  if(!el) return;
  const count=loadHorses().length;
  const at=parseInt(localStorage.getItem('lastBackupAt')||'',10);
  const backedCount=parseInt(localStorage.getItem('lastBackupCount')||'0',10);
  if(!at||isNaN(at)) {
    el.className='backup-status'+(count? ' backup-warn':'');
    el.textContent=count? `⚠ You have ${count} horse${count===1? '':'s'} saved and no backup yet. Export a JSON backup now.`:'';
    return;
  }
  const days=Math.floor((Date.now()-at)/86400000);
  const when=days<=0? 'today':days===1? 'yesterday':`${days} days ago`;
  const stale=count>backedCount||days>=14;
  el.className='backup-status'+(stale? ' backup-warn':' backup-ok');
  el.textContent=stale
    ? `⚠ Last backup ${when} (${backedCount} horse${backedCount===1? '':'s'}); you now have ${count}. Export an up-to-date backup.`
    :`✓ Last backup ${when} — ${backedCount} horse${backedCount===1? '':'s'} saved.`;
}

document.getElementById('btnExportCSV').addEventListener('click',() => {
  const horses=loadHorses();
  if(!horses.length) {toast('No horses to export yet','info'); return;}
  const mode=currentMode();
  // Collect all keys plus computed scores
  const keys=[...new Set(horses.flatMap(h => Object.keys(h)))];
  const headers=[...keys,'overallScore',...Object.keys(CATEGORY_LABELS).map(k => 'score_'+k)];
  const rows=horses.map(h => {
    const s=computeScores(h,mode);
    const row=keys.map(k => csvCell(h[k]));
    row.push(s.overall);
    Object.keys(CATEGORY_LABELS).forEach(k =>
      row.push(s.categories[k]==null? '':Math.round(s.categories[k]*10)/10));
    return row.join(',');
  });
  const csv=headers.join(',')+'\n'+rows.join('\n');
  download('horses-export.csv',csv,'text/csv');
});

function csvCell(v) {
  if(v==null) return '';
  const s=String(v);
  if(/[",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
  return s;
}

function download(name,content,type) {
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=name;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('importFile').addEventListener('change',e => {
  const f=e.target.files[0];
  if(!f) return;
  const reader=new FileReader();
  reader.onload=() => {
    try {
      const data=JSON.parse(reader.result);
      if(!Array.isArray(data)) throw new Error('Expected an array');
      if(!confirm(`Import ${data.length} horses? This replaces current data.`)) return;
      saveHorses(data);
      renderList();
      toast(`Imported ${data.length} horse${data.length===1? '':'s'}`);
    } catch(err) {
      toast('Import failed: '+err.message,'error',4000);
    }
  };
  reader.readAsText(f);
  e.target.value='';
});

document.getElementById('btnClear').addEventListener('click',() => {
  if(!confirm('Delete ALL saved horses? This cannot be undone.')) return;
  if(!confirm('Are you absolutely sure?')) return;
  saveHorses([]);
  renderList();
});

// ---------- Weights modal ----------
const weightsModal=document.getElementById('weightsModal');
document.getElementById('btnWeights').addEventListener('click',openWeights);
document.getElementById('btnCloseWeights').addEventListener('click',
  () => weightsModal.classList.add('hidden'));
document.getElementById('btnResetWeights').addEventListener('click',() => {
  const m=currentMode();
  saveWeights(m,{...DEFAULT_WEIGHTS[m]});
  openWeights();
});
document.getElementById('btnSaveWeights').addEventListener('click',() => {
  const m=currentMode();
  const w={};
  weightsModal.querySelectorAll('input[type="range"]').forEach(r => {
    w[r.dataset.key]=parseInt(r.value,10);
  });
  saveWeights(m,w);
  weightsModal.classList.add('hidden');
  updateLiveScore();
  renderList();
});

function openWeights() {
  const m=currentMode();
  document.getElementById('weightsModeLabel').textContent=
    modeSel.options[modeSel.selectedIndex].text;
  const w=loadWeights(m);
  document.getElementById('weightsSliders').innerHTML=
    Object.keys(CATEGORY_LABELS).map(k => `
      <div class="weight-row">
        <label>${CATEGORY_LABELS[k]}</label>
        <input type="range" min="0" max="40" value="${w[k]??0}" data-key="${k}"
               oninput="this.nextElementSibling.textContent=this.value">
        <output>${w[k]??0}</output>
      </div>`).join('');
  weightsModal.classList.remove('hidden');
}

// ---------- Update banner (service worker) ----------
(function initUpdateBanner() {
  const banner=document.getElementById('updateBanner');
  let pendingWorker=null;

  if('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange',() => {
      // SW took control — a reload will load the new version
      if(pendingWorker) window.location.reload();
    });

    navigator.serviceWorker.ready.then(reg => {
      reg.addEventListener('updatefound',() => {
        const newWorker=reg.installing;
        newWorker.addEventListener('statechange',() => {
          if(newWorker.state==='installed'&&navigator.serviceWorker.controller) {
            pendingWorker=newWorker;
            banner.classList.remove('hidden');
          }
        });
      });
    });
  }

  document.getElementById('btnReload').addEventListener('click',() => {
    if(pendingWorker) pendingWorker.postMessage({type: 'SKIP_WAITING'});
    else window.location.reload();
  });
  document.getElementById('btnDismiss').addEventListener('click',() =>
    banner.classList.add('hidden'));
})();

// ---------- Theme toggle (light / dark) ----------
(function initTheme() {
  const btn=document.getElementById('btnTheme');
  const saved=localStorage.getItem('theme'); // 'light' | 'dark' | null
  const mq=window.matchMedia? window.matchMedia('(prefers-color-scheme: dark)'):null;
  // No saved choice → follow the OS (default light only if the OS isn't set to dark).
  const startLight=saved? saved==='light':!(mq&&mq.matches);

  function applyTheme(light,persist) {
    document.body.classList.toggle('light',light);
    btn.textContent=light? '🌙 Dark':'☀ Light';
    if(persist) {try {localStorage.setItem('theme',light? 'light':'dark');} catch {}}
  }

  applyTheme(startLight,false);
  btn.addEventListener('click',() =>
    applyTheme(!document.body.classList.contains('light'),true));

  // Keep following the OS until the user picks a theme explicitly.
  if(!saved&&mq) {
    const onChange=e => {if(!localStorage.getItem('theme')) applyTheme(!e.matches,false);};
    if(mq.addEventListener) mq.addEventListener('change',onChange);
    else if(mq.addListener) mq.addListener(onChange);
  }
})();

// ---------- About modal ----------
(function initAbout() {
  const modal=document.getElementById('aboutModal');
  document.getElementById('btnAbout').addEventListener('click',() =>
    modal.classList.remove('hidden'));
  document.getElementById('btnCloseAbout').addEventListener('click',() =>
    modal.classList.add('hidden'));
  modal.addEventListener('click',e => {
    if(e.target===modal) modal.classList.add('hidden');
  });
  document.addEventListener('keydown',e => {
    if(e.key==='Escape') modal.classList.add('hidden');
  });
})();

// ---------- Glossary modal (plain-language jargon buster for first-time buyers) ----------
(function initGlossary() {
  const modal=document.getElementById('glossaryModal');
  const open=document.getElementById('btnGlossary');
  const close=document.getElementById('btnCloseGlossary');
  if(!modal||!open) return;
  open.addEventListener('click',() => modal.classList.remove('hidden'));
  if(close) close.addEventListener('click',() => modal.classList.add('hidden'));
  modal.addEventListener('click',e => {if(e.target===modal) modal.classList.add('hidden');});
  document.addEventListener('keydown',e => {if(e.key==='Escape') modal.classList.add('hidden');});
})();

// ---------- Init ----------
document.getElementById('countSaved').textContent=loadHorses().length;
// Don't call updateLiveScore() here — only call it after user loads/enters data
// This prevents default pillar values from showing before any horse is selected

// Populate the "Learn from the legends" selector and wire it up.
(function initLegends() {
  const sel=document.getElementById('legendSelect');
  if(!sel||typeof HORSE_PRESETS==='undefined') return;
  HORSE_PRESETS
    .map((p,i) => ({p,i}))
    .sort((a,b) => a.p.name.localeCompare(b.p.name))
    .forEach(({p,i}) => {
      const opt=document.createElement('option');
      opt.value=i;
      opt.textContent=`${p.name}  (${p.country||'?'}, ${(p.foalDate||'').slice(0,4)})`;
      sel.appendChild(opt);
    });
  // Default to an iconic, instructive example (Frankel — undefeated, highest-rated ever).
  const frankel=HORSE_PRESETS.findIndex(p => p.name==='Frankel');
  if(frankel>=0) sel.value=String(frankel);
  sel.addEventListener('change',renderLegendsPanel);
  renderLegendsPanel();
})();

// Populate the "Price sanity check" sale selector from the benchmark dataset.
(function initSaleBenchmarks() {
  const sel=form&&form.elements.namedItem('saleBenchmark');
  if(!sel||typeof SALE_BENCHMARKS==='undefined') return;
  SALE_BENCHMARKS.sales.forEach(s => {
    const opt=document.createElement('option');
    opt.value=s.id;
    opt.textContent=`${s.sale}${s.book&&s.book!=='All books'? ' — '+s.book:''} (${s.year})`;
    sel.appendChild(opt);
  });
})();

// Initial guided-read checklist + price panel (empty state).
renderPillarChecklist({});
renderPriceSanity({});

// ---------- Preset loader ----------
(function initPresets() {
  if(typeof HORSE_PRESETS==='undefined') return;
  const sel=document.getElementById('presetSelect');
  HORSE_PRESETS
    .slice()
    .sort((a,b) => a.name.localeCompare(b.name))
    .forEach((p,i) => {
      const opt=document.createElement('option');
      // index into original array
      opt.value=HORSE_PRESETS.indexOf(p);
      opt.textContent=`${p.name}  (${p.country||'?'}, ${(p.foalDate||'').slice(0,4)})`;
      sel.appendChild(opt);
    });

  // Preset auto-load on dropdown change
  sel.addEventListener('change',() => {
    const idx=parseInt(sel.value,10);
    if(isNaN(idx)) return; // User cleared the selection
    const preset=HORSE_PRESETS[idx];
    // Clear current form, then fill (preserve no id so save creates new record)
    fillForm({...preset});
    updateLiveScore();
    // Scroll to top of form
    document.getElementById('horseForm').scrollIntoView({behavior: 'smooth',block: 'start'});
  });

  // "Enter your own horse" — clear form and scroll to identity entry
  const btnOwnHorse=document.getElementById('btnEnterOwnHorse');
  if(btnOwnHorse) {
    btnOwnHorse.addEventListener('click',() => {
      // Clear form like Reset button does
      form.reset();
      form.querySelectorAll('input[type="range"]').forEach(r => {
        delete r.dataset.touched;
        if(r.nextElementSibling) r.nextElementSibling.textContent='—';
      });
      form.querySelectorAll('input[type="checkbox"]').forEach(cb => {cb.checked=false;});
      updatePhotoPreview('');
      clearDraft();
      updateLiveScore();
      // Scroll to form and focus on name field
      document.getElementById('horseForm').scrollIntoView({behavior: 'smooth',block: 'start'});
      setTimeout(() => {
        const nameField=form.elements.namedItem('name');
        if(nameField) nameField.focus();
      },300);
    });
  }
})();

// ---------- Click-popover for info buttons ----------
(function initInfoPopovers() {
  const pop=document.getElementById('infoPopover');
  if(!pop) return;

  document.addEventListener('click',e => {
    const btn=e.target.closest('button.info');
    if(btn) {
      e.preventDefault();
      e.stopPropagation();
      const text=btn.dataset.info||'';
      pop.textContent=text;
      pop.classList.remove('hidden');
      const r=btn.getBoundingClientRect();
      // position below the button, accounting for scroll
      const top=r.bottom+window.scrollY+8;
      let left=r.left+window.scrollX-6;
      pop.style.top=top+'px';
      pop.style.left=left+'px';
      // adjust if overflowing right edge
      const popRect=pop.getBoundingClientRect();
      if(popRect.right>window.innerWidth-10) {
        left=window.innerWidth-popRect.width-10+window.scrollX;
        pop.style.left=left+'px';
      }
    } else if(!e.target.closest('#infoPopover')) {
      pop.classList.add('hidden');
    }
  });

  document.addEventListener('keydown',e => {
    if(e.key==='Escape') pop.classList.add('hidden');
  });

  window.addEventListener('scroll',() => pop.classList.add('hidden'),{passive: true});
})();

// ---------- Accessibility: modal focus management + trap, info-button labels ----------
(function initModalA11y() {
  document.querySelectorAll('button.info').forEach(b => {
    if(!b.getAttribute('aria-label')) b.setAttribute('aria-label','More information');
  });
  const pop=document.getElementById('infoPopover');
  if(pop) pop.setAttribute('role','tooltip');

  const modals=[...document.querySelectorAll('.modal')];
  const SEL='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const lastFocus=new WeakMap();

  modals.forEach(modal => {
    new MutationObserver(() => {
      if(!modal.classList.contains('hidden')) {
        lastFocus.set(modal,document.activeElement);
        const target=modal.querySelector('.about-close,#btnCloseReport,#btnCloseGlossary,#btnCloseAbout,#btnCloseWeights')
          ||modal.querySelector(SEL);
        if(target) setTimeout(() => {try {target.focus();} catch {}},30);
      } else {
        const prev=lastFocus.get(modal);
        if(prev&&prev.focus) {try {prev.focus();} catch {}}
      }
    }).observe(modal,{attributes: true,attributeFilter: ['class']});
  });

  document.addEventListener('keydown',e => {
    const open=modals.find(m => !m.classList.contains('hidden'));
    if(!open) return;
    if(e.key==='Escape') {open.classList.add('hidden'); return;}
    if(e.key!=='Tab') return;
    const f=[...open.querySelectorAll(SEL)].filter(el => el.offsetParent!==null);
    if(!f.length) return;
    const first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first) {e.preventDefault(); last.focus();}
    else if(!e.shiftKey&&document.activeElement===last) {e.preventDefault(); first.focus();}
  });
})();

// ---------- First-run welcome (only for brand-new users) ----------
(function initWelcome() {
  const card=document.getElementById('welcomeCard');
  if(!card) return;
  const dismissed=localStorage.getItem('welcomeDismissed')==='1';
  const hasHorses=loadHorses().length>0;
  const hasDraft=!!localStorage.getItem('horse-draft');
  const shared=/[#&]horse=/.test(location.hash||'');
  if(!dismissed&&!hasHorses&&!hasDraft&&!shared) card.classList.remove('hidden');
  const btn=document.getElementById('btnCloseWelcome');
  if(btn) btn.addEventListener('click',() => {
    card.classList.add('hidden');
    try {localStorage.setItem('welcomeDismissed','1');} catch {}
  });
})();

// ---------- Open a shared horse's report (must run last — depends on consts above) ----------
(function initSharedHorse() {
  const m=(location.hash||'').match(/[#&]horse=([^&]+)/);
  if(!m) return;
  try {
    const h=decodeSharedHorse(decodeURIComponent(m[1]));
    if(h&&typeof h==='object'&&h.name) {h._shared=true; renderReport(h);}
  } catch {/* malformed link — ignore */}
})();
