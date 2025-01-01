const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/user.controller");
// const { requireAuth } = require("../../middlewares/auth.middleware");
// const { isAdmin } = require("../../middlewares/role.middleware");

router.post("/change-role/:id", controller.changeRole);
router.get("/getAlluser", controller.getAllUsers);
router.get("/getComment", controller.getAllComments);

module.exports = router;
