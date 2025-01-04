const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const controller = require("../../controllers/client/chapter.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.post(
  "/create-chapter-novel",
  requireAuth,
  controller.createChapterNovel
);

router.post(
  "/create-chapter-comic",
  requireAuth,
  upload.array("images", 100),
  controller.createChapterComic
);

router.get("/get-novel", controller.getNovel);

router.get("/get-comic", controller.getComic);

module.exports = router;
