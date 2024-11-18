const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");

router.post("/register", controller.register);

router.get("/", (req, res) => {
  res.json("OK");
});

module.exports = router;
