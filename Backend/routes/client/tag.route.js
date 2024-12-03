const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/tag.controller");
const isAdmin = require("../../middlewares/isAdmin.middleware");

router.get("/get-all", controller.getAll);

router.post("/create", isAdmin, controller.createTag);

module.exports = router;
