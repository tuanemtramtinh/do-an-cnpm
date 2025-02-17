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
  bookid: {
    type: mongoose.Schema.ObjectId,
    require: true,
  }
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
