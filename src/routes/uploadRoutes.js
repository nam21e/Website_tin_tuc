const express = require("express");
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/image", upload.single("image"), uploadController.uploadImage);
router.post("/images", upload.array("images", 10), uploadController.uploadMultipleImages);

module.exports = router;