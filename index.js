const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = process.env.PORT || 3000;

// Connect to SQLite database (file-based)
const db = new sqlite3.Database("clicks.db");

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    ip TEXT,
    userAgent TEXT,
    target TEXT
  )
`);

// Define custom short links here
const redirects = {
  Sal: "https://www.linkedin.com/in/saleh--ibrahim/",
  // Add more here like:
  // GitHub: "https://github.com/salibrahim",
  // CV: "https://example.com/mycv.pdf"
};

// Redirect and log route
app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  const target = redirects[slug];

  if (!target) {
    return res.status(404).send("Not found");
  }

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO clicks (timestamp, ip, userAgent, target) VALUES (?, ?, ?, ?)`,
    [timestamp, ip, userAgent, target],
    (err) => {
      if (err) {
        console.error("Error saving click:", err.message);
      }
    },
  );

  res.redirect(target);
});

// Stats page to view logged clicks
app.get("/stats", (req, res) => {
  db.all(`SELECT * FROM clicks ORDER BY timestamp DESC`, (err, rows) => {
    if (err) {
      return res.status(500).send("Error reading database");
    }

    res.send(
      `<h2>Total Clicks: ${rows.length}</h2>` +
        rows
          .map(
            (r) =>
              `<div>
                <b>Time:</b> ${r.timestamp}<br>
                <b>IP:</b> ${r.ip}<br>
                <b>User Agent:</b> ${r.userAgent}<br>
                <b>Target:</b> ${r.target}
              </div><hr>`,
          )
          .join(""),
    );
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
