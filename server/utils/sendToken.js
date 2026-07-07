const generateToken = require("./generateToken");

const sendToken = (user, statusCode, res, message)=>{
    const token = generateToken(user._id);
    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .json({
            success: true,
            statusCode,
            message,
            // token,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
};
module.exports = sendToken;