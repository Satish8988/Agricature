// ============================================================
//  AgriSmart 2026 — Renderers
//  All DOM rendering / page-building functions
// ============================================================

// ─── KPIs ────────────────────────────────────────────────────
function renderKPIs() {
  const ah = Math.round(FIELDS.reduce((s, f) => s + f.health, 0) / FIELDS.length);
  const an = (FIELDS.reduce((s, f) => s + f.ndvi, 0) / FIELDS.length).toFixed(2);
  document.getElementById('kv-h').innerHTML = ah + '<span>%</span>';
  document.getElementById('kf-h').style.width = ah + '%';
  document.getElementById('kv-n').innerHTML = an + '<span> idx</span>';
}

// ─── NDVI Satellite Map ──────────────────────────────────────
function renderMap() {
  const pos = [
    { x:6,  y:6,  w:46, h:44 },
    { x:56, y:6,  w:40, h:44 },
    { x:6,  y:54, w:34, h:40 },
    { x:50, y:54, w:44, h:40 },
  ];
  let svg = `
    <svg width="100%" height="270" viewBox="0 0 100 100" preserveAspectRatio="none"
         style="display:block;cursor:pointer">
      <rect width="100" height="100" fill="#e8e0cc"/>
      ${[20,40,60,80].map(v =>
        `<line x1="${v}" y1="0" x2="${v}" y2="100" stroke="#d4c8b0" stroke-width=".4"/>
         <line x1="0" y1="${v}" x2="100" y2="${v}" stroke="#d4c8b0" stroke-width=".4"/>`
      ).join('')}
      <text x="2" y="3.5" font-size="2.2" fill="#a89878"
            font-family="IBM Plex Mono,monospace">NDVI · Sentinel-2</text>`;

  FIELDS.forEach((f, i) => {
    const p = pos[i];
    const sel = selF && selF.id === f.id;
    svg += `
      <g onclick="selF2(${f.id})" style="cursor:pointer">
        <rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"
          fill="${ndviColor(f.ndvi)}"
          stroke="${sel ? '#d4821a' : '#b8a888'}"
          stroke-width="${sel ? 1.8 : .6}" rx="2" opacity=".88"/>
        ${f.risk === 'high'
          ? `<circle cx="${p.x+p.w-4}" cy="${p.y+4}" r="3" fill="#b84a2a">
               <animate attributeName="opacity" values="1;.3;1" dur="1.5s" repeatCount="indefinite"/>
             </circle>`
          : ''}
        <text x="${p.x+p.w/2}" y="${p.y+p.h/2-4}"
          text-anchor="middle" dominant-baseline="middle"
          fill="white" font-size="4" font-weight="700"
          font-family="Playfair Display,serif" opacity=".95">${f.name.split(' ')[0]}</text>
        <text x="${p.x+p.w/2}" y="${p.y+p.h/2+3}"
          text-anchor="middle" dominant-baseline="middle"
          fill="white" font-size="2.9" opacity=".75"
          font-family="IBM Plex Mono,monospace">${f.crop}</text>
        <text x="${p.x+p.w/2}" y="${p.y+p.h/2+9}"
          text-anchor="middle" dominant-baseline="middle"
          fill="rgba(255,255,255,.9)" font-size="2.4"
          font-family="IBM Plex Mono,monospace">NDVI ${f.ndvi}</text>
      </g>`;
  });

  svg += `</svg>
    <div class="map-legend">
      ${[['#2d6e20','High NDVI (>0.7)'],['#4a8a28','Good (>0.55)'],
         ['#7a9a30','Medium'],['#9a8820','Low'],['#8a3820','Critical']].map(([c,l]) =>
        `<div class="ml-item"><div class="ml-dot" style="background:${c}"></div>${l}</div>`
      ).join('')}
    </div>`;

  document.getElementById('field-map').innerHTML = svg;
}

// ─── Field Table ─────────────────────────────────────────────
function renderTable() {
  document.getElementById('ftbody').innerHTML = FIELDS.map(f => `
    <tr class="${selF && selF.id === f.id ? 'row-sel' : ''}" onclick="selF2(${f.id})">
      <td>
        <div class="field-nm">${f.name}</div>
        <div class="field-cr">${f.crop} · ${f.area} ha</div>
      </td>
      <td style="font-family:var(--font-m);font-size:12px;color:var(--faint)">${f.area} ha</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-family:var(--font-m);font-size:12px;color:${healthColor(f.health)}">${f.health}%</span>
          <div class="hb" style="width:56px">
            <div class="hb-f" style="width:${f.health}%;background:${healthColor(f.health)}"></div>
          </div>
        </div>
      </td>
      <td style="font-family:var(--font-m);font-size:13px;font-weight:500;color:${f.ndvi>.6?'var(--fern)':f.ndvi>.4?'var(--amber)':'var(--rust)'}">${f.ndvi}</td>
      <td>${riskBadge(f.risk)}</td>
    </tr>`).join('');
}

