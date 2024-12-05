const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const controller = require("../../controllers/client/chapter.controller");

router.post("/create-chapter-novel", controller.createChapterNovel);

router.post(
  "/create-chapter-comic",
  upload.array("images", 30),
  controller.createChapterComic
);

module.exports = router;