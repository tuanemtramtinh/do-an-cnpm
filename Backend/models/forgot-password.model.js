const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: {
      type: Date,
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model(
  "forgot-password",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
