const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  commentor: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    required: true,
  },
});
