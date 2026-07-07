const FriendRequest = require("../models/friendRequestModel");

const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const FreandRequest = require("../models/friendRequestModel");


const sendFriendRequest = asyncHandler( async (req, res)=>{
    const { reciverId } = req.body;

    if(!reciverId){
        throw new ApiError(
            400,
            "Reciver Id is required",
        )
    }

    if(reciverId === req.user._id.toString()){
        throw new ApiError(
            400,
            "You can't send request to yourself"
        )
    }

    // check if required already exist
    const alreadyExist = await FreandRequest.findOne({
        $or:[
            {
                sender: req.user._id,
                receiver: receiverId,
            },
            {
                sender: receiverId,
                receiver: req.user._id,
            },
        ]
    });

    if(alreadyExist){
        throw new ApiError(
            400,
            "Friend request already exists"
        )
    }

    const request = await FriendRequest.create({
        sender: req.user._id,
        receiver: receiverId,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "Freand request sent successfully",
            request,
        )
    )
})

const getFriendRequestStatus = asyncHandler( async(req, res)=>{
    const { userId } = req.params;

    if(!userId){
        throw new ApiError(
            400,
            "User Id is required"
        )
    }
     const request = await FriendRequest.findOne({
        $or: [
            {
                sender: req.user._id,
                receiver: userId,
            },
            {
                sender: userId,
                receiver: req.user._id,
            },
        ],
    });
})

module.exports = {
    sendFriendRequest
}