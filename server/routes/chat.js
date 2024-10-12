const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const Chat = require("../models/chat");
const app = express();
const router = express.Router();

router.post("/singlechat", async (req, res) => {
    const { userId } = req.body;
    const {senderId}=req.body;
    if (!userId) {
        return res.status(200).json({ success: false, message: "Please provide the userId" })
    }

    var isChat = await Chat.findOne({
        IsDomainSpecific: false,
        isBatchChat: false,
        $and: [
            { participants: { $in: [senderId] } },
            { participants: { $in: [userId] } },
        ],
    }).populate("participants", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat) {
        res.send(isChat);
    }
    else {
        var chatData = {
            name: "sender",
            IsDomainSpecific: false,
            isBatchChat: false,
            participants: [senderId,userId],
            latestMessage: null
        };

        try {
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id: createdChat._id}).populate("participants","-password")
            .populate("latestMessage");
            res.status(200).json(FullChat)
        } catch (error) {
            return res.status(500).send("Some internal may be occured");
        }
    }
})

module.exports=router