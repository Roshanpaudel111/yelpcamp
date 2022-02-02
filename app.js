const express = require("express");
const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello from ejs");
});

app.listen(port, () => {
  console.log(`listening to Port:${port}`);
});
