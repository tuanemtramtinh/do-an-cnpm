const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const controller = require("../../controllers/client/chapter.controller");

router.post("/create-chapter-novel", controller.createChapterNovel);

router.post(
  "/create-chapter-comic",
  upload.array("images", 100),
  controller.createChapterComic
);

router.get("/get-novel", controller.getNovel);

router.get("/get-comic", controller.getComic);

module.exports = router;
