// ============================================================
//  AgriSmart 2026 — App Core
//  State management, navigation, initialization
// ============================================================

// ─── Global State ───────────────────────────────────────────
let selF    = null;   // currently selected field object
let curNut  = 'N';    // selected nutrient for prescription map
let prxData = [];     // prescription map cell values

// ─── Boot ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  selF = FIELDS[0];

  // Set today's date in header
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('en-IN', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });

  // Render all sections
  renderAll();

  // Live weather / sensor ticker (every 2.4s)
  setInterval(() => {
    const t = (19 + Math.sin(Date.now() / 4e3) * 1.3).toFixed(1);
    const h = Math.round(62 + Math.sin(Date.now() / 3e3) * 3);
    document.getElementById('live-temp').innerHTML = `<b>${t}°C</b>`;
    document.getElementById('live-hum').innerHTML  = `<b>${h}% RH</b>`;
    SENSORS.forEach((_, i) => {
      const el = document.getElementById('sv' + i);
      if (el) el.textContent = SENSORS[i].val();
    });
  }, 2400);
});

// ─── Render All Pages ────────────────────────────────────────
function renderAll() {
  renderKPIs();
  renderMap();
  renderTable();
  renderDetail(selF);
  renderAlertsMini();
  renderFieldCards();
  renderSensors();
  renderYieldChart();
  renderYieldInputs();
  renderFeatImp();
  renderSowing();
  renderPrx();
  renderAlertsPage();
  renderAdvisor();
  renderPestHist();
  renderFC();
}

// ─── Navigation ──────────────────────────────────────────────
function nav(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('p-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el && el.classList) el.classList.add('active');
}

// ─── Field Selection ─────────────────────────────────────────
function selF2(id) {
  selF = FIELDS.find(f => f.id === id);
  renderMap();
  renderTable();
  renderDetail(selF);
}

// ─── NDVI Color Helper ───────────────────────────────────────
function ndviColor(v) {
  if (v > .7)  return '#2d6e20';
  if (v > .55) return '#4a8a28';
  if (v > .4)  return '#7a9a30';
  if (v > .25) return '#9a8820';
  return '#8a3820';
}

// ─── Prescription Color Helper ───────────────────────────────
function prxClr(v, mn, mx) {
  const t = (v - mn) / (mx - mn);
  return `hsl(${Math.round(100 - t * 85)},${Math.round(50 + t * 40)}%,${Math.round(55 - t * 25)}%)`;
}

// ─── Risk Badge Helper ───────────────────────────────────────
function riskBadge(risk) {
  const cls = risk === 'low' ? 'rb-l' : risk === 'medium' ? 'rb-m' : 'rb-h';
  return `<span class="rbadge ${cls}"><span class="rbd"></span>${risk}</span>`;
}

// ─── Health Color Helper ─────────────────────────────────────
function healthColor(h) {
  return h > 75 ? 'var(--fern)' : h > 50 ? 'var(--amber)' : 'var(--rust)';
}

// ─── SVG Ring Gauge ──────────────────────────────────────────
function ring(val, clr, lbl) {
  const r = 28, c = 2 * Math.PI * r, d = (val / 100) * c;
  return `
    <div class="gauge">
      <svg width="72" height="72">
        <circle cx="36" cy="36" r="${r}" fill="none" stroke="${clr}22" stroke-width="6"/>
        <circle cx="36" cy="36" r="${r}" fill="none" stroke="${clr}" stroke-width="6"
          stroke-dasharray="${d} ${c - d}" stroke-dashoffset="${c / 4}"
          stroke-linecap="round" style="transition:stroke-dasharray 1.3s ease"/>
        <text x="36" y="37" text-anchor="middle" dominant-baseline="middle"
          fill="var(--earth)" font-size="13" font-weight="700"
          font-family="Playfair Display,serif">${val}</text>
      </svg>
      <div class="g-lbl">${lbl}</div>
    </div>`;
}
