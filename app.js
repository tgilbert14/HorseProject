/* ===== Horse Selector — app logic =====
   Storage:  localStorage key 'horses' (array of records)
             localStorage key 'weights:<mode>' (object)
*/

const STORAGE_KEY = 'horses';
const WEIGHTS_KEY = (m) => `weights:${m}`;

// ---------- Default category weights per mode ----------
const DEFAULT_WEIGHTS = {
  'auction': {
    pedigree: 30, conformation: 22, veterinary: 15,
    physical: 5, performance: 8, auction: 10,
    breeding: 0, temperament: 5, foalDate: 5
  },
  'breeding-mare': {
    pedigree: 28, conformation: 12, veterinary: 8,
    physical: 3, performance: 10, auction: 5,
    breeding: 28, temperament: 3, foalDate: 3
  },
  'breeding-stallion': {
    pedigree: 25, conformation: 12, veterinary: 8,
    physical: 3, performance: 12, auction: 0,
    breeding: 35, temperament: 2, foalDate: 3
  }
};

const CATEGORY_LABELS = {
  pedigree: 'Pedigree', conformation: 'Conformation',
  veterinary: 'Veterinary', physical: 'Physical',
  performance: 'Performance', auction: 'Auction/Price',
  breeding: 'Breeding', temperament: 'Temperament', foalDate: 'Foaling Date'
};

// ---------- Storage helpers ----------
function loadHorses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveHorses(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  document.getElementById('countSaved').textContent = arr.length;
}
function loadWeights(mode) {
  try {
    const w = JSON.parse(localStorage.getItem(WEIGHTS_KEY(mode)));
    return w || { ...DEFAULT_WEIGHTS[mode] };
  } catch { return { ...DEFAULT_WEIGHTS[mode] }; }
}
function saveWeights(mode, w) {
  localStorage.setItem(WEIGHTS_KEY(mode), JSON.stringify(w));
}

// ---------- Utility ----------
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const num = (v) => {
  const n = parseFloat(v);
  return isFinite(n) ? n : null;
};
const fmtUSD = (n) => n == null ? '—' :
  '$' + Math.round(n).toLocaleString('en-US');

// Map a numeric metric onto 0-100 score given target range
function rangeScore(value, lo, hi, ideal) {
  if (value == null) return null;
  if (ideal == null) ideal = (lo + hi) / 2;
  if (value < lo || value > hi) {
    const dist = value < lo ? (lo - value) : (value - hi);
    const span = hi - lo;
    return clamp(40 - (dist / span) * 80, 0, 40);
  }
  // inside range: bell-curve toward ideal
  const half = Math.max(ideal - lo, hi - ideal);
  const off = Math.abs(value - ideal) / half;
  return clamp(100 - off * 30, 70, 100);
}

// ---------- Per-category sub-scores (each returns 0-100 or null if no data) ----------
function scorePedigree(h) {
  const parts = [];
  // Sire AEI: 1.0 = avg → 50, 2.0 = elite → 90, 3+ → 100
  if (h.sireAEI != null) parts.push(clamp(20 + h.sireAEI * 30, 0, 100));
  if (h.sireFee != null) {
    // log scale: $5k → 30, $50k → 70, $250k → 95
    const f = h.sireFee;
    if (f > 0) parts.push(clamp(15 + Math.log10(f) * 18, 0, 100));
  }
  if (h.damFoals != null && h.damFoals > 0) {
    const winRate = (h.damWinners || 0) / h.damFoals;
    const btRate = (h.damBlackType || 0) / h.damFoals;
    parts.push(clamp(winRate * 80 + btRate * 200, 0, 100));
  }
  if (h.damsireAEI != null) parts.push(clamp(20 + h.damsireAEI * 30, 0, 100));
  if (h.blackType3 != null) parts.push([30, 55, 75, 95][h.blackType3] ?? 50);
  if (h.nick != null) parts.push([30, 55, 78, 95][h.nick] ?? 50);
  if (h.dosageIndex != null) {
    // Most racehorses fall 1.0–4.0; both extremes acceptable; reward "balanced specialist"
    const di = h.dosageIndex;
    if (di >= 0.5 && di <= 5) parts.push(75);
    else parts.push(50);
  }
  if (h.inbreeding != null) {
    // Wright %: 0–3% ideal (light line breeding), 3–6% ok, 6+ penalize
    const ib = h.inbreeding;
    if (ib <= 3) parts.push(85);
    else if (ib <= 6) parts.push(65);
    else parts.push(clamp(65 - (ib - 6) * 10, 0, 65));
  }
  return parts.length ? avg(parts) : null;
}

