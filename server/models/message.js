const mongoose=require("mongoose")
const messageSchema=new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps: true
})

const Message=mongoose.model('Message', messageSchema);
module.exports=Message;