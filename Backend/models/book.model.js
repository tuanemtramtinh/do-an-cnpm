const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: { type: String, require: true },
  author: { type: String, require: true },
  thumbnail: String,
  description: String,
  type: { type: String, require: true },
  language: {
    type: String,
    default: "vn",
  },
  age_limit: {
    type: Number,
    require: true,
  },
  like: {
    type: Array,
    require: true,
  },
  view: {
    type: Number,
    default: 0,
  },
  translator: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  tag: {
    type: mongoose.Schema.ObjectId,
    ref: "tag",
    require: true,
  },
  comment: {
    type: mongoose.Schema.ObjectId,
    ref: "comment",
  },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
