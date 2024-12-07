const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

const ForgotPassword = mongoose.model(
  "forgot-password",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
