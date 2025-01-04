const Book = require("../../models/book.model");
const Tag = require("../../models/tag.model");
const User = require("../../models/user.model");
const Chapter = require("../../models/chapter.model");
const cloudinary = require("../../configs/cloudinary");
const { returnMessage } = require("../../helpers/message.helper");
const moment = require("moment");
const Comment = require("../../models/comment.model");

module.exports.getBook = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const bookId = req.query.bookId;
    if (bookId) {
      const book = await Book.findById(bookId).populate("tag").populate({
        path: "translator",
        select: "username avatar",
      });

      if (!book) {
        res.json(returnMessage("Truyện không tồn tại", null, 500));
        return;
      }

      const finalBook = {
        name: book.name,
        author: book.author,
        thumbnail: book.thumbnail,
        description: book.description,
        type: book.type,
        language: book.language,
        age_limit: book.age_limit,
        translator: book.translator,
        tag: book.tag,
      };

      res.json(returnMessage("Lấy truyện thành công", finalBook, 200));
      return;
    } else if (keyword === "highlight") {
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
        .select("_id name author thumbnail tag description updatedAt")
        .populate({
          path: "tag",
          select: "_id name",
        })
        .lean();

      for (const book of books) {
        book.updatedAt = moment(book.updatedAt).format("DD-MM-YYYY");
      }

      res.json(returnMessage("Lấy danh sách truyện thành công", books, 200));
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json(returnMessage("Lấy danh sách truyện thất bại", null, 500));
  }
};

// module.exports.getBookDetail = async (req, res) => {
//   try {
//     const bookId = req.params.id;

//     const book = await Book.findById(bookId);

//     if (!book) {
//       res.json(returnMessage("Không tìm thấy truyện", null, 404));
//       return;
//     }

//     res.json(returnMessage("Lấy chi tiết truyện thành công", book, 200));
//   } catch (error) {
//     console.log(error);
//     res.json(returnMessage("Lấy chi tiết truyện thất bại", null, 500));
//   }
// };

module.exports.createBook = async (req, res) => {
  const translatorID = req.user.id;
  const { name, author, description, type, language, age_limit, status } =
    req.body;
  const thumbnail = req.file;
  const tagIDs = JSON.parse(req.body.tagIDs);
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
      status,
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

module.exports.updateBook = async (req, res) => {
  const book_ID = req.query.book_id;
  const user_ID = req.query.user_id;
  const change = req.body;
  try {
    const book = await Book.findOne({ _id: book_ID });
    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: "invalid book id",
      });
    }
    const user = await User.findOne({ _id: user_ID });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "missing or invalid user id",
      });
    }
    if (!user.isAdmin && !book.translator.equals(user._id)) {
      return res.status(404).json({
        status: "fail",
        message: "not have permission to change the book",
      });
    }
    const updateBook = await Book.findOneAndUpdate(
      { _id: book_ID },
      { $set: change },
      { new: true, runValidators: true }
    );
    res
      .status(200)
      .json(returnMessage("Cập nhật truyện thành công", updatedBook, 200));
  } catch (error) {
    res
      .status(400)
      .json(returnMessage("Cập nhật truyện không thành công", null, 400));
  }
};

module.exports.getUserUploadBook = async (req, res) => {
  const user_ID = req.user.id;
  try {
    const user = await User.findOne({ _id: user_ID });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "invalid user id",
      });
    }
    const books = await Book.find({ translator: user._id }).sort({
      updatedAt: -1,
    });
    const data = await Promise.all(
      books.map(async (book) => {
        const chapters = await Chapter.find({ book: book._id });
        const chapterData = chapters.slice(0, 5).map((chapter) => ({
          chapter_no: chapter.chapter_no,
          name: chapter.name,
        }));
        const tagIds = book.tag;
        const tags = await Tag.find({ _id: { $in: tagIds } });
        const tagData = tags.map((tag) => ({
          id: tag._id,
          name: tag.name,
        }));
        return {
          img: book.thumbnail,
          name: book.name,
          author: book.author,
          type: book.type,
          tag: tagData,
          status: book.status,
          day_update: book.updatedAt,
          language: book.language,
          chapter: chapterData,
        };
      })
    );

    res.status(200).json(returnMessage("Trả về truyện thành công", data, 200));
  } catch (error) {
    res.status(400).json(returnMessage("Trả về không thành công", null, 400));
  }
};
module.exports.getAllComments = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const comments = await Comment.find({ bookid: bookId }).populate({
      path: "commentor",
      select: "username avatar",
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No comments found for this book",
      });
    }

    const returnComments = [];

    for (const item of comments) {
      returnComments.push({
        comment: item.comment,
        userId: item.commentor.id,
        username: item.commentor.username,
        avatar: item.commentor.avatar,
      });
    }

    res
      .status(200)
      .json(
        returnMessage("Lấy danh sách bình luận thành công", returnComments, 200)
      );

    // res.status(200).json({
    //   status: "success",
    //   data: comments,
    // });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(returnMessage("Lấy danh sách bình luận thất bại", null, 500));
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
  }
};
