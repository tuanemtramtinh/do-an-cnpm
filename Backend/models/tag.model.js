const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
});

const Tag = mongoose.model("tag", tagSchema);

module.exports = Tag;