function scoreConformation(h) {
  const keys = ['cBalance','cShoulder','cHip','cCannon','cKnees',
                'cPasterns','cHooves','cNeck','cTopline','cWalk'];
  // these are 1-10 ratings; weight balance/shoulder/hip/walk slightly higher
  const weighted = {
    cBalance: 1.3, cShoulder: 1.3, cHip: 1.3, cCannon: 1.0, cKnees: 1.1,
    cPasterns: 1.0, cHooves: 1.0, cNeck: 0.7, cTopline: 0.8, cWalk: 1.5
  };
  let sum = 0, w = 0;
  keys.forEach(k => {
    const v = h[k];
    if (v != null) { sum += v * weighted[k]; w += weighted[k]; }
  });
  if (!w) return null;
  // 1–10 → 0–100 (with 6=baseline, 10=elite)
  return clamp((sum / w - 1) / 9 * 100, 0, 100);
}

function scoreVeterinary(h) {
  const parts = [];
  if (h.vXrays != null) parts.push([0, 50, 80, 100][h.vXrays] ?? 70);
  if (h.vScope != null) parts.push([0, 50, 80, 100][h.vScope] ?? 70);
  if (h.vHeart != null) parts.push([30, 75, 100][h.vHeart] ?? 70);
  if (h.vWind != null)  parts.push([20, 70, 100][h.vWind] ?? 70);
  if (h.vEyes != null)  parts.push([30, 100][h.vEyes] ?? 70);
  return parts.length ? avg(parts) : null;
}

function scorePhysical(h) {
  const parts = [];
  if (h.height != null) parts.push(rangeScore(h.height, 14.3, 16.3, 15.3));
  if (h.girth != null)  parts.push(rangeScore(h.girth, 60, 80, 72));
  if (h.cannonIn != null) parts.push(rangeScore(h.cannonIn, 7.5, 9.5, 8.25));
  return parts.length ? avg(parts.filter(x => x != null)) : null;
}

function scorePerformance(h) {
  const starts = h.pStarts || 0;
  if (starts === 0 && h.pClass == null && h.pEarnings == null) return null;
  const parts = [];
  if (starts > 0) {
    const winPct = (h.pWins || 0) / starts;
    const placePct = ((h.pWins || 0) + (h.pPlaces || 0)) / starts;
    parts.push(clamp(winPct * 200 + placePct * 50, 0, 100));
  }
  if (h.pEarnings != null && h.pEarnings >= 0) {
    // log: $10k=30, $100k=60, $1M=90, $5M+=100
    if (h.pEarnings > 0) parts.push(clamp(Math.log10(h.pEarnings) * 18 - 12, 0, 100));
    else parts.push(20);
  }
  if (h.pSpeed != null && h.pSpeed > 0) {
    // Beyer: 70=avg, 100=G1, 110+=elite
    parts.push(clamp((h.pSpeed - 50) * 1.6, 0, 100));
  }
  if (h.pClass != null) parts.push([20, 45, 65, 80, 90, 100][h.pClass] ?? 50);
  if (h.pSound != null) parts.push([20, 60, 100][h.pSound] ?? 70);
  return parts.length ? avg(parts) : null;
}

function scoreAuction(h) {
  // Higher score when market value > reserve (i.e., good buy)
  if (h.aReserve == null && h.aMarketEst == null && h.aConsignor == null) return null;
  const parts = [];
  if (h.aReserve != null && h.aMarketEst != null && h.aReserve > 0) {
    const ratio = h.aMarketEst / h.aReserve;
    parts.push(clamp(ratio * 50, 0, 100));
  }
  if (h.aConsignor != null) parts.push([40, 70, 95][h.aConsignor] ?? 60);
  return parts.length ? avg(parts) : null;
}

