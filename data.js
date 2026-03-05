// ============================================================
//  AgriSmart 2026 — Data Layer
//  All static field data, sensor configs, and constants
// ============================================================

const FIELDS = [
  { id:1, name:"North Paddock", crop:"Wheat",   area:42, health:87, risk:"low",    ndvi:.74, moist:68, n:82, p:61, k:74, temp:19.2, hum:64 },
  { id:2, name:"South Block",   crop:"Corn",    area:31, health:62, risk:"medium", ndvi:.51, moist:42, n:55, p:78, k:63, temp:21.1, hum:71 },
  { id:3, name:"East Quarter",  crop:"Soybean", area:18, health:91, risk:"low",    ndvi:.81, moist:73, n:90, p:85, k:88, temp:18.8, hum:58 },
  { id:4, name:"West Lot",      crop:"Barley",  area:27, health:44, risk:"high",   ndvi:.33, moist:28, n:38, p:42, k:51, temp:23.5, hum:82 },
];

const ALERTS_DATA = [
  { type:"pest",      sev:"h", field:"West Lot",      msg:"Aphid population spike detected. Spray recommended at dawn.",   time:"2h ago", icon:"🐛" },
  { type:"weather",   sev:"m", field:"South Block",   msg:"Frost risk overnight. Cover sensitive crops immediately.",       time:"4h ago", icon:"❄️" },
  { type:"soil",      sev:"l", field:"North Paddock", msg:"Nitrogen levels optimal. No action required.",                   time:"6h ago", icon:"🧪" },
  { type:"irrigation",sev:"m", field:"West Lot",      msg:"Soil moisture critically low (28%). Irrigate within 24 hours.", time:"8h ago", icon:"💧" },
];

const SOWING = [
  { crop:"Wheat",   ok:true,  dd:142, st:12.4, win:"Plant Now",      conf:94 },
  { crop:"Corn",    ok:false, dd:89,  st:12.4, win:"Wait 8–12 days", conf:71 },
  { crop:"Canola",  ok:true,  dd:167, st:12.4, win:"Plant Now",      conf:88 },
  { crop:"Soybean", ok:false, dd:61,  st:12.4, win:"Wait 18–22 days",conf:79 },
];

const SENSORS = [
  { name:"Capacitive Moisture", model:"SKU:SEN0114",    val:() => Math.round(42 + Math.random() * 6) + "%",                                                                          icon:"💧", st:"ok",   field:"West Lot"      },
  { name:"RS485 NPK Sensor",    model:"JXBS-3001",      val:() => "N:" + Math.round(38+Math.random()*3) + " P:" + Math.round(40+Math.random()*3) + " K:" + Math.round(49+Math.random()*4), icon:"🧬", st:"ok",   field:"West Lot"      },
  { name:"BME280 Weather",      model:"Bosch BME280",   val:() => (22.8 + Math.random() * .5).toFixed(1) + "°C",                                                                    icon:"🌡", st:"ok",   field:"North Paddock" },
  { name:"pH Soil Sensor",      model:"DFRobot SEN0161",val:() => (6.2 + Math.random() * .3).toFixed(1) + " pH",                                                                    icon:"⚗️", st:"warn", field:"South Block"   },
  { name:"Rain Gauge",          model:"Davis 7852",     val:() => Math.round(Math.random() * 3) + " mm",                                                                             icon:"🌧", st:"ok",   field:"All Fields"    },
  { name:"Anemometer",          model:"Davis 7911",     val:() => Math.round(8 + Math.random() * 4) + " km/h",                                                                       icon:"💨", st:"ok",   field:"All Fields"    },
];

const HARDWARE = [
  { name:"Capacitive Moisture v1.2",   use:"Soil water content (0–100%)",     proto:"Analog / I2C",   cost:"~₹450"   },
  { name:"RS485 NPK Sensor JXBS-3001", use:"Nitrogen, Phosphorus, Potassium", proto:"RS485 / Modbus", cost:"~₹6,200" },
  { name:"BME280",                     use:"Temperature, Humidity, Pressure",  proto:"I2C / SPI",      cost:"~₹380"   },
  { name:"DFRobot pH SEN0161",         use:"Soil pH 0–14",                    proto:"Analog",         cost:"~₹2,100" },
  { name:"ESP32 + MQTT Gateway",       use:"Wireless data transmission",       proto:"WiFi / MQTT",    cost:"~₹650"   },
];

const FEATURES = [
  { name:"Nitrogen (N)", pct:31, c:"#4a7a28" },
  { name:"Rainfall",     pct:24, c:"#3a7fa8" },
  { name:"Temperature",  pct:18, c:"#d4821a" },
  { name:"Soil pH",      pct:12, c:"#8a4a1a" },
  { name:"NDVI",         pct:9,  c:"#4a9e6a" },
  { name:"Phosphorus",   pct:6,  c:"#7a4a9e" },
];

