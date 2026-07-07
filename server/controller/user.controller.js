const User = require("../models/userModel");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const sendToken = require("../utils/sendToken");
const { default: mongoose } = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new ApiError(
            409,
            "User already exist",
        )
    };

    const user = await User.create({
        name,
        email,
        password,
    })

    sendToken(user, 201, res, "User registered successfully.");

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(
            401,
            "Invalid Email or password",
        )
    };

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(
            401,
            "Invalid Email or password"
        )
    }
    sendToken(user, 200, res, "Login successful");
})

const logout = asyncHandler(async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "Production",
        sameSite: "strict",
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

const updateUser = asyncHandler(async (req, res) => {
    // const { id } = req.params;
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     throw new ApiError(
    //         400,
    //         "Invalid User ID"
    //     )
    // }
    // if (req.user._id.toString() !== id) {
    //     throw new ApiError(
    //         403,
    //         "You are not authorized"
    //     );
    // }

    const { name, email, } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        );
    }
    const file = req.file;
    if (!name && !email && !file) {
        throw new ApiError(
            400,
            "Please provide data to update"
        );
    }
    // let imageUrl = "";
    // if (file) {
    //     if (file.mimetype.startsWith("image")) {
    //         imageUrl = `/uploads/images/${file.filename}`;
    //     }

    // }

    let imageUrl = "";

    if (file && file.mimetype.startsWith("image")) {
        imageUrl = file.path;
    }

    // const user = await User.findById(id);
    // if (!user) {
    //     throw new ApiError(
    //         404,
    //         "User not found",
    //     )
    // };
    if (email && email !== user.email) {
        const existingEmail = await User.findOne({
            email,
            _id: { $ne: user._id }
        });

        if (existingEmail) {
            throw new ApiError(
                409,
                "Email already used",
            );
        };
    }

    if (file) {
        user.profile_pic = imageUrl;
    }
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    await user.save();
    res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User updated successfully"
        )
    );
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(
            200,
            "Current user Fetched successfully",
            req.user
        )
    )
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({
        _id: {
            $ne: req.user._id
        }
    })
        .select("-password")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(
            200,
            "Users fetched successfully",
            users
        )
    )
});

const searchUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(
            400,
            "Email is required"
        )
    }
    const user = await User.findOne({
        email: email.toLowerCase(),
    }).select("-password");

    if (!user) {
        throw new ApiError(
            404,
            "User not found"
        )
    }
    if (user._id.toString() === req.user._id.toString()) {
        throw new ApiError(
            400,
            "You cannot search yourself",
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "User found",
            user
        )
    );
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    updateUser,
    getCurrentUser,
    getAllUsers,
    searchUser
}