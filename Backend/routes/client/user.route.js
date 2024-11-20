const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/user.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/info", authMiddleware.requireAuth, controller.info);

router.post("/forgot-password", controller.forgetPassword);

router.post("/send-otp", controller.sendOTP);

router.post(
  "/update-password",
  authMiddleware.requireAuth,
  controller.updatePassword
);

module.exports = router;
