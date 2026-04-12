const express = require("express");
const uploadController = require("../controllers/uploadController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/", upload.single("image"), uploadController.uploadImage);

module.exports = router;