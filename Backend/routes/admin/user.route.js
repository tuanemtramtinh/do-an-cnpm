const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const isAdmin = require("../../middlewares/isAdmin.middleware");

router.post("/change-role/:id", isAdmin, controller.changeRole);
router.get("/getAlluser", controller.getAllUsers, authMiddleware.requireAuth);
// router.get("/getComment", controller.getAllComments, authMiddleware.requireAuth);

module.exports = router;