// ─── Field Detail Panel ──────────────────────────────────────
function renderDetail(f) {
  document.getElementById('detail-panel').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
      <div>
        <div class="detail-name">${f.name}</div>
        <div class="detail-crop">${f.crop} · ${f.area} ha</div>
      </div>
      ${riskBadge(f.risk)}
    </div>
    <div class="gauge-row">
      ${ring(f.health, '#4a7a28', 'Health')}
      ${ring(f.moist,  '#3a7fa8', 'Moisture')}
      ${ring(Math.round(f.ndvi * 100), '#4a9e6a', 'NDVI')}
    </div>
    <div class="soil-grid">
      <div class="soil-cell"><div class="soil-cell-lbl">Nitrogen</div><div class="soil-cell-val">${f.n}<span> kg/ha</span></div></div>
      <div class="soil-cell"><div class="soil-cell-lbl">Phosphorus</div><div class="soil-cell-val">${f.p}<span> kg/ha</span></div></div>
      <div class="soil-cell"><div class="soil-cell-lbl">Potassium</div><div class="soil-cell-val">${f.k}<span> kg/ha</span></div></div>
      <div class="soil-cell"><div class="soil-cell-lbl">Temperature</div><div class="soil-cell-val">${f.temp}<span>°C</span></div></div>
    </div>
    <button class="btn btn-primary btn-full" style="margin-top:12px"
      onclick="nav('advisor',document.querySelector('[data-p=advisor]'));
               document.getElementById('ai-inp').value='Analyze ${f.name} and give recommendations';
               doAsk()">
      🤖 Ask AI about this field
    </button>`;
}

// ─── Alerts Mini (overview sidebar) ─────────────────────────
function renderAlertsMini() {
  document.getElementById('alerts-mini').innerHTML = ALERTS_DATA.slice(0, 3).map(a => `
    <div class="alert-item ai-${a.sev}" style="padding:9px 12px">
      <div style="font-size:16px">${a.icon}</div>
      <div>
        <div style="font-weight:600;font-size:12px;color:var(--earth)">${a.field}</div>
        <div style="font-size:11px;color:var(--dim);font-style:italic">${a.msg.slice(0, 60)}…</div>
      </div>
    </div>`).join('');
}

// ─── Field Cards (Fields page) ───────────────────────────────
function renderFieldCards() {
  document.getElementById('field-cards').innerHTML = FIELDS.map(f => `
    <div class="card" style="cursor:pointer"
         onclick="selF2(${f.id});nav('overview',document.querySelector('[data-p=overview]'))">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:12px">
        <div>
          <div style="font-family:var(--font-h);font-size:20px;color:var(--earth)">${f.name}</div>
          <div style="font-family:var(--font-m);font-size:11px;color:var(--faint);margin-top:2px">${f.crop} · ${f.area} ha</div>
        </div>
        ${riskBadge(f.risk)}
      </div>
      <div class="g3" style="gap:8px;margin-bottom:12px">
        ${[['Health', f.health+'%', healthColor(f.health)],
           ['NDVI',   f.ndvi,       f.ndvi>.6?'var(--fern)':f.ndvi>.4?'var(--amber)':'var(--rust)'],
           ['Moisture',f.moist+'%','var(--sky)']].map(([l,v,c]) =>
          `<div class="card-inset" style="text-align:center">
             <div style="font-family:var(--font-m);font-size:9px;color:var(--faint);text-transform:uppercase">${l}</div>
             <div style="font-family:var(--font-h);font-size:20px;color:${c}">${v}</div>
           </div>`).join('')}
      </div>
      <div class="g3" style="gap:7px">
        ${[['N',f.n,'#4a7a28'],['P',f.p,'#3a7fa8'],['K',f.k,'#d4821a']].map(([l,v,c]) =>
          `<div style="background:var(--parchment);border:1px solid var(--sand);border-radius:6px;padding:7px;text-align:center;font-family:var(--font-m)">
             <div style="font-size:9px;color:var(--faint)">${l}</div>
             <div style="font-size:14px;font-weight:600;color:${c}">${v}</div>
           </div>`).join('')}
      </div>
      <div class="hb" style="margin-top:12px">
        <div class="hb-f" style="width:${f.health}%;background:${healthColor(f.health)}"></div>
      </div>
    </div>`).join('');
}

// ─── IoT Sensors ─────────────────────────────────────────────
function renderSensors() {
  document.getElementById('sensor-live').innerHTML = SENSORS.map((s, i) => `
    <div class="sensor-row">
      <div class="sr-icon">${s.icon}</div>
      <div class="sr-info">
        <div class="sr-name">${s.name}</div>
        <div class="sr-val" id="sv${i}"
             style="color:${s.st==='ok'?'var(--fern)':s.st==='warn'?'var(--amber)':'var(--rust)'}">${s.val()}</div>
        <div class="sr-field">${s.field} · ${s.model}</div>
      </div>
      <div class="sr-status st-${s.st}"></div>
    </div>`).join('');

  document.getElementById('hw-list').innerHTML = HARDWARE.map(h => `
    <div class="card-sm">
      <div style="font-weight:600;font-size:13px;color:var(--earth);margin-bottom:4px">${h.name}</div>
      <div style="font-family:var(--font-m);font-size:11px;color:var(--dim);line-height:1.8">
        ${h.use}<br>
        Protocol: ${h.proto} &nbsp;·&nbsp; <span style="color:var(--fern);font-weight:500">${h.cost}</span>
      </div>
    </div>`).join('');
}

// ─── Yield Chart ─────────────────────────────────────────────
function renderYieldChart() {
  const svg = document.getElementById('yield-svg');
  const W = 560, H = 155, pad = 38;
  const vs  = WEEKLY_YIELD.flatMap(d => [d.a, d.p]).filter(Boolean);
  const mn  = Math.min(...vs) - .3;
  const mx  = Math.max(...vs) + .3;
  const x   = i => pad + (i / (WEEKLY_YIELD.length - 1)) * (W - pad * 2);
  const y   = v => H - pad - (v - mn) / (mx - mn) * (H - pad * 2);

  let ap = '', pp = '';
  WEEKLY_YIELD.forEach((d, i) => { if (d.a != null) ap += (ap ? 'L' : 'M') + x(i) + ',' + y(d.a); });
  WEEKLY_YIELD.forEach((d, i) => { pp += (pp ? 'L' : 'M') + x(i) + ',' + y(d.p); });

  let gridLines = '';
  [3.0, 3.5, 4.0, 4.5].forEach(v => {
    if (v >= mn && v <= mx)
      gridLines += `<line x1="${pad}" y1="${y(v)}" x2="${W-pad}" y2="${y(v)}" stroke="#e8e0cc" stroke-width="1"/>
        <text x="${pad-5}" y="${y(v)}" text-anchor="end" dominant-baseline="middle"
              fill="#a89878" font-size="10" font-family="IBM Plex Mono,monospace">${v}</text>`;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="yg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4a7a28" stop-opacity=".18"/>
        <stop offset="100%" stop-color="#4a7a28" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <path d="${ap} L${x(5)},${H-pad} L${pad},${H-pad} Z" fill="url(#yg)"/>
    <path d="${ap}" fill="none" stroke="#4a7a28" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${pp}" fill="none" stroke="#3a7fa8" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round"/>
    ${WEEKLY_YIELD.map((d, i) => {
      let o = '';
      if (d.a != null) o += `<circle cx="${x(i)}" cy="${y(d.a)}" r="4.5" fill="#4a7a28" stroke="white" stroke-width="2"/>`;
      o += `<circle cx="${x(i)}" cy="${y(d.p)}" r="3" fill="#3a7fa8" stroke="white" stroke-width="1.5" opacity="${d.a==null?1:.65}"/>`;
      o += `<text x="${x(i)}" y="${H-8}" text-anchor="middle" fill="#a89878" font-size="10" font-family="IBM Plex Mono,monospace">${d.d}</text>`;
      return o;
    }).join('')}`;
}

