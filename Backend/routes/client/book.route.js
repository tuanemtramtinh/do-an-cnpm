const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/book.controller");

router.get("/", controller.getBook);
router.post("/create", upload.single("thumbnail"), controller.createBook);

router.get("/get-all-chapter", controller.getAllChapter);
router.patch("/update", controller.updateBook);

router.get("/posted-manga-list", controller.getUserUploadBook);
module.exports = router;
