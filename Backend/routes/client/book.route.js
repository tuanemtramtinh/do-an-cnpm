const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/book.controller");

router.post("/create", upload.single("thumbnail"), controller.createBook);

router.get("/get-all-chapter", controller.getAllChapter);

module.exports = router;
