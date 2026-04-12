const express = require("express");
const sourceController = require("../controllers/sourceController");

const router = express.Router();

router.get("/", sourceController.getAllSources);
router.get("/:id", sourceController.getSourceById);
router.post("/", sourceController.createSource);
router.put("/:id", sourceController.updateSource);
router.delete("/:id", sourceController.deleteSource);

module.exports = router;