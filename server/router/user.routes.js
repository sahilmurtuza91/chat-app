const express = require("express");

const router = express.Router()

const upload = require("../middleware/multer");
const protect = require("../middleware/protect")
const { registerUser, loginUser, logout, updateUser, getCurrentUser, getAllUsers, searchUser } = require("../controller/user.controller");

router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/logout", protect, logout);
router.put("/update-profile", protect, upload.single("profile_pic"), updateUser)
router.get("/me", protect, getCurrentUser);
router.get("/all-users",protect, getAllUsers);
router.get("/search", protect, searchUser);

module.exports = router;