const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: String,
  author: String,
  thumbnail: String,
  description: String,
  type: String,
  language: {
    type: String,
    default: "vn",
  },
  age_limit: Number,
  like: Array,
  view: Number,
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
