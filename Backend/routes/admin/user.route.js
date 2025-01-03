const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");

router.post("/change-role/:id", authMiddleware.requireAuth, checkRole.checkRole, controller.changeRole);
router.get("/getAlluser", authMiddleware.requireAuth, controller.getAllUsers);

module.exports = router;
