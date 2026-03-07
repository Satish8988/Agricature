// ============================================================
//  AgriSmart 2026 — App Core
//  State management, navigation, initialization
//  + Farmer login session, language support
// ============================================================

// ─── Language Strings ────────────────────────────────────────
const LANG = {
  en: {
    overview:    'Field Overview',
    myfields:    'My Fields',
    sensors:     'IoT Sensors',
    yield:       'Yield Predictor',
    pest:        'Pest Detector',
    sowing:      'Sowing Advisor',
    prx:         'Prescription Map',
    advisor:     'AI Agronomist',
    alerts:      'Alerts',
    totalArea:   'Total Area',
    avgHealth:   'Avg Field Health',
    avgNdvi:     'Avg NDVI Index',
    activeAlerts:'Active Alerts',
    welcome:     'Welcome',
    location:    'Location',
    operations:  'Operations',
    aitools:     'AI Tools',
    intelligence:'Intelligence',
    lastSync:    'Last sync',
    tapField:    'Tap a field to view detailed sensor data and AI recommendations.',
    liveTitle:   'Live Telemetry',
    greet:       'Good morning',
  },
  hi: {
    overview:    'फील्ड अवलोकन',
    myfields:    'मेरे खेत',
    sensors:     'IoT सेंसर',
    yield:       'उपज पूर्वानुमान',
    pest:        'कीट पहचान',
    sowing:      'बुआई सलाहकार',
    prx:         'प्रिस्क्रिप्शन मानचित्र',
    advisor:     'AI कृषि विशेषज्ञ',
    alerts:      'अलर्ट',
    totalArea:   'कुल क्षेत्र',
    avgHealth:   'औसत स्वास्थ्य',
    avgNdvi:     'औसत NDVI',
    activeAlerts:'सक्रिय अलर्ट',
    welcome:     'स्वागत है',
    location:    'स्थान',
    operations:  'संचालन',
    aitools:     'AI उपकरण',
    intelligence:'इंटेलिजेंस',
    lastSync:    'अंतिम सिंक',
    tapField:    'विस्तृत डेटा देखने के लिए खेत पर टैप करें।',
    liveTitle:   'लाइव टेलीमेट्री',
    greet:       'सुप्रभात',
  },
  kn: {
    overview:    'ಕ್ಷೇತ್ರ ಅವಲೋಕನ',
    myfields:    'ನನ್ನ ಹೊಲಗಳು',
    sensors:     'IoT ಸಂವೇದಕಗಳು',
    yield:       'ಇಳುವರಿ ಮುನ್ಸೂಚನೆ',
    pest:        'ಕೀಟ ಪತ್ತೆ',
    sowing:      'ಬಿತ್ತನೆ ಸಲಹೆ',
    prx:         'ಪ್ರಿಸ್ಕ್ರಿಪ್ಶನ್ ನಕ್ಷೆ',
    advisor:     'AI ಕೃಷಿ ತಜ್ಞ',
    alerts:      'ಎಚ್ಚರಿಕೆಗಳು',
    totalArea:   'ಒಟ್ಟು ಪ್ರದೇಶ',
    avgHealth:   'ಸರಾಸರಿ ಆರೋಗ್ಯ',
    avgNdvi:     'ಸರಾಸರಿ NDVI',
    activeAlerts:'ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆಗಳು',
    welcome:     'ಸ್ವಾಗತ',
    location:    'ಸ್ಥಳ',
    operations:  'ಕಾರ್ಯಾಚರಣೆಗಳು',
    aitools:     'AI ಉಪಕರಣಗಳು',
    intelligence:'ಬುದ್ಧಿಮತ್ತೆ',
    lastSync:    'ಕೊನೆಯ ಸಿಂಕ್',
    tapField:    'ವಿವರವಾದ ಡೇಟಾ ನೋಡಲು ಹೊಲ ಟ್ಯಾಪ್ ಮಾಡಿ.',
    liveTitle:   'ನೇರ ಡೇಟಾ',
    greet:       'ಶುಭೋದಯ',
  },
  te: {
    overview:    'పొల అవలోకనం',
    myfields:    'నా పొలాలు',
    sensors:     'IoT సెన్సార్లు',
    yield:       'దిగుబడి అంచనా',
    pest:        'పురుగు గుర్తింపు',
    sowing:      'విత్తనం సలహా',
    prx:         'ప్రిస్క్రిప్షన్ మ్యాప్',
    advisor:     'AI వ్యవసాయ నిపుణుడు',
    alerts:      'హెచ్చరికలు',
    totalArea:   'మొత్తం విస్తీర్ణం',
    avgHealth:   'సగటు ఆరోగ్యం',
    avgNdvi:     'సగటు NDVI',
    activeAlerts:'యాక్టివ్ హెచ్చరికలు',
    welcome:     'స్వాగతం',
    location:    'స్థానం',
    operations:  'కార్యకలాపాలు',
    aitools:     'AI సాధనాలు',
    intelligence:'తెలివి',
    lastSync:    'చివరి సింక్',
    tapField:    'వివరాల కోసం పొలం నొక్కండి.',
    liveTitle:   'లైవ్ డేటా',
    greet:       'శుభోదయం',
  },
  mr: {
    overview:    'शेत विहंगावलोकन',
    myfields:    'माझी शेतं',
    sensors:     'IoT सेन्सर्स',
    yield:       'उत्पादन अंदाज',
    pest:        'कीड ओळख',
    sowing:      'पेरणी सल्लागार',
    prx:         'प्रिस्क्रिप्शन नकाशा',
    advisor:     'AI कृषी तज्ञ',
    alerts:      'अलर्ट',
    totalArea:   'एकूण क्षेत्र',
    avgHealth:   'सरासरी आरोग्य',
    avgNdvi:     'सरासरी NDVI',
    activeAlerts:'सक्रिय अलर्ट',
    welcome:     'स्वागत',
    location:    'स्थान',
    operations:  'कार्यान्वयन',
    aitools:     'AI साधने',
    intelligence:'बुद्धिमत्ता',
    lastSync:    'शेवटचे सिंक',
    tapField:    'तपशीलवार डेटा पाहण्यासाठी शेत टॅप करा.',
    liveTitle:   'थेट डेटा',
    greet:       'सुप्रभात',
  },
};

