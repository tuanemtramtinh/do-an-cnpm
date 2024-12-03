const Book = require("../../models/book.model");
const Tag = require("../../models/tag.model");
const User = require("../../models/user.model");
const Chapter = require("../../models/chapter.model");
const cloudinary = require("../../configs/cloudinary");
const fs = require("fs");
const path = require("path");

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
      name: name,
      author: author,
      thumbnail: uploadResult?.secure_url,
      description: description,
      type: type,
      language: language,
      age_limit: age_limit,
      translator: translator,
      tag: validTags.map((tag) => tag.id),
    });
    await newBook.save();
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
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
