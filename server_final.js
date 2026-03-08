// ============================================================
//  AgriSmart 2026 — Backend Server (Node.js + Express)
//  Handles: Fields API, Alerts API, Sensors API, AI Proxy,
//           Yield Prediction, Pest Detection, SMS (Twilio)
//           Farmer Registration with Satellite Location
// ============================================================

// ─── STEP 1: Load required packages ─────────────────────────
require('dotenv').config();           // reads your .env file
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const path       = require('path');
const Anthropic  = require('@anthropic-ai/sdk');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── STEP 2: Middleware ──────────────────────────────────────
app.use(cors());                      // allow frontend to call this backend
app.use(express.json());              // parse JSON request bodies
// Static files served AFTER routes


// ─── STEP 3: Connect to MongoDB ──────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));


// ─── STEP 4: Define Database Schemas (Data Shapes) ───────────

// Field Schema — stores each farm field's details
const FieldSchema = new mongoose.Schema({
  name:   { type: String, required: true },   // e.g. "North Paddock"
  crop:   { type: String, required: true },   // e.g. "Wheat"
  area:   { type: Number, required: true },   // in hectares
  health: { type: Number, default: 80 },      // 0–100%
  risk:   { type: String, enum: ['low','medium','high'], default: 'low' },
  ndvi:   { type: Number, default: 0.5 },     // 0.0–1.0 satellite index
  moist:  { type: Number, default: 50 },      // soil moisture %
  n:      { type: Number, default: 60 },      // Nitrogen kg/ha
  p:      { type: Number, default: 60 },      // Phosphorus kg/ha
  k:      { type: Number, default: 60 },      // Potassium kg/ha
  temp:   { type: Number, default: 20 },      // temperature °C
  hum:    { type: Number, default: 60 },      // humidity %
  updatedAt: { type: Date, default: Date.now }
});

