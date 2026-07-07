const Conversation = require("../models/conversation");
const Message = require("../models/messageModel");
const mongoose = require("mongoose");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const { findOne } = require("../models/userModel");

const createConversation = asyncHandler(async (req, res) => {
    const { receiverId } = req.body;

    if (!receiverId) {
        throw new ApiError(
            400,
            "Receiver Id is required"
        );
    }

    if(!mongoose.Types.ObjectId.isValid(receiverId)){
        throw new ApiError(
            400,
            "Invaliud receiver ID",
        )
    };

    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
        throw new ApiError(
            400,
            "You cannot create conversation with yourself"
        );
    }

    let conversation = await Conversation.findOne({
        $or: [
            {
                sender: senderId,
                receiver: receiverId,
            },
            {
                sender: receiverId,
                receiver: senderId,
            },
        ],
    });

    if (conversation) {
        return res.status(200).json(
            new ApiResponse(
                200,
                "Conversation already exists",
                conversation
            )
        );
    }

    conversation = await Conversation.create({
        sender: senderId,
        receiver: receiverId,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Conversation created successfully",
            conversation
        )
    );
});

const clearConversation = asyncHandler( async(req, res)=>{
    const { conversationId } = req. params;

    if(!mongoose.Types.ObjectId.isValid(conversationId)){
        throw new ApiError(
            400,
            "Invalid conversationId"
        )
    }
    const conversation = await Conversation.findById(conversationId);

    if(!conversation){
        throw new ApiError(
            404,
            "Conversation not found",
        );
    }

    if(conversation.sender.toString() !== req.user._id.toString() && conversation.receiver.toString() !== req.user._id.toString()){
        throw new ApiError(
            403,
            "You are not authorized",
        );
    };

    await Message.deleteMany({
        conversationId,
    });

    // await Conversation.findByIdAndDelete(conversationId);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Chat deleted Successfully"
        )
    )

})

module.exports = {
    createConversation,
    clearConversation
}