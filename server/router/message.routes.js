const express = require("express");
const router = express.Router();
const protect = require("../middleware/protect");
const upload = require("../middleware/multer");

const { sendMessage, getMessage, markMessageSeen } = require("../controller/message.controller");
router.post("/", protect, upload.single("media"), sendMessage);
router.get("/:conversationId", protect,getMessage);
router.patch("/seen/:conversationId", protect, markMessageSeen )

module.exports = router;