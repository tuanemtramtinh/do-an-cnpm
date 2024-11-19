const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  chapter_no: { type: Number, require: true },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
  },
  content: {
    type: String,
  },
});