// ─── Yield Inputs Form ───────────────────────────────────────
function renderYieldInputs() {
  document.getElementById('y-inputs').innerHTML = YIELD_INPUTS_CONFIG.map(i => `
    <div class="card-sm">
      <div style="font-family:var(--font-m);font-size:9px;color:var(--faint);
                  text-transform:uppercase;letter-spacing:.09em;margin-bottom:5px">${i.label}</div>
      <input type="number" id="${i.id}" value="${i.value}" step="${i.step || 1}"
             class="inp" style="padding:7px 10px;font-size:13px;font-weight:600"/>
    </div>`).join('');
}

// ─── Feature Importance Bars ─────────────────────────────────
function renderFeatImp() {
  document.getElementById('feat-imp').innerHTML = FEATURES.map(f => `
    <div class="fi-row">
      <div class="fi-meta">
        <span class="fi-name">${f.name}</span>
        <span class="fi-pct" style="color:${f.c}">${f.pct}%</span>
      </div>
      <div class="fi-bar">
        <div class="fi-fill" style="width:${f.pct}%;background:${f.c}"></div>
      </div>
    </div>`).join('');
}

// ─── Sowing Advisor ──────────────────────────────────────────
function renderSowing() {
  document.getElementById('sow-cards').innerHTML = SOWING.map(s => `
    <div class="sow-card">
      <div class="sow-crop">${s.crop}</div>
      <div class="sow-window ${s.ok ? 'sw-now' : 'sw-wait'}">${s.win}</div>
      <div class="sow-meta">
        Degree Days: <b>${s.dd}</b><br>
        Soil Temp: <b>${s.st}°C</b><br>
        Confidence: <b style="color:${s.conf > 85 ? 'var(--fern)' : 'var(--amber)'}">${s.conf}%</b>
      </div>
      <div class="sow-bar">
        <div class="sow-fill" style="width:${s.conf}%;background:${s.ok?'var(--fern)':'var(--amber)'}"></div>
      </div>
    </div>`).join('');

  document.getElementById('sow-cond').innerHTML = SOWING_CONDITIONS.map(c => `
    <div class="card-sm">
      <div style="font-family:var(--font-m);font-size:9px;color:var(--faint)">${c.label}</div>
      <div style="font-family:var(--font-h);font-size:20px;color:${c.color};margin-top:2px">${c.value}</div>
    </div>`).join('');
}

