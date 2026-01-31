const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./emergency.db");

// Simulated hospitals
const hospitals = [
  { name: "City General Hospital", lat: 17.3850, lng: 78.4867 },
  { name: "Apollo Emergency Care", lat: 17.4065, lng: 78.4772 },
  { name: "Sunrise Trauma Center", lat: 17.3721, lng: 78.4910 }
];

function getNearestHospital(userLat, userLng) {
  let nearest = hospitals[0];
  let minDist = Number.MAX_VALUE;

  hospitals.forEach(h => {
    const dist = Math.sqrt((userLat - h.lat)**2 + (userLng - h.lng)**2);
    if (dist < minDist) {
      minDist = dist;
      nearest = h;
    }
  });

  return nearest.name;
}

// Create table with more useful fields
db.run(`CREATE TABLE IF NOT EXISTS emergencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lng REAL,
    time TEXT,
    status TEXT,
    contact TEXT,
    hospital TEXT,
    type TEXT
)`);

// SOS API
app.post("/sos", (req, res) => {
    const { lat, lng, contact, type } = req.body;
    const time = new Date().toLocaleString();
    const hospital = getNearestHospital(lat, lng);

    db.run(
        "INSERT INTO emergencies (lat, lng, time, status, contact, hospital, type) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [lat, lng, time, "AMBULANCE_DISPATCHED", contact, hospital, type || "Unknown"]
    );

    res.json({ hospital });
});

// Get latest emergency
app.get("/latest-emergency", (req, res) => {
    db.get("SELECT * FROM emergencies ORDER BY id DESC LIMIT 1", (err, row) => {
        res.json(row || {});
    });
});

// Mark emergency as resolved
app.post("/resolve", (req, res) => {
    db.run("UPDATE emergencies SET status = 'RESOLVED' WHERE id = (SELECT id FROM emergencies ORDER BY id DESC LIMIT 1)");
    res.json({ message: "Emergency marked as resolved" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
