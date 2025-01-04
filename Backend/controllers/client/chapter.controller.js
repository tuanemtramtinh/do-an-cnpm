const Book = require("../../models/book.model");
const User = require("../../models/user.model");
const Chapter = require("../../models/chapter.model");
const cloudinary = require("../../configs/cloudinary");
const streamifier = require("streamifier");

const uploadFileToCloudinary = (buffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports.createChapterNovel = async (req, res) => {
  const { chapter_no, book_ID, name, content } = req.body;
  const uploader_ID = req.user.id;
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
      uploader,
      book,
      name,
      images: [],
      content,
    });
    await newChapterNovel.save();
    res.status(200).json({
      status: "success",
      message: "Add new chapter for novel successfully",
      data: newChapterNovel,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "major fail",
    });
  }
};

module.exports.createChapterComic = async (req, res) => {
  const { chapter_no, book_ID, name } = req.body;
  const uploader_ID = req.user.id;
  const files = req.files;
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
    const book_name = book.name;
    const folderName = `${book_name}/chapter${chapter_no}`;
    let imageURLs = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const result = await uploadFileToCloudinary(file.buffer, folderName);
          imageURLs.push(result.secure_url);
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return res.status(500).json({
            status: "fail",
            message: "Error uploading images",
            error: uploadError.message,
          });
        }
      }
    } else {
      return res.status(400).json({
        status: "fail",
        message: "No images uploaded",
      });
    }
    const imagesArray = imageURLs.map((url) => ({ url }));

    // Create the new chapter
    const newChapterComic = new Chapter({
      chapter_no,
      uploader,
      book,
      name,
      images: imagesArray,
      content: "",
    });
    await newChapterComic.save();
    res.status(200).json({
      status: "success",
      message: "Add new chapter with images successfully",
      data: newChapterComic,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

module.exports.getNovel = async (req, res) => {
  const book_ID = req.query.id;
  const chapter_number = req.query.chapter_no * 1;
  try {
    const book = await Book.findOne({ _id: book_ID });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "invalid book's ID",
      });
    }
    const chapter = await Chapter.findOne({
      chapter_no: chapter_number,
      book: book_ID,
    });
    res.status(200).json({
      status: "success",
      content: chapter.content,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};

module.exports.getComic = async (req, res) => {
  const book_ID = req.query.id;
  const chapter_number = req.query.chapter_no * 1;
  try {
    const book = await Book.findOne({ _id: book_ID });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "invalid book's ID",
      });
    }
    const chapter = await Chapter.findOne({
      chapter_no: chapter_number,
      book: book_ID,
    });
    let URLs = [];
    chapter.images.map((el) => {
      const url = el.url;
      URLs.push(url);
    });
    res.status(200).json({
      status: "success",
      URLs: URLs,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error,
    });
  }
};