// ─── 10-Day Forecast Chart ───────────────────────────────────
function renderFC() {
  const svg  = document.getElementById('fc-svg');
  const W = 400, H = 105, pad = 28;
  const vmax = 28, vmin = 7;
  const x = i => pad + (i / 9) * (W - pad * 2);
  const y = v => H - pad - (v - vmin) / (vmax - vmin) * (H - pad * 2);

  let mp = '', np = '';
  FORECAST_MAX.forEach((v, i) => mp += (mp ? 'L' : 'M') + x(i) + ',' + y(v));
  FORECAST_MIN.forEach((v, i) => np += (np ? 'L' : 'M') + x(i) + ',' + y(v));

  svg.innerHTML = `
    <defs>
      <linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d4821a" stop-opacity=".15"/>
        <stop offset="100%" stop-color="#3a7fa8" stop-opacity=".08"/>
      </linearGradient>
    </defs>
    <path d="${mp} ${FORECAST_MIN.map((_, i) => `${x(9-i)},${y(FORECAST_MIN[9-i])}`).join('L')}" fill="url(#fcg)"/>
    <path d="${mp}" fill="none" stroke="#d4821a" stroke-width="2" stroke-linecap="round"/>
    <path d="${np}" fill="none" stroke="#3a7fa8" stroke-width="2" stroke-linecap="round"/>
    ${['D1','D2','D3','D4','D5','D6','D7','D8','D9','D10'].map((d, i) =>
      `<text x="${x(i)}" y="${H-4}" text-anchor="middle" fill="#a89878"
             font-size="9" font-family="IBM Plex Mono,monospace">${d}</text>`
    ).join('')}
    ${FORECAST_MAX.map((v, i) =>
      `<text x="${x(i)}" y="${y(v)-7}" text-anchor="middle" fill="#c8680a"
             font-size="9" font-family="IBM Plex Mono,monospace">${v}°</text>`
    ).join('')}`;
}