function scoreBreeding(h, mode) {
  const parts = [];
  if (mode === 'breeding-mare' || h.bFoalsProduced != null) {
    if (h.bFoalsProduced != null && h.bFoalsProduced > 0) {
      const winRate = (h.bWinnersProduced || 0) / h.bFoalsProduced;
      const btRate = (h.bBTProduced || 0) / h.bFoalsProduced;
      parts.push(clamp(winRate * 70 + btRate * 250, 0, 100));
    } else if (h.bFoalsProduced === 0) {
      parts.push(50); // unproven
    }
    if (h.bFertility != null) parts.push([20, 65, 100][h.bFertility] ?? 70);
    if (h.bMareAge != null) {
      // peak 6–14
      parts.push(rangeScore(h.bMareAge, 4, 20, 9));
    }
  }
  if (mode === 'breeding-stallion' || h.bStudFee != null) {
    if (h.bStudFee != null && h.bStudFee > 0)
      parts.push(clamp(15 + Math.log10(h.bStudFee) * 18, 0, 100));
    if (h.bPctWinners != null) parts.push(clamp(h.bPctWinners * 1.4, 0, 100));
    if (h.bPctSW != null) parts.push(clamp(h.bPctSW * 12, 0, 100));
    if (h.bProven != null) parts.push([35, 65, 95][h.bProven] ?? 60);
    if (h.bCross != null) parts.push([30, 60, 80, 100][h.bCross] ?? 60);
    if (h.bBookSize != null) parts.push(rangeScore(h.bBookSize, 30, 200, 120));
  }
  return parts.length ? avg(parts) : null;
}

function scoreTemperament(h) {
  if (h.temperament == null) return null;
  return [20, 55, 80, 100][h.temperament] ?? 60;
}

function scoreFoalDate(h) {
  if (!h.foalDate) return null;
  const d = new Date(h.foalDate);
  if (isNaN(d)) return null;
  const month = d.getMonth(); // 0=Jan
  // Northern hemisphere TB: Jan–Mar best, Apr ok, May+ less ideal
  if (month <= 1) return 95;     // Jan, Feb
  if (month === 2) return 88;    // Mar
  if (month === 3) return 75;    // Apr
  if (month === 4) return 60;    // May
  return 50;
}

const avg = (arr) => arr.reduce((a,b) => a+b, 0) / arr.length;

// ---------- Overall scoring ----------
function computeScores(h, mode) {
  const cat = {
    pedigree: scorePedigree(h),
    conformation: scoreConformation(h),
    veterinary: scoreVeterinary(h),
    physical: scorePhysical(h),
    performance: scorePerformance(h),
    auction: scoreAuction(h),
    breeding: scoreBreeding(h, mode),
    temperament: scoreTemperament(h),
    foalDate: scoreFoalDate(h)
  };
  const weights = loadWeights(mode);
  let weightedSum = 0, totalW = 0;
  Object.keys(weights).forEach(k => {
    if (cat[k] != null && weights[k] > 0) {
      weightedSum += cat[k] * weights[k];
      totalW += weights[k];
    }
  });
  const overall = totalW ? weightedSum / totalW : 0;
  return { overall: Math.round(overall), categories: cat };
}

function valueScore(h, mode) {
  const s = computeScores(h, mode).overall;
  const price = h.aReserve || h.aMarketEst || h.bStudFee || 0;
  if (!price) return null;
  return Math.round((s / (price / 10000)) * 10) / 10;
}

// ---------- Form handling ----------
const form = document.getElementById('horseForm');