const PEST_DB = [
  { pest:"Aphids (Aphis fabae)",    conf:91, sev:"h", icon:"🐛", action:"Apply neem oil solution at 4L/ha. Spray at dawn when aphids are least active. Inspect again in 48 hours." },
  { pest:"Powdery Mildew",          conf:83, sev:"m", icon:"🍄", action:"Apply sulfur-based fungicide at 3g/L. Improve air circulation and avoid overhead irrigation."             },
  { pest:"Leaf Rust (Puccinia sp)", conf:76, sev:"m", icon:"🍂", action:"Apply triazole fungicide immediately. Remove and destroy heavily infected leaf material."                 },
  { pest:"Healthy — No pest found", conf:97, sev:"l", icon:"✅", action:"No pest or disease detected. Continue standard monitoring schedule every 7–10 days."                      },
];

const PEST_HISTORY = [
  { pest:"Aphids (Aphis fabae)", field:"West Lot",     conf:91, date:"Today, 09:14" },
  { pest:"Powdery Mildew",       field:"South Block",  conf:78, date:"Yesterday"    },
  { pest:"Healthy crop",         field:"East Quarter", conf:97, date:"2 days ago"   },
];

const QUICK_QUESTIONS = [
  "Best time to irrigate West Lot?",
  "Why is South Block's NDVI low?",
  "Fungicide needed this week?",
  "Explain NPK deficiency symptoms",
  "Yield outlook for North Paddock?",
];

const APIS = [
  { name:"OpenWeatherMap API", ok:true, note:"Real-time & forecast"  },
  { name:"Sentinel-2 NDVI",    ok:true, note:"Updated 3h ago"        },
  { name:"NASA POWER API",     ok:true, note:"Solar radiation data"  },
  { name:"Twilio SMS",         ok:true, note:"7 messages sent today" },
  { name:"MQTT Broker",        ok:true, note:"12 devices online"     },
];

const ALERT_RULES = [
  "Soil moisture < 30% → Irrigation alert",
  "Pest confidence > 70% → Immediate SMS",
  "NDVI drop > 0.15 in 7 days → Flag field",
  "Frost probability > 60% → Cover warning",
  "N < 40 kg/ha → Fertilizer recommendation",
];

const WEEKLY_YIELD = [
  { d:"Mon", a:3.2, p:3.0 },
  { d:"Tue", a:3.5, p:3.4 },
  { d:"Wed", a:3.1, p:3.3 },
  { d:"Thu", a:3.8, p:3.6 },
  { d:"Fri", a:4.1, p:3.9 },
  { d:"Sat", a:3.9, p:4.0 },
  { d:"Sun", a:null,p:4.2 },
];

const YIELD_INPUTS_CONFIG = [
  { id:"yn",  label:"Nitrogen kg/ha", value:82,  step:1   },
  { id:"yp",  label:"Phosphorus",     value:61,  step:1   },
  { id:"yk",  label:"Potassium",      value:74,  step:1   },
  { id:"yph", label:"Soil pH",        value:6.5, step:.1  },
  { id:"ym",  label:"Moisture %",     value:68,  step:1   },
  { id:"yt",  label:"Temp °C",        value:19,  step:.5  },
];

const FORECAST_MAX = [24, 26, 22, 19, 21, 25, 27, 23, 20, 22];
const FORECAST_MIN = [12, 14, 11,  9, 10, 13, 15, 11,  9, 11];

const SOWING_CONDITIONS = [
  { label:"🌡 Soil Temp",  value:"12.4°C",   color:"var(--amber)" },
  { label:"💧 Moisture",   value:"58%",       color:"var(--sky)"   },
  { label:"🌬 Wind",       value:"14 km/h",   color:"var(--ink)"   },
  { label:"🌧 Rain 7-day", value:"12 mm",     color:"var(--sky)"   },
  { label:"☀️ Sunshine",   value:"7.2 h/day", color:"var(--amber)" },
  { label:"❄️ Frost Risk", value:"Low (8%)",  color:"var(--fern)"  },
];

const AI_FALLBACKS = {
  irrigat:  "West Lot requires immediate irrigation — moisture is at critical 28%. Apply 25mm at dawn to avoid heat-stress. North Paddock (68%) and East Quarter (73%) are at optimal levels and should not be irrigated.",
  ndvi:     "South Block's NDVI of 0.51 signals moderate crop stress, likely driven by low nitrogen (55 kg/ha) combined with elevated temperature (21.1°C). Recommend a top-dress application of 30 kg N/ha within 5 days and schedule a ground inspection.",
  fungicid: "Current humidity across South Block (71%) and West Lot (82%) creates favourable conditions for fungal development. A preventive mancozeb spray (2.5g/L) before Thursday's forecasted rainfall event is strongly recommended.",
  npk:      "Nitrogen deficiency: older leaf chlorosis starting from the tip. Phosphorus deficiency: purple or reddish discolouration on leaf undersides. Potassium deficiency: brown scorched margins on leaves with intervein yellowing.",
  default:  "North Paddock and East Quarter are in excellent condition (health 87–91%). Immediate priorities: (1) irrigate West Lot within 24 hours, (2) investigate South Block NDVI decline with a ground inspection, (3) apply aphid treatment to West Lot at dawn. Overall farm yield is tracking 12% above last season.",
};
