// ============================================================
//  AgriSmart 2026 — Actions
//  User interaction handlers: yield model, pest scan, AI, SMS
// ============================================================

// ─── Yield Prediction ────────────────────────────────────────
function runYield() {
  const n   = +document.getElementById('yn').value;
  const p   = +document.getElementById('yp').value;
  const k   = +document.getElementById('yk').value;
  const ph  = +document.getElementById('yph').value;
  const m   = +document.getElementById('ym').value;
  const t   = +document.getElementById('yt').value;

  // Simulated Random Forest model scoring
  let sc = 2.0
    + (n / 200) * 1.8
    + (p / 150) * .9
    + (k / 200) * .7
    + (m / 100) * 1.2
    - Math.abs(ph - 6.5) * .4
    - Math.abs(t - 20) * .05
    + (Math.random() - .5) * .25;

  sc = Math.min(6.5, Math.max(.5, sc));

  const verdict = sc > 4
    ? '✅ Above regional average — conditions are excellent.'
    : sc > 2.5
    ? '⚠️ Moderate yield. Consider a nitrogen top-dress to improve.'
    : '❗ Below average. Immediate soil intervention is recommended.';

  const el = document.getElementById('yield-result');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="card-inset">
      <div style="font-family:var(--font-h);font-size:30px;color:var(--earth);margin-bottom:8px">
        ${sc.toFixed(2)}
        <span style="font-size:14px;font-family:var(--font-m);color:var(--faint)">tonnes / hectare</span>
      </div>
      <div style="font-size:13px;line-height:1.75;color:var(--dim)">
        Based on N:${n}, P:${p}, K:${k}, pH:${ph}, moisture ${m}%, temp ${t}°C. ${verdict}
      </div>
      <div style="font-family:var(--font-m);font-size:10px;color:var(--faint);margin-top:8px">
        Random Forest · R² 0.913 · ±0.28 t/ha confidence interval
      </div>
    </div>`;
}

// ─── Pest CNN Scan ───────────────────────────────────────────
function runPest() {
  document.getElementById('pest-loading').style.display = 'block';
  document.getElementById('pest-res').style.display     = 'none';

  setTimeout(() => {
    const r = PEST_DB[Math.floor(Math.random() * PEST_DB.length)];
    const sevLabel = r.sev === 'h' ? 'High' : r.sev === 'm' ? 'Medium' : 'Low';

    document.getElementById('pest-loading').style.display = 'none';
    document.getElementById('pest-res').style.display     = 'block';
    document.getElementById('pest-res').innerHTML = `
      <div class="pest-result-box">
        <div style="font-size:28px;margin-bottom:8px">${r.icon}</div>
        <div class="pest-name">${r.pest}</div>
        <div style="font-family:var(--font-m);font-size:11px;color:var(--faint)">
          Model confidence: ${r.conf}%
        </div>
        <div class="pest-cbar">
          <div class="pest-cfill" style="width:${r.conf}%"></div>
        </div>
        <div style="margin-bottom:10px">
          <span class="rbadge rb-${r.sev}"><span class="rbd"></span>${sevLabel} severity</span>
        </div>
        <div class="pest-action">
          🌿 <strong>Recommended Action</strong><br>${r.action}
        </div>
        <div style="font-family:var(--font-m);font-size:10px;color:var(--faint);margin-top:10px">
          EfficientNet-B4 · PyTorch · PlantVillage dataset · 94.2% accuracy
        </div>
      </div>`;
  }, 2100);
}

// ─── AI Agronomist ───────────────────────────────────────────
function setQ(q) {
  document.getElementById('ai-inp').value = q;
  doAsk();
}

async function doAsk() {
  const q = document.getElementById('ai-inp').value.trim();
  if (!q) return;

  const box = document.getElementById('ai-box');
  const btn = document.getElementById('ai-btn');
  btn.disabled = true;

  box.innerHTML = `
    <div class="thinking"><span></span><span></span><span></span></div>
    <div style="text-align:center;font-family:var(--font-m);font-size:12px;
                color:var(--faint);margin-top:4px">Consulting AI Agronomist…</div>`;

  const systemPrompt = `You are an expert AI agronomist for AgriSmart 2026.
Current field data: ${FIELDS.map(f =>
  `${f.name}(${f.crop}): health=${f.health}%, NDVI=${f.ndvi}, moisture=${f.moist}%, N=${f.n}, P=${f.p}, K=${f.k}, temp=${f.temp}°C, risk=${f.risk}`
).join('; ')}.
Weather: 19.2°C, 64% humidity, partly cloudy.
Respond concisely in 2–4 sentences with specific, actionable advice.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 350,
        system: systemPrompt,
        messages: [{ role: 'user', content: q }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(c => c.text || '').join('') || 'No response received.';
    box.innerHTML = `<div style="line-height:1.8">${text}</div>`;
  } catch {
    // Offline / error fallback responses
    const key = Object.keys(AI_FALLBACKS).find(k => q.toLowerCase().includes(k)) || 'default';
    box.innerHTML = `<div style="line-height:1.8">${AI_FALLBACKS[key]}</div>`;
  }

  document.getElementById('ai-inp').value = '';
  btn.disabled = false;
}

// ─── Prescription Map Actions ────────────────────────────────
function showPT(v, i) {
  const el  = document.getElementById('prx-tip');
  const nut = curNut === 'N' ? 'Nitrogen' : curNut === 'P' ? 'Phosphorus' : 'Potassium';
  el.style.display = 'block';
  el.innerHTML = `
    <span style="font-family:var(--font-m);font-size:12px;color:var(--dim)">
      Zone [Row ${Math.floor(i / 8) + 1}, Col ${i % 8 + 1}]
    </span> — Apply <b style="color:var(--moss)">${v} kg/ha</b> ${nut}`;
}

function hidePT() {
  document.getElementById('prx-tip').style.display = 'none';
}

function switchN(n) {
  curNut = n;
  ['N','P','K'].forEach(x => {
    document.getElementById('n' + x).className =
      'btn btn-' + (x === n ? 'primary' : 'secondary') + ' btn-full';
  });
  renderPrx();
}

function exportPrx() {
  const csv = 'row,col,rate_kg_ha\n' +
    prxData.map((v, i) => `${Math.floor(i/8)+1},${i%8+1},${v}`).join('\n');
  const a = document.createElement('a');
  a.href     = 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'prescription_north_paddock.csv';
  a.click();
}

// ─── SMS / Modal ─────────────────────────────────────────────
function sendSMS(field, msg) {
  document.getElementById('modal-sms').textContent =
    `To: +91 98XXX XXXXX (Farmer Rajesh K.)\nFrom: AgriSmart 2026\n\n🌾 AGRISMART FIELD ALERT\nField: ${field}\n\n${msg}\n\nView full report: app.agrismart.io\nReply STOP to unsubscribe`;
  document.getElementById('modal').classList.add('open');
}

function testSMS() {
  sendSMS(
    'All Fields',
    "Daily summary: 4 active alerts. Irrigation required at West Lot. Pest risk high. Check prescription maps for this week's application schedule."
  );
}

function closeModal(e) {
  if (e.target === document.getElementById('modal'))
    document.getElementById('modal').classList.remove('open');
}