function readForm() {
  const fd = new FormData(form);
  const h = {};
  for (const [k, v] of fd.entries()) {
    if (v === '' || v == null) continue;
    // numeric fields
    const numericFields = new Set([
      'sireFee','sireAEI','sireCI','damFoals','damWinners','damBlackType',
      'damsireAEI','blackType3','nick','dosageIndex','inbreeding',
      'cBalance','cShoulder','cHip','cCannon','cKnees','cPasterns','cHooves',
      'cNeck','cTopline','cWalk',
      'height','weight','girth','cannonIn',
      'vXrays','vScope','vHeart','vWind','vEyes',
      'pStarts','pWins','pPlaces','pEarnings','pSpeed','pClass','pSound',
      'aReserve','aMaxBid','aMarketEst','aConsignor','aVetCost',
      'bMareAge','bFoalsProduced','bWinnersProduced','bBTProduced','bFertility',
      'bStudFee','bBookSize','bPctWinners','bPctSW','bProven','bCross',
      'temperament'
    ]);
    if (numericFields.has(k)) {
      const n = num(v);
      if (n != null) h[k] = n;
    } else {
      h[k] = v;
    }
  }
  return h;
}

function fillForm(h) {
  form.reset();
  // reset range outputs
  form.querySelectorAll('input[type="range"]').forEach(r => {
    if (r.nextElementSibling) r.nextElementSibling.textContent = r.value;
  });
  if (!h) return;
  Object.keys(h).forEach(k => {
    const el = form.elements.namedItem(k);
    if (!el) return;
    el.value = h[k];
    if (el.type === 'range' && el.nextElementSibling)
      el.nextElementSibling.textContent = h[k];
  });
}

form.addEventListener('input', updateLiveScore);
function updateLiveScore() {
  const h = readForm();
  const s = computeScores(h, currentMode());
  document.getElementById('liveScore').textContent =
    s.overall || '—';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const h = readForm();
  if (!h.name) { alert('Name is required'); return; }
  const horses = loadHorses();
  if (h.id) {
    const i = horses.findIndex(x => x.id === h.id);
    if (i >= 0) horses[i] = { ...horses[i], ...h, updated: Date.now() };
  } else {
    h.id = 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
    h.created = Date.now();
    horses.push(h);
  }
  saveHorses(horses);
  alert(`Saved: ${h.name}`);
  form.reset();
  form.elements.id.value = '';
  updateLiveScore();
  renderList();
  switchView('list');
});

document.getElementById('btnReset').addEventListener('click', () => {
  form.reset();
  form.elements.id.value = '';
  form.querySelectorAll('input[type="range"]').forEach(r => {
    r.value = 6;
    if (r.nextElementSibling) r.nextElementSibling.textContent = '6';
  });
  updateLiveScore();
});

// ---------- View switching ----------
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});
function switchView(name) {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.view === name));
  document.querySelectorAll('.view').forEach(v =>
    v.classList.toggle('active', v.id === 'view-' + name));
  if (name === 'list') renderList();
  if (name === 'compare') renderCompare();
}

// ---------- Mode ----------
const modeSel = document.getElementById('mode');
modeSel.addEventListener('change', () => {
  document.body.classList.toggle('mode-auction', currentMode() === 'auction');
  updateLiveScore();
  renderList();
});
function currentMode() { return modeSel.value; }
document.body.classList.add('mode-auction');

