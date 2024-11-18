const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  chapter_no: { type: Number, require: true },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  book_id: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  images: {
    type: Array,
  },
  content: {
    type: String,
  },
});
