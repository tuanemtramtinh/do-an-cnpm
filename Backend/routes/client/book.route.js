const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/book.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get("/", controller.getBook);

// router.get("/:id", controller.getBookDetail);

router.post(
  "/create",
  requireAuth,
  upload.single("thumbnail"),
  controller.createBook
);

router.get("/get-all-chapter", controller.getAllChapter);

router.patch("/update", requireAuth, controller.updateBook);

router.get("/posted-manga-list", requireAuth, controller.getUserUploadBook);
router.get("/getComment/:bookId", controller.getAllComments);

module.exports = router;
