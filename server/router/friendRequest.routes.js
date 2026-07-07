const express = require("express");

const router = express.Router();

const protect = require("../middleware/protect");

const {
    sendFriendRequest    
} = require("../controller/friendRequest.controller");


router.post("/send",protect,sendFriendRequest);

module.exports = router;