const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/book.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get("/", controller.getBook);
router.post(
  "/create",
  requireAuth,
  upload.single("thumbnail"),
  controller.createBook
);

router.get("/get-all-chapter", controller.getAllChapter);
router.patch("/update", controller.updateBook);

router.get("/posted-manga-list", requireAuth, controller.getUserUploadBook);
module.exports = router;
