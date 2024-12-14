const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
// const { requireAuth } = require("../../middlewares/auth.middleware");
// const { isAdmin } = require("../../middlewares/role.middleware");

router.post("/change-role/:id", controller.changeRole);

module.exports = router;
