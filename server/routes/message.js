const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");
const app = express();
const router = express.Router();


//...send Message ...//
router.post("/sendmessage",async(req,res)=>{
    const {content,chatId}=req.body;
    if(!content || !chatId){
        return res.status(200).json({success: false,message: "Please provide all the parameters"})
    }
    var newMessage={
        sender: req.user._id,
        content: content,
        chatId: chatId,
    };
    try {
        var message=await Message.create(newMessage);
        message=await message.populate("sender","name pic");
        message=await message.populate("chatId");
        message=await User.populate(message,{
            path: "chatId.users",
            select: "name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message
        })
        res.status(200).json({success: true,message})
    } catch (error) {
        return res.status(500).send("Some internal Error might be occured")
    }
})