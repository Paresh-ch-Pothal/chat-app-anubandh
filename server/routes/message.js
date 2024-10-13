const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");
const fetchuser = require("../middleware/fetchuser");
const app = express();
const router = express.Router();


//...send Message ...//
router.post("/sendmessage",fetchuser,async(req,res)=>{
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


//...to fetch all the messages...//
router.get("/fetchmessage/:id",fetchuser,async(req,res)=>{
    try {
        const chatId=req.params.id
        const messages=await Message.find({chatId: chatId}).populate("sender","name pic email").populate("chatId");
        return res.status(200).send({success: true,messages});
    } catch (error) {
        console.log(error)
        return res.status(500).send("Some internal issue may be occured");
    }
})

module.exports=router