// ─── Prescription Map ────────────────────────────────────────
function renderPrx() {
  const mn = 30, mx = 140;
  prxData = Array.from({ length: 64 }, (_, i) =>
    mn + Math.round(Math.random() * (mx - mn) * .75 + (i % 8) * 1.3 + Math.floor(i / 8) * 2)
  );

  document.getElementById('prx-grid').innerHTML = prxData.map((v, i) =>
    `<div class="prx-cell" style="background:${prxClr(v, mn, mx)}"
          onmouseenter="showPT(${v},${i})" onmouseleave="hidePT()"></div>`
  ).join('');

  document.getElementById('prx-leg').innerHTML = Array.from({ length: 24 }, (_, i) =>
    `<div class="prx-leg-seg" style="background:${prxClr(mn + (i / 23) * (mx - mn), mn, mx)}"></div>`
  ).join('');

  const avg = Math.round(prxData.reduce((s, v) => s + v, 0) / prxData.length);
  document.getElementById('prx-sum').innerHTML = `
    <span style="color:var(--faint)">Avg application:</span> <b style="color:var(--moss)">${avg} kg/ha</b><br>
    <span style="color:var(--faint)">Total needed:</span> <b>${Math.round(avg * 42)} kg</b><br>
    <span style="color:var(--faint)">Field area:</span> 42 ha<br>
    <span style="color:var(--faint)">Grid resolution:</span> 64 zones (8×8)<br>
    <span style="color:var(--faint)">Savings vs flat-rate:</span> <b style="color:var(--fern)">~18%</b>`;
}

// ─── Alerts Page ─────────────────────────────────────────────
function renderAlertsPage() {
  document.getElementById('alerts-full').innerHTML = ALERTS_DATA.map(a => `
    <div class="alert-item ai-${a.sev}">
      <div class="al-icon">${a.icon}</div>
      <div style="flex:1">
        <div class="al-title">${a.field} — ${a.type[0].toUpperCase() + a.type.slice(1)} Alert</div>
        <div class="al-msg">${a.msg}</div>
        <div class="al-meta">Severity: <b>${a.sev==='h'?'HIGH':a.sev==='m'?'MEDIUM':'LOW'}</b> · ${a.time} · Auto-generated by AgriSmart AI</div>
      </div>
      <button onclick="sendSMS('${a.field}','${a.msg}')"
              style="background:var(--moss);color:#fff;border:none;border-radius:7px;
                     padding:7px 12px;font-size:11px;font-family:var(--font-m);
                     cursor:pointer;flex-shrink:0;align-self:flex-start;font-weight:500">
        📱 SMS
      </button>
    </div>`).join('');

  document.getElementById('a-rules').innerHTML = ALERT_RULES.map(r =>
    `<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px dashed var(--sand)">
       <span style="color:var(--fern);font-weight:700">→</span>${r}
     </div>`
  ).join('');
}

// ─── AI Advisor ──────────────────────────────────────────────
function renderAdvisor() {
  document.getElementById('qbtns').innerHTML = QUICK_QUESTIONS.map(q =>
    `<button class="qbtn" onclick="setQ('${q.replace(/'/g, '')}')">${q}</button>`
  ).join('');

  document.getElementById('ctx').innerHTML =
    FIELDS.map(f => `✅ ${f.name}: ${f.crop} · Health ${f.health}% · NDVI ${f.ndvi}`).join('<br>') +
    '<br>🌦 Weather: 19.2°C · 64% RH · Partly Cloudy';

  document.getElementById('api-list').innerHTML = APIS.map(a => `
    <div style="display:flex;align-items:center;gap:10px;background:var(--parchment);
                border:1px solid var(--sand);border-radius:7px;padding:8px 11px">
      <div style="width:7px;height:7px;border-radius:50%;background:${a.ok ? 'var(--leaf)' : 'var(--rust)'}"></div>
      <div>
        <div style="font-weight:600;font-size:12px;color:var(--earth)">${a.name}</div>
        <div style="font-family:var(--font-m);font-size:10px;color:var(--faint)">${a.note}</div>
      </div>
    </div>`).join('');
}

// ─── Pest Detection History ──────────────────────────────────
function renderPestHist() {
  document.getElementById('pest-hist').innerHTML = PEST_HISTORY.map(p => `
    <div class="card-sm">
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div style="font-weight:600;font-size:13px;color:var(--earth)">${p.pest}</div>
        <span style="font-family:var(--font-m);font-size:10px;color:var(--faint)">${p.date}</span>
      </div>
      <div style="font-family:var(--font-m);font-size:11px;color:var(--faint);margin-top:3px">
        ${p.field} · Confidence: <span style="color:var(--fern);font-weight:500">${p.conf}%</span>
      </div>
    </div>`).join('');
}
