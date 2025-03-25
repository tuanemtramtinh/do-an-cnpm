const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  chapter_no: { type: Number, required: true },
  uploader: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  images: [
    {
      url: { type: String, required: true },
    },
  ],
  content: {
    type: String,
  },
});

const Chapter = mongoose.model("chapter", chapterSchema);

module.exports = Chapter;
