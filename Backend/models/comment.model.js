const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    require: true,
  },
  commentor: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    require: true,
  },
  book_id: {
    type: mongoose.Schema.ObjectId,
    ref: "book",
    require: true,
  },
});
