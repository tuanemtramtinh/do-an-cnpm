const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    author: { type: String, required: true, trim: true },
    thumbnail: String,
    description: String,
    type: { type: String, required: true, trim: true },
    language: {
      type: String,
      default: "vn",
    },
    age_limit: {
      type: Number,
      required: true,
    },
    like: [
      {
        type: String,
        ref: "user",
        default: [],
      },
    ],
    view: {
      type: Number,
      default: 0,
    },
    translator: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    tag: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "tag",
        required: true,
      },
    ],
    comment: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "comment",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