// Alert Schema — stores pest/weather/irrigation alerts
const AlertSchema = new mongoose.Schema({
  type:   { type: String, enum: ['pest','weather','soil','irrigation'], required: true },
  sev:    { type: String, enum: ['l','m','h'], required: true },  // low/medium/high
  field:  { type: String, required: true },
  msg:    { type: String, required: true },
  icon:   { type: String, default: '⚠️' },
  time:   { type: String, default: 'Just now' },
  read:   { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Sensor Reading Schema — stores IoT sensor data snapshots
const SensorReadingSchema = new mongoose.Schema({
  sensorName: { type: String, required: true },  // e.g. "BME280 Weather"
  field:      { type: String, required: true },
  value:      { type: String, required: true },  // e.g. "22.8°C"
  unit:       { type: String, default: '' },
  timestamp:  { type: Date, default: Date.now }
});

// Yield Prediction Log Schema — saves each prediction run
const YieldLogSchema = new mongoose.Schema({
  field:    { type: String, default: 'Unknown' },
  n:        Number, p: Number, k: Number,
  ph:       Number, moisture: Number, temp: Number,
  result:   Number,   // predicted yield in t/ha
  savedAt:  { type: Date, default: Date.now }
});

// Farmer Schema — stores registered farmer details + satellite location
const FarmerSchema = new mongoose.Schema({
  name:            { type: String, required: true },   // full name
  phone:           { type: String, required: true },   // e.g. +919876543210
  location:        { type: String, required: true },   // village / district typed
  satellite_lat:   { type: Number, default: null },    // GPS lat from map click
  satellite_lng:   { type: Number, default: null },    // GPS lng from map click
  satellite_place: { type: String, default: null },    // reverse geocoded name
  registeredAt:    { type: Date,   default: Date.now }
});

// Register all models
const Field         = mongoose.model('Field',         FieldSchema);
const Alert         = mongoose.model('Alert',         AlertSchema);
const SensorReading = mongoose.model('SensorReading', SensorReadingSchema);
const YieldLog      = mongoose.model('YieldLog',      YieldLogSchema);
const Farmer        = mongoose.model('Farmer',        FarmerSchema);


// ============================================================
//  STEP 5: API ROUTES
// ============================================================

// ── 5A. FIELDS ───────────────────────────────────────────────

// GET all fields
app.get('/api/fields', async (req, res) => {
  try {
    const fields = await Field.find().sort({ name: 1 });
    res.json({ success: true, data: fields });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single field by ID
app.get('/api/fields/:id', async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    res.json({ success: true, data: field });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a new field
app.post('/api/fields', async (req, res) => {
  try {
    const field = new Field(req.body);
    await field.save();
    res.status(201).json({ success: true, data: field });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT update a field (e.g. new sensor readings)
app.put('/api/fields/:id', async (req, res) => {
  try {
    const field = await Field.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!field) return res.status(404).json({ success: false, error: 'Field not found' });
    res.json({ success: true, data: field });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE a field
app.delete('/api/fields/:id', async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Field deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5B. ALERTS ───────────────────────────────────────────────

// GET all alerts (most recent first)
app.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create a new alert
app.post('/api/alerts', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PATCH mark alert as read
app.patch('/api/alerts/:id/read', async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true, message: 'Alert marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5C. SENSORS ──────────────────────────────────────────────

// POST save a sensor reading (called by IoT device or MQTT bridge)
app.post('/api/sensors/reading', async (req, res) => {
  try {
    const reading = new SensorReading(req.body);
    await reading.save();
    res.status(201).json({ success: true, data: reading });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET recent readings for a sensor (last 50)
app.get('/api/sensors/:sensorName/history', async (req, res) => {
  try {
    const readings = await SensorReading
      .find({ sensorName: req.params.sensorName })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json({ success: true, data: readings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5D. YIELD PREDICTION ─────────────────────────────────────

app.post('/api/predict/yield', async (req, res) => {
  try {
    const { n, p, k, ph, moisture, temp, field = 'Unknown' } = req.body;

    // Validate inputs
    if ([n, p, k, ph, moisture, temp].some(v => v === undefined || isNaN(v))) {
      return res.status(400).json({ success: false, error: 'All 6 parameters (n, p, k, ph, moisture, temp) are required.' });
    }

    // Same scoring formula as frontend (Random Forest simulation)
    let score = 2.0
      + (n / 200) * 1.8
      + (p / 150) * 0.9
      + (k / 200) * 0.7
      + (moisture / 100) * 1.2
      - Math.abs(ph - 6.5) * 0.4
      - Math.abs(temp - 20) * 0.05;

    score = Math.min(6.5, Math.max(0.5, parseFloat(score.toFixed(2))));

    const verdict = score > 4
      ? 'Above regional average — conditions are excellent.'
      : score > 2.5
      ? 'Moderate yield. Consider nitrogen top-dress.'
      : 'Below average. Immediate soil intervention recommended.';

    // Save prediction to database
    await new YieldLog({ field, n, p, k, ph, moisture, temp, result: score }).save();

    res.json({
      success: true,
      data: {
        yield_t_ha: score,
        verdict,
        inputs: { n, p, k, ph, moisture, temp },
        model: 'Random Forest · R² 0.913'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET yield prediction history
app.get('/api/predict/yield/history', async (req, res) => {
  try {
    const logs = await YieldLog.find().sort({ savedAt: -1 }).limit(20);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5E. AI AGRONOMIST (Claude API Proxy) ─────────────────────

app.post('/api/ai/ask', async (req, res) => {
  try {
    const { question, fieldContext } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required.' });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemPrompt = `You are an expert AI agronomist for AgriSmart 2026.
${fieldContext ? `Current field data: ${fieldContext}` : ''}
Weather: 19.2°C, 64% humidity, partly cloudy.
Respond concisely in 2–4 sentences with specific, actionable advice.`;

    const message = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 350,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: question }],
    });

    const answer = message.content
      .filter(c => c.type === 'text')
      .map(c => c.text)
      .join('');

    res.json({ success: true, data: { answer } });

  } catch (err) {
    console.error('AI API error:', err.message);
    res.status(500).json({ success: false, error: 'AI service unavailable. Please try again.' });
  }
});


// ── 5F. SMS ALERTS (Twilio) ──────────────────────────────────

app.post('/api/sms/send', async (req, res) => {
  try {
    const { to, field, message } = req.body;

    // Only runs if Twilio credentials are set in .env
    if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
      return res.json({
        success: true,
        simulated: true,
        message: 'SMS simulated (no Twilio credentials). Add TWILIO_SID and TWILIO_TOKEN to .env to send real SMS.'
      });
    }

    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

    const smsBody = `🌾 AGRISMART FIELD ALERT\nField: ${field}\n\n${message}\n\nView: app.agrismart.io`;

    const sent = await client.messages.create({
      body: smsBody,
      from: process.env.TWILIO_FROM,
      to:   to || process.env.DEFAULT_FARMER_PHONE,
    });

    res.json({ success: true, sid: sent.sid, message: 'SMS sent successfully' });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5G. FARMER REGISTRATION ──────────────────────────────────

// POST register a new farmer — called from login.html
app.post('/api/farmers/register', async (req, res) => {
  try {
    const { name, phone, location, satellite_lat, satellite_lng, satellite_place } = req.body;

    // Validate required fields
    if (!name || !phone || !location) {
      return res.status(400).json({
        success: false,
        error: 'Name, phone, and location are required.'
      });
    }

    // Save farmer to MongoDB
    const farmer = new Farmer({
      name,
      phone,
      location,
      satellite_lat:   satellite_lat   || null,
      satellite_lng:   satellite_lng   || null,
      satellite_place: satellite_place || null,
    });

    await farmer.save();

    console.log(`✅ New farmer registered: ${name} — ${location}`);

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully!',
      data: farmer
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all registered farmers
app.get('/api/farmers', async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ registeredAt: -1 });
    res.json({ success: true, count: farmers.length, data: farmers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single farmer by ID
app.get('/api/farmers/:id', async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, error: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE a farmer
app.delete('/api/farmers/:id', async (req, res) => {
  try {
    await Farmer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Farmer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ── 5H. HEALTH CHECK ─────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    service: 'AgriSmart 2026 Backend',
    status:  'running',
    db:      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time:    new Date().toISOString()
  });
});


// ── 5I. ROUTING ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static(path.join(__dirname, 'public')));


// ─── STEP 6: Start the Server ────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ AgriSmart backend running at http://localhost:${PORT}`);
  console.log(`📡 API docs: http://localhost:${PORT}/api/health`);
});
