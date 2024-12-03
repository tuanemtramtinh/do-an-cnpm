const Book = require("../../models/book.model");
const Tag = require("../../models/tag.model");
const User = require("../../models/user.model");
const Chapter = require("../../models/chapter.model");
const cloudinary = require("../../configs/cloudinary");
const fs = require("fs");
const path = require("path");

module.exports.createChapterNovel = async (req, res) => {
  const { chapter_no, uploader_ID, book_ID, name, content } = req.body;
  if (!chapter_no || !uploader_ID || !book_ID || !name || !content) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields",
    });
  }
  try {
    const uploader = await User.findOne({ _id: uploader_ID });
    if (!uploader) {
      return res.status(404).json({
        status: "fail",
        message: "Uploader not found",
      });
    }
    const book = await Book.findOne({ _id: book_ID });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "Book not found",
      });
    }
    const existingChapter = await Chapter.findOne({
      chapter_no,
      book: book_ID,
    });

    if (existingChapter) {
      return res.status(400).json({
        status: "fail",
        message: `Chapter number ${chapter_no} already exists for this book`,
      });
    }
    const newChapterNovel = new Chapter({
      chapter_no,
      uploader: uploader,
      book: book,
      name,
      images: [],
      content,
    });
    await newChapterNovel.save();
    res.status(200).json({
      status: "success",
      message: "Add new chapter for novel successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "major fail",
    });
  }
};

module.exports.createChapterComic = async (req, res) => {};
