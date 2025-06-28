const express = require("express");
const app = express();
const port = 3000;

let clicks = [];

app.get("/", (req, res) => {
  const username = req.query.username;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();

  if (username) {
    const record = { timestamp, ip, userAgent, target: username };
    clicks.push(record);
    console.log("Logged click:", record);

    // Slight delay to ensure log completes
    setTimeout(() => {
      res.redirect(username);
    }, 300);
  } else {
    res.send("Please provide a username query.");
  }
});

app.get("/stats", (req, res) => {
  res.send(
    `<h2>Total Clicks: ${clicks.length}</h2>` +
      clicks
        .map(
          (r) =>
            `<div>
        <b>Time:</b> ${r.timestamp}<br>
        <b>IP:</b> ${r.ip}<br>
        <b>User Agent:</b> ${r.userAgent}<br>
        <b>Target:</b> ${r.target}
      </div><hr>`
        )
        .join("")
  );
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
