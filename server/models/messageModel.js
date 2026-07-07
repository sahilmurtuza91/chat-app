const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text:{
        type:String,
        default:"",
        trim:true,
    },
    imageUrl:{
        type:String,
        default:"",
    },
    videoUrl:{
        type:String,
        default:"",
    },
    seen:{
        type:Boolean,
        default:false
    },
},{timestamps:true});

messageSchema.index({
    conversationId:1,
})

const Message = mongoose.model("Message", messageSchema);
module.exports = Message