const Book = require("../../models/book.model");
const Tag = require("../../models/tag.model");
const User = require("../../models/user.model");
const Chapter = require("../../models/chapter.model");
const cloudinary = require("../../configs/cloudinary");
const fs = require("fs");
const path = require("path");
const { returnMessage } = require("../../helpers/message.helper");

module.exports.getBook = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (keyword === "highlight") {
      const limit = 5;

      const books = await Book.find({})
        .sort({ like: -1 })
        .populate({
          path: "tag",
          select: "_id name",
        })
        .limit(5)
        .lean();

      const booksFinal = [];

      for (const book of books) {
        const chapters = await Chapter.find({
          book: book._id,
        })
          .select("_id chapter_no name")
          .limit(limit);

        booksFinal.push({
          id: book._id,
          name: book.name,
          tag: [...book.tag],
          author: book.author,
          thumbnail: book.thumbnail,
          description: book.description,
          num_like: book.like.length,
          num_cmt: book.comment.length,
          chapters: chapters,
        });
      }

      res.json(returnMessage("Lấy truyện nổi bật thành công", booksFinal, 200));
    } else {
      const books = await Book.find({})
        .select("_id name author thumbnail tag")
        .populate({
          path: "tag",
          select: "_id name",
        })
        .lean();

      res.json(returnMessage("Lấy danh sách truyện thành công", books, 200));
    }
  } catch (error) {
    console.log(error);
    res.json(returnMessage("Lấy danh sách truyện thất bại", null, 500));
  }
};

module.exports.createBook = async (req, res) => {
  const {
    translatorID,
    tagIDs,
    name,
    author,
    description,
    type,
    language,
    age_limit,
  } = req.body;
  const thumbnail = req.file;
  try {
    const translator = await User.findOne({ _id: translatorID });
    if (!translator)
      return res.status(400).json({
        status: "fail",
        message: "invalid user ID or no ID",
      });
    const validTags = await Tag.find({ _id: { $in: tagIDs } });
    let arrayTagIDs = [];
    arrayTagIDs.push(tagIDs);
    arrayTagIDs = arrayTagIDs.flat();
    if (validTags.length !== arrayTagIDs.length) {
      return res.status(400).json({
        status: "fail",
        message: "invalid tag ID or no ID",
      });
    }

    const bookFolder = `${name}`;
    const thumbnailFolder = `${bookFolder}/thumbnail`;
    let uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload(req.file.path, {
          asset_folder: thumbnailFolder,
          resource_type: "image",
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
    const newBook = new Book({
      name,
      author,
      thumbnail: uploadResult?.secure_url,
      description,
      type,
      language,
      age_limit,
      translator,
      tag: validTags.map((tag) => tag.id),
    });
    await newBook.save();
    res.status(201).json({
      status: "success",
      data: {
        newBook,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getAllChapter = async (req, res) => {
  const book_ID = req.query.id;
  try {
    const book = await Book.findOne({ _id: book_ID });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "book not found",
      });
    }
    const chapters_find = await Chapter.find({ book: book_ID });
    let chapters = [];
    chapters_find.map((chapter) => {
      const name = chapter.name;
      const id = chapter._id;
      const chapter_no = chapter.chapter_no;
      const data = { _id: id, title: name, chapter_no: chapter_no };
      chapters.push(data);
    });
    res.status(200).json({
      status: "success",
      chapters: chapters,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
