const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  chapter_no: Number,
  user_id: {
    type: String,
    ref: "user",
  },
  book_id: {
    type: String,
    ref: "book",
  },
  name: String,
});
