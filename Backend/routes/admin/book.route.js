const express = require("express");
const router = express.Router();

router.post("/create", requireAuth, isAdmin, createBook);


module.exports = router;
