# 🌾 agricature — Precision Agriculture Platform

> A full-stack AI-powered farm management system built with Node.js, Express, MongoDB, and Claude AI.

---

## 📁 Project Structure

```
project/
├── public/                  ← All frontend files (served to browser)
│   ├── index.html           ← Main dashboard
│   ├── login.html           ← Farmer registration page
│   ├── styles.css           ← All styles
│   ├── app.js               ← App core, navigation, language
│   ├── data.js              ← All static field data
│   ├── renderers.js         ← DOM rendering functions
│   ├── actions.js           ← User interaction handlers
│   └── script.js            ← Utility scripts
├── server.js                ← Backend (Express + MongoDB)
├── package.json             ← Project dependencies
├── package-lock.json        ← Dependency lock file
├── .env                     ← Secret keys (never share this)
└── .gitignore               ← Files to hide from GitHub
```

---

## ⚙️ Tech Stack

| Layer      | Technology           | Purpose                        |
|------------|----------------------|--------------------------------|
| Frontend   | HTML, CSS, JS        | Dashboard UI                   |
| Backend    | Node.js + Express    | API server                     |
| Database   | MongoDB Atlas        | Store farmers, fields, alerts  |
| AI         | Claude (Anthropic)   | AI Agronomist answers          |
| Maps       | Leaflet + Esri       | Satellite location picker      |
| SMS        | Twilio               | Farm alert messages            |
| IoT        | MQTT                 | Live sensor data               |

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Install Node.js
Download from [nodejs.org](https://nodejs.org) and install the LTS version.

Verify installation:
```bash
node --version
```

---

### Step 2 — Create Project Folder
```bash
mkdir project
cd project
```

---

### Step 3 — Add Your Files
Place all files exactly like the structure shown above.
Frontend files must be inside the `public/` folder.

---

### Step 4 — Install Dependencies
```bash
npm install
```

This installs: `express`, `mongoose`, `cors`, `dotenv`, `@anthropic-ai/sdk`, `twilio`

---

### Step 5 — Create `.env` File
Create a file named `.env` in the root folder:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/agrismart?retryWrites=true&w=majority
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxx
PORT=3000
```

> ⚠️ Never share this file. Never upload to GitHub.

---

### Step 6 — Create `.gitignore` File
Create a file named `.gitignore`:
```
node_modules/
.env
```

---

### Step 7 — Start the Server
```bash
node server.js
```

Expected output:
```
✅ AgriSmart backend running at http://localhost:3000
✅ MongoDB connected
```

---

### Step 8 — Open in Browser
```
http://localhost:3000           → Main Dashboard
http://localhost:3000/login.html → Registration Page
```

---

## 🔌 API Reference

### Health Check
```
GET /api/health
```
Returns server and database status.

---

### Farmers

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/farmers/register` | Register new farmer |
| GET | `/api/farmers` | Get all farmers |
| GET | `/api/farmers/:id` | Get farmer by ID |
| DELETE | `/api/farmers/:id` | Delete farmer |

**Register Farmer — Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "+919876543210",
  "location": "Dharwad, Karnataka",
  "satellite_lat": 15.4589,
  "satellite_lng": 75.0078,
  "satellite_place": "Dharwad, Karnataka, India"
}
```

---

### Fields

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/fields` | Get all fields |
| GET | `/api/fields/:id` | Get field by ID |
| POST | `/api/fields` | Create new field |
| PUT | `/api/fields/:id` | Update field |
| DELETE | `/api/fields/:id` | Delete field |

---

### Alerts

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/alerts` | Get all alerts |
| POST | `/api/alerts` | Create alert |
| PATCH | `/api/alerts/:id/read` | Mark as read |

---

### Sensors

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/sensors/reading` | Save sensor reading |
| GET | `/api/sensors/:name/history` | Get sensor history |

---

### Yield Prediction

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/predict/yield` | Run yield prediction |
| GET | `/api/predict/yield/history` | Get prediction history |

**Predict Yield — Request Body:**
```json
{
  "n": 82,
  "p": 61,
  "k": 74,
  "ph": 6.5,
  "moisture": 68,
  "temp": 19
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "yield_t_ha": 4.21,
    "verdict": "Above regional average — conditions are excellent.",
    "model": "Random Forest · R² 0.913"
  }
}
```

---

### AI Agronomist

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/ai/ask` | Ask Claude AI a question |

**Request Body:**
```json
{
  "question": "When should I irrigate West Lot?",
  "fieldContext": "West Lot: moisture 28%, health 44%"
}
```

