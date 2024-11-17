const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: String,
  status: String,
});

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
