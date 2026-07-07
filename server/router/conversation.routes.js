const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
    createConversation, clearConversation
} = require("../controller/conversation.controller");


router.post("/",protect,createConversation
);
router.delete("/:conversationId", protect, clearConversation);

module.exports = router;