const Jwt = require("jsonwebtoken");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");

const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        throw new ApiError(
            401,
            "Please login first"
        )
    }

    const decode = Jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
        throw new ApiError(
            404,
            "User not found",
        )
    }
    req.user = user;
    next();
})
module.exports = protect;