---

### SMS Alerts

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/sms/send` | Send SMS to farmer |

---

## 🌍 Language Support

The dashboard supports 5 languages. Click the buttons in the top bar to switch:

| Button | Language |
|--------|----------|
| EN | English |
| हि | Hindi |
| ಕ | Kannada |
| తె | Telugu |
| म | Marathi |

Language preference is saved automatically and remembered on next visit.

---

## 🗺️ Satellite Map (Login Page)

- Built with **Leaflet.js** + **Esri World Imagery** (free, no API key needed)
- Click anywhere on the map to drop a pin
- Location name is auto-fetched using **OpenStreetMap Nominatim** (free reverse geocoding)
- GPS coordinates and place name are saved to MongoDB on registration

---

## 🧠 AI Features

### Yield Predictor
- Simulated Random Forest model
- Takes: Nitrogen, Phosphorus, Potassium, pH, Moisture, Temperature
- Returns predicted yield in tonnes/hectare
- R² score: 0.913

### Pest Detector
- Simulated EfficientNet-B4 CNN model
- Identifies 38 diseases + 12 pest types
- Returns pest name, confidence %, severity, and recommended action

### AI Agronomist
- Powered by **Claude claude-sonnet-4-20250514**
- Has full context of all your fields
- Answers questions about irrigation, fertilizer, pests, weather

---

## 📡 IoT Sensors Supported

| Sensor | Model | Measures |
|--------|-------|----------|
| Capacitive Moisture | SKU:SEN0114 | Soil water % |
| NPK Sensor | JXBS-3001 | N, P, K levels |
| Weather Sensor | Bosch BME280 | Temp, Humidity |
| pH Sensor | DFRobot SEN0161 | Soil pH |
| Rain Gauge | Davis 7852 | Rainfall mm |
| Anemometer | Davis 7911 | Wind speed |

---

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ Yes | MongoDB Atlas connection string |
| `ANTHROPIC_API_KEY` | ✅ Yes | Claude AI API key |
| `PORT` | ❌ No | Server port (default: 3000) |
| `TWILIO_SID` | ❌ Optional | Twilio account SID for SMS |
| `TWILIO_TOKEN` | ❌ Optional | Twilio auth token |
| `TWILIO_FROM` | ❌ Optional | Twilio phone number |

---

## ❗ Common Errors and Fixes

### `Cannot find module 'server.js'`
You are in the wrong folder. Run:
```bash
cd /Users/yourname/Desktop/project
node server.js
```

### `MongoParseError: Invalid scheme`
Your `.env` file has a typo. Make sure there are no spaces around `=` and no quote marks.

### `bad auth: authentication failed`
Your MongoDB password is wrong. Go to Atlas → Database Access → Edit user → Reset password.

### `Could not connect to any servers`
Your IP is not whitelisted. Go to Atlas → Network Access → Add IP → Allow from anywhere (`0.0.0.0/0`).

### Blank screen in browser
Your frontend files are not inside the `public/` folder. Run:
```bash
mv index.html login.html styles.css app.js data.js renderers.js actions.js script.js public/
```

---

## 🛠️ Useful Commands

```bash
# Start server
node server.js

# Start with auto-restart on file changes
npx nodemon server.js

# Check files in current folder
ls

# Check which folder you are in
pwd

# Move into project folder
cd /Users/yourname/Desktop/project

# Install all packages
npm install

# Check Node version
node --version
```

---

## 📱 Browser URLs

```
http://localhost:3000              → Main Dashboard
http://localhost:3000/login.html   → Farmer Registration
http://localhost:3000/api/health   → Server Health Check
http://localhost:3000/api/farmers  → All Registered Farmers
http://localhost:3000/api/fields   → All Farm Fields
http://localhost:3000/api/alerts   → All Alerts
```

---

## 👨‍💻 Built With

- [Node.js](https://nodejs.org) — JavaScript runtime
- [Express](https://expressjs.com) — Web framework
- [MongoDB Atlas](https://mongodb.com/atlas) — Cloud database
- [Mongoose](https://mongoosejs.com) — MongoDB ODM
- [Anthropic Claude](https://anthropic.com) — AI agronomist
- [Leaflet.js](https://leafletjs.com) — Interactive maps
- [Twilio](https://twilio.com) — SMS alerts
- [dotenv](https://npmjs.com/package/dotenv) — Environment variables

---

*AgriSmart 2026 — Precision Agriculture Platform · Karnataka, India*
