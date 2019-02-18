const express = require('express');
const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("landing")
})
app.listen('3000', () => {
  console.log("Started YelpCamp server");
});