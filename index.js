const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

// Log each visit
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} | ${req.ip} | ${req.headers["user-agent"]}\n`;
  fs.appendFileSync("clicks.log", log);
  next();
});

// Redirect route
app.get("/", (req, res) => {
  res.redirect("https://www.linkedin.com/in/saleh--ibrahim/");
});

app.listen(port, () => {
  console.log(`Live at http://localhost:${port}`);
});
