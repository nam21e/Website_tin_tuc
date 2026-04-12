const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/stats", authMiddleware, allowRoles("admin"), dashboardController.getStats);

module.exports = router;