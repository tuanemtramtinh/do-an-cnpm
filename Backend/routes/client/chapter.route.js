const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/chapter.controller");

router.post("/createChapterNovel", controller.createChapterNovel);

module.exports = router;
