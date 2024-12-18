const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
