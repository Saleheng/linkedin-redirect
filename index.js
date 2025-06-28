app.get("/", (req, res) => {
  const username = req.query.username;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();

  console.log("Redirect request received");
  console.log("Username:", username);
  console.log("IP:", ip);
  console.log("User-Agent:", userAgent);

  if (username) {
    db.run(
      `INSERT INTO clicks (timestamp, ip, userAgent, target) VALUES (?, ?, ?, ?)`,
      [timestamp, ip, userAgent, username],
      (err) => {
        if (err) {
          console.error("Error saving click:", err.message);
        } else {
          console.log("Click saved!");
        }
      },
    );

    return res.redirect(username);
  }

  res.send("Please provide a username query.");
});