// ─── Global State ───────────────────────────────────────────
let selF       = null;
let curNut     = 'N';
let prxData    = [];
let curLang    = localStorage.getItem('agri_lang') || 'en';
let farmerData = null;   // loaded from backend

// ─── Lang Helper ─────────────────────────────────────────────
function t(key) {
  return (LANG[curLang] && LANG[curLang][key]) || LANG['en'][key] || key;
}

// ─── Boot ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  selF = FIELDS[0];

  // Set today's date in header
  document.getElementById('today-date').textContent =
    new Date().toLocaleDateString('en-IN', {
      weekday:'long', year:'numeric', month:'long', day:'numeric'
    });

  // Load farmer from backend
  await loadFarmer();

  // Apply language to UI
  applyLanguage();

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

// ─── Load Farmer from Backend ────────────────────────────────
async function loadFarmer() {
  try {
    const res  = await fetch('/api/farmers?limit=1');
    const data = await res.json();

    // Get the most recently registered farmer
    if (data.success && data.data && data.data.length > 0) {
      farmerData = data.data[0];

      // Update farmer name in topbar
      const nameEl = document.getElementById('user-name');
      if (nameEl) nameEl.textContent = farmerData.name;

      // Update location in weather chip
      const locEl = document.getElementById('farmer-location');
      if (locEl) {
        const loc = farmerData.satellite_place || farmerData.location || 'Karnataka, IN';
        // Shorten to first 2 parts (e.g. "Dharwad, Karnataka")
        locEl.textContent = loc.split(',').slice(0, 2).join(',').trim();
      }
    }
  } catch (err) {
    console.log('Could not load farmer data:', err.message);
  }
}

// ─── Apply Language to Static UI Elements ────────────────────
function applyLanguage() {
  // Sidebar labels
  const labels = {
    'nav-overview':     t('overview'),
    'nav-fields':       t('myfields'),
    'nav-sensors':      t('sensors'),
    'nav-yield':        t('yield'),
    'nav-pest':         t('pest'),
    'nav-sowing':       t('sowing'),
    'nav-prx':          t('prx'),
    'nav-advisor':      t('advisor'),
    'nav-alerts':       t('alerts'),
    'side-head-ops':    t('operations'),
    'side-head-ai':     t('aitools'),
    'side-head-intel':  t('intelligence'),
  };
  Object.entries(labels).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // KPI card labels
  const kpiLabels = {
    'kpi-area':    t('totalArea'),
    'kpi-health':  t('avgHealth'),
    'kpi-ndvi':    t('avgNdvi'),
    'kpi-alerts':  t('activeAlerts'),
  };
  Object.entries(kpiLabels).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // Fields page subtitle
  const fieldsSub = document.getElementById('fields-sub');
  if (fieldsSub) fieldsSub.textContent = t('tapField');

  // Greet farmer
  if (farmerData) {
    const greetEl = document.getElementById('farmer-greet');
    if (greetEl) greetEl.textContent = `${t('greet')}, ${farmerData.name.split(' ')[0]}! 👋`;
  }
}

// ─── Language Switcher ────────────────────────────────────────
function switchLang(lang) {
  curLang = lang;
  localStorage.setItem('agri_lang', lang);

  // Update active button styles
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('lang-active', b.dataset.lang === lang);
  });

  applyLanguage();
  renderAll();
}

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
