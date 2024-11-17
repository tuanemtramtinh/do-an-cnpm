const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  dob: Date,
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
