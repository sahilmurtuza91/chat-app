const Message = require("../models/messageModel");
const { getIO } = require("../socket/socket");

const Conversation = require("../models/conversation");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");

const sendMessage = asyncHandler(async (req, res) => {
    const sender = req.user._id;
    const { conversationId, text } = req.body;

    const file = req.file;

    // this is replace because of cloudinary uses
    // let imageUrl = "";
    // let videoUrl = "";
    // if (file) {
    //     if (file.mimetype.startsWith("image")) {
    //         imageUrl = `/uploads/images/${file.filename}`;
    //     } else if (file.mimetype.startsWith("video")) {
    //         videoUrl = `/uploads/videos/${file.filename}`;
    //     }
    // }

    let imageUrl = "";
    let videoUrl = "";

    if (file) {
        if (file.mimetype.startsWith("image")) {
            imageUrl = file.path;
        } else if (file.mimetype.startsWith("video")) {
            videoUrl = file.path;
        }
    }

    if (!conversationId) {
        throw new ApiError(400, "Conversation id is required");
    }

    if (!text?.trim() && !file) {
        throw new ApiError(400, "Message or media is required");
    }

    const message = await Message.create({
        conversationId,
        sender,
        text,
        imageUrl,
        videoUrl,
    });

    await message.populate("sender", "name email profile_pic");

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const receiverId =
        conversation.sender.toString() === sender.toString()
            ? conversation.receiver
            : conversation.sender;

    const io = getIO();


    io.to(receiverId.toString()).emit("receive-message", message);


    return res.status(201).json(
        new ApiResponse(201, "Message sent successfully", message)
    );
});

const getMessage = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        throw new ApiError(400, "Conversation Id is required");
    }

    const message = await Message.find({ conversationId })
        .populate("sender", "name email profile_pic")
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, "Message fetched successfully", message)
    );
});

const markMessageSeen = asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    await Message.updateMany(
        { conversationId, seen: false, sender: { $ne: req.user._id } },
        { seen: true }
    );

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new ApiError(404, "Conversation not found");
    }

    const otherUserId =
        conversation.sender.toString() === req.user._id.toString()
            ? conversation.receiver
            : conversation.sender;

    const io = getIO();

    io.to(otherUserId.toString()).emit("messages-seen", conversationId);

    return res.status(200).json(
        new ApiResponse(200, "Message marked as seen")
    );
});

module.exports = {
    sendMessage,
    getMessage,
    markMessageSeen,
};