const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./emergency.db");

/* -----------------------------
   SIMULATED HOSPITAL DATABASE
------------------------------*/
const hospitals = [
  { name: "City General Hospital", lat: 17.3850, lng: 78.4867 },
  { name: "Apollo Emergency Care", lat: 17.4065, lng: 78.4772 },
  { name: "Sunrise Trauma Center", lat: 17.3721, lng: 78.4910 }
];

function getNearestHospital(userLat, userLng) {
  let nearest = hospitals[0];
  let minDist = Number.MAX_VALUE;

  hospitals.forEach(h => {
    const dist = Math.sqrt((userLat - h.lat) ** 2 + (userLng - h.lng) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearest = h;
    }
  });

  return nearest.name;
}

/* -----------------------------
   DATABASE TABLE
------------------------------*/
db.run(`CREATE TABLE IF NOT EXISTS emergencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lng REAL,
    time TEXT,
    status TEXT,
    contact TEXT,
    name TEXT,
    hospital TEXT
)`);

/* -----------------------------
   SOS API (MAIN EMERGENCY TRIGGER)
------------------------------*/
app.post("/sos", (req, res) => {
  const { lat, lng, contact, name } = req.body;

  if (!lat || !lng || !contact) {
    return res.status(400).json({ error: "Missing required emergency data" });
  }

  const time = new Date().toLocaleString();
  const hospital = getNearestHospital(lat, lng);

  db.run(
    `INSERT INTO emergencies 
     (lat, lng, time, status, contact, name, hospital) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [lat, lng, time, "SOS_SENT", contact, name || "Unknown", hospital],
    function (err) {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }

      res.json({
        message: "Emergency recorded",
        hospital: hospital,
        id: this.lastID
      });
    }
  );
});

/* -----------------------------
   GET LATEST EMERGENCY (Responder View)
------------------------------*/
app.get("/latest-emergency", (req, res) => {
  db.get(
    "SELECT * FROM emergencies ORDER BY id DESC LIMIT 1",
    (err, row) => {
      if (err) {
        console.error("DB Read Error:", err);
        return res.status(500).json({ error: "Database read failed" });
      }
      res.json(row || {});
    }
  );
});

/* -----------------------------
   UPDATE STATUS (Timeline Tracking)
------------------------------*/
app.post("/update-status", (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status required" });

  db.run(
    "UPDATE emergencies SET status = ? WHERE id = (SELECT id FROM emergencies ORDER BY id DESC LIMIT 1)",
    [status],
    (err) => {
      if (err) {
        console.error("Status Update Error:", err);
        return res.status(500).json({ error: "Status update failed" });
      }
      res.json({ message: "Status updated" });
    }
  );
});

/* -----------------------------
   MARK EMERGENCY RESOLVED
------------------------------*/
app.post("/resolve", (req, res) => {
  db.run(
    "UPDATE emergencies SET status = 'RESOLVED' WHERE id = (SELECT id FROM emergencies ORDER BY id DESC LIMIT 1)",
    (err) => {
      if (err) {
        console.error("Resolve Error:", err);
        return res.status(500).json({ error: "Resolve failed" });
      }
      res.json({ message: "Emergency marked as resolved" });
    }
  );
});

/* -----------------------------
   SERVER START
------------------------------*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚑 RapidAid Server running on port ${PORT}`)
);