// ---------- List view ----------
function renderList() {
  const horses = loadHorses();
  const mode = currentMode();
  const search = (document.getElementById('search').value || '').toLowerCase();
  const sortBy = document.getElementById('sortBy').value;

  let items = horses.map(h => {
    const s = computeScores(h, mode);
    return { h, s, vs: valueScore(h, mode) };
  });

  if (search) {
    items = items.filter(x => {
      const blob = `${x.h.name} ${x.h.sire||''} ${x.h.dam||''} ${x.h.consignor||''}`.toLowerCase();
      return blob.includes(search);
    });
  }

  items.sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.vs || -1) - (a.vs || -1);
      case 'name':
        return (a.h.name || '').localeCompare(b.h.name || '');
      case 'price':
        return (a.h.aReserve || 1e15) - (b.h.aReserve || 1e15);
      case 'date':
        return (b.h.created || 0) - (a.h.created || 0);
      default:
        return b.s.overall - a.s.overall;
    }
  });

  const list = document.getElementById('horseList');
  if (!items.length) {
    list.innerHTML = `<p style="color:var(--muted);padding:40px;text-align:center;grid-column:1/-1;">
      No horses saved yet. Go to <strong>Add / Edit Horse</strong> to begin.</p>`;
    return;
  }

  list.innerHTML = items.map(({ h, s, vs }) => {
    const color = s.overall >= 75 ? 'var(--good)' :
                  s.overall >= 55 ? 'var(--warn)' : 'var(--bad)';
    const ped = [h.sire, h.dam, h.damsire].filter(Boolean).join(' × ') || '—';
    const breakdown = Object.keys(CATEGORY_LABELS).map(k => {
      const v = s.categories[k];
      if (v == null) return '';
      return `<span>${CATEGORY_LABELS[k]}</span>
              <span class="bar" style="width:80px"><div style="width:${v}%"></div></span>`;
    }).join('');
    return `
      <div class="horse-card" data-id="${h.id}">
        <div class="score-badge" style="--score:${s.overall};--score-color:${color}">
          <span>${s.overall}</span>
        </div>
        <h3>${escapeHtml(h.name)}</h3>
        <div class="meta">
          ${h.sex ? escapeHtml(h.sex) : ''} ${h.hip ? '· Hip ' + escapeHtml(h.hip) : ''}
          ${h.venue ? '· ' + escapeHtml(h.venue) : ''}
        </div>
        <div class="ped"><em>By</em> ${escapeHtml(ped)}</div>
        ${h.aReserve ? `<div class="price">${fmtUSD(h.aReserve)}${vs ? ` · value ${vs}` : ''}</div>` : ''}
        <div class="breakdown">${breakdown}</div>
        <div class="actions">
          <button class="btn" onclick="editHorse('${h.id}')">✏ Edit</button>
          <button class="btn" onclick="duplicateHorse('${h.id}')">⧉ Duplicate</button>
          <button class="btn danger" onclick="deleteHorse('${h.id}')">🗑</button>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

document.getElementById('search').addEventListener('input', renderList);
document.getElementById('sortBy').addEventListener('change', renderList);

window.editHorse = function (id) {
  const h = loadHorses().find(x => x.id === id);
  if (!h) return;
  fillForm(h);
  switchView('form');
  updateLiveScore();
};
window.duplicateHorse = function (id) {
  const h = loadHorses().find(x => x.id === id);
  if (!h) return;
  const copy = { ...h };
  delete copy.id; delete copy.created;
  copy.name = h.name + ' (copy)';
  fillForm(copy);
  switchView('form');
  updateLiveScore();
};
window.deleteHorse = function (id) {
  if (!confirm('Delete this horse?')) return;
  saveHorses(loadHorses().filter(x => x.id !== id));
  renderList();
};

// ---------- Compare view ----------
function renderCompare() {
  const horses = loadHorses();
  const sel = document.getElementById('compareSelect');
  if (!horses.length) {
    sel.innerHTML = `<p style="color:var(--muted)">Save horses first.</p>`;
    document.getElementById('compareTable').innerHTML = '';
    return;
  }
  sel.innerHTML = horses.map(h =>
    `<label><input type="checkbox" value="${h.id}"> ${escapeHtml(h.name)}</label>`
  ).join('');
  sel.querySelectorAll('input').forEach(cb =>
    cb.addEventListener('change', renderCompareTable));
  renderCompareTable();
}

function renderCompareTable() {
  const ids = [...document.querySelectorAll('#compareSelect input:checked')]
    .map(c => c.value).slice(0, 4);
  const horses = loadHorses().filter(h => ids.includes(h.id));
  const out = document.getElementById('compareTable');
  if (horses.length < 2) {
    out.innerHTML = `<p style="color:var(--muted)">Pick at least 2 horses.</p>`;
    return;
  }
  const mode = currentMode();
  const scores = horses.map(h => computeScores(h, mode));

  const fields = [
    ['__section', 'Identity'],
    ['name', 'Name'], ['sex', 'Sex'], ['foalDate', 'Foal date'],
    ['hip', 'Hip'], ['venue', 'Venue'], ['consignor', 'Consignor'],
    ['__section', 'Pedigree'],
    ['sire', 'Sire'], ['sireFee', 'Sire fee', 'usd'],
    ['sireAEI', 'Sire AEI'], ['dam', 'Dam'],
    ['damWinners', 'Dam winners'], ['damBlackType', 'Dam BT'],
    ['damsire', 'Damsire'], ['nick', 'Nick'],
    ['__section', 'Physical'],
    ['height', 'Height (h)'], ['cannonIn', 'Cannon (in)'],
    ['__section', 'Veterinary'],
    ['vXrays', 'X-rays'], ['vScope', 'Scope'],
    ['vHeart', 'Heart'], ['vWind', 'Wind'],
    ['__section', 'Auction'],
    ['aReserve', 'Reserve', 'usd'], ['aMarketEst', 'Market est', 'usd'],
    ['__section', 'Sub-scores'],
    ['_pedigree', 'Pedigree'], ['_conformation', 'Conformation'],
    ['_veterinary', 'Veterinary'], ['_physical', 'Physical'],
    ['_performance', 'Performance'], ['_auction', 'Auction'],
    ['_breeding', 'Breeding'], ['_temperament', 'Temperament'],
    ['_foalDate', 'Foal date'],
    ['__section', 'OVERALL'],
    ['_overall', 'Overall Score'],
  ];

  const rows = fields.map(([k, label, fmt]) => {
    if (k === '__section')
      return `<tr class="section"><td colspan="${horses.length+1}">${label}</td></tr>`;
    const vals = horses.map((h, i) => {
      let v;
      if (k === '_overall') v = scores[i].overall;
      else if (k.startsWith('_')) v = scores[i].categories[k.slice(1)];
      else v = h[k];
      if (v == null || v === '') return null;
      return v;
    });
    // best/worst highlight for numeric
    const numericVals = vals.map(v => typeof v === 'number' ? v : null);
    const validNums = numericVals.filter(v => v != null);
    const max = validNums.length ? Math.max(...validNums) : null;
    const min = validNums.length ? Math.min(...validNums) : null;
    const cells = vals.map((v, i) => {
      let cls = '';
      if (typeof v === 'number' && validNums.length > 1) {
        if (v === max) cls = 'best';
        else if (v === min && max !== min) cls = 'worst';
      }
      let display = v == null ? '—' :
        (fmt === 'usd' ? fmtUSD(v) :
         (typeof v === 'number' ? (Math.round(v * 10) / 10) : escapeHtml(v)));
      return `<td class="${cls}">${display}</td>`;
    }).join('');
    return `<tr><th>${label}</th>${cells}</tr>`;
  }).join('');

  out.innerHTML = `<table>
    <thead><tr><th></th>${horses.map(h => `<th>${escapeHtml(h.name)}</th>`).join('')}</tr></thead>
    <tbody>${rows}</tbody></table>`;
}

// ---------- Import / Export ----------
document.getElementById('btnExportJSON').addEventListener('click', () => {
  const data = JSON.stringify(loadHorses(), null, 2);
  download('horses-backup.json', data, 'application/json');
});

document.getElementById('btnExportCSV').addEventListener('click', () => {
  const horses = loadHorses();
  if (!horses.length) return alert('No horses to export.');
  const mode = currentMode();
  // Collect all keys plus computed scores
  const keys = [...new Set(horses.flatMap(h => Object.keys(h)))];
  const headers = [...keys, 'overallScore', ...Object.keys(CATEGORY_LABELS).map(k => 'score_' + k)];
  const rows = horses.map(h => {
    const s = computeScores(h, mode);
    const row = keys.map(k => csvCell(h[k]));
    row.push(s.overall);
    Object.keys(CATEGORY_LABELS).forEach(k =>
      row.push(s.categories[k] == null ? '' : Math.round(s.categories[k] * 10) / 10));
    return row.join(',');
  });
  const csv = headers.join(',') + '\n' + rows.join('\n');
  download('horses-export.csv', csv, 'text/csv');
});

function csvCell(v) {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('importFile').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error('Expected an array');
      if (!confirm(`Import ${data.length} horses? This replaces current data.`)) return;
      saveHorses(data);
      renderList();
      alert('Imported successfully.');
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
  };
  reader.readAsText(f);
  e.target.value = '';
});

document.getElementById('btnClear').addEventListener('click', () => {
  if (!confirm('Delete ALL saved horses? This cannot be undone.')) return;
  if (!confirm('Are you absolutely sure?')) return;
  saveHorses([]);
  renderList();
});

// ---------- Weights modal ----------
const weightsModal = document.getElementById('weightsModal');
document.getElementById('btnWeights').addEventListener('click', openWeights);
document.getElementById('btnCloseWeights').addEventListener('click',
  () => weightsModal.classList.add('hidden'));
document.getElementById('btnResetWeights').addEventListener('click', () => {
  const m = currentMode();
  saveWeights(m, { ...DEFAULT_WEIGHTS[m] });
  openWeights();
});
document.getElementById('btnSaveWeights').addEventListener('click', () => {
  const m = currentMode();
  const w = {};
  weightsModal.querySelectorAll('input[type="range"]').forEach(r => {
    w[r.dataset.key] = parseInt(r.value, 10);
  });
  saveWeights(m, w);
  weightsModal.classList.add('hidden');
  updateLiveScore();
  renderList();
});

function openWeights() {
  const m = currentMode();
  document.getElementById('weightsModeLabel').textContent =
    modeSel.options[modeSel.selectedIndex].text;
  const w = loadWeights(m);
  document.getElementById('weightsSliders').innerHTML =
    Object.keys(CATEGORY_LABELS).map(k => `
      <div class="weight-row">
        <label>${CATEGORY_LABELS[k]}</label>
        <input type="range" min="0" max="40" value="${w[k] ?? 0}" data-key="${k}"
               oninput="this.nextElementSibling.textContent=this.value">
        <output>${w[k] ?? 0}</output>
      </div>`).join('');
  weightsModal.classList.remove('hidden');
}

// ---------- About modal ----------
(function initAbout() {
  const modal = document.getElementById('aboutModal');
  document.getElementById('btnAbout').addEventListener('click', () =>
    modal.classList.remove('hidden'));
  document.getElementById('btnCloseAbout').addEventListener('click', () =>
    modal.classList.add('hidden'));
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.add('hidden');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.add('hidden');
  });
})();

// ---------- Init ----------
document.getElementById('countSaved').textContent = loadHorses().length;
updateLiveScore();

// ---------- Preset loader ----------
(function initPresets() {
  if (typeof HORSE_PRESETS === 'undefined') return;
  const sel = document.getElementById('presetSelect');
  HORSE_PRESETS
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((p, i) => {
      const opt = document.createElement('option');
      // index into original array
      opt.value = HORSE_PRESETS.indexOf(p);
      opt.textContent = `${p.name}  (${p.country || '?'}, ${(p.foalDate||'').slice(0,4)})`;
      sel.appendChild(opt);
    });

  document.getElementById('btnLoadPreset').addEventListener('click', () => {
    const idx = parseInt(sel.value, 10);
    if (isNaN(idx)) return alert('Pick a horse from the dropdown first.');
    const preset = HORSE_PRESETS[idx];
    // Clear current form, then fill (preserve no id so save creates new record)
    fillForm({ ...preset });
    updateLiveScore();
    // Scroll to top of form
    document.getElementById('horseForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

// ---------- Click-popover for info buttons ----------
(function initInfoPopovers() {
  const pop = document.getElementById('infoPopover');
  if (!pop) return;

  document.addEventListener('click', e => {
    const btn = e.target.closest('button.info');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();
      const text = btn.dataset.info || '';
      pop.textContent = text;
      pop.classList.remove('hidden');
      const r = btn.getBoundingClientRect();
      // position below the button, accounting for scroll
      const top = r.bottom + window.scrollY + 8;
      let left = r.left + window.scrollX - 6;
      pop.style.top = top + 'px';
      pop.style.left = left + 'px';
      // adjust if overflowing right edge
      const popRect = pop.getBoundingClientRect();
      if (popRect.right > window.innerWidth - 10) {
        left = window.innerWidth - popRect.width - 10 + window.scrollX;
        pop.style.left = left + 'px';
      }
    } else if (!e.target.closest('#infoPopover')) {
      pop.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') pop.classList.add('hidden');
  });

  window.addEventListener('scroll', () => pop.classList.add('hidden'), { passive: true });
})();
