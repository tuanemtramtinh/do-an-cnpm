const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  user_id: {
    type: String,
    ref: "user",
  },
  book_id: {
    type: String,
    ref: "book",
  },
});
