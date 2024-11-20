const express = require("express");
const { connectDB } = require("./configs/database");
const bodyParser = require("body-parser");
const { routesClient } = require("./routes/client/index.route");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routesClient(app);

app.listen(3000, () => {
  console.log("Server is listening on PORT 3000");
});
