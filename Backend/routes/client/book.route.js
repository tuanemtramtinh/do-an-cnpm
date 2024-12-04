const express = require("express");
const router = express.Router();
const upload = require("../../configs/multer");

const controller = require("../../controllers/client/book.controller");
const { requireAuth } = require("../../middlewares/auth.middleware");

router.get("/", requireAuth, controller.getBook);
router.post("/create", upload.single("thumbnail"), controller.createBook);

module.exports = router;
