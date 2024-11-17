const express = require("express");
const { connectDB } = require("./configs/database");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  console.log("Hello bro");
});

app.listen(3000, () => {
  console.log("Server is listening on PORT 3000");
});
