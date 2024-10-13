const mongoose=require("mongoose");
const cors=require("cors")
const express=require("express")
const ConnectToMOngoDB=require("./connectDB");
const app=express()
const userRoutes=require("./routes/user");
const chatRoutes=require("./routes/chat")
const messageRoutes=require('./routes/message')
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT=5000
ConnectToMOngoDB();
app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/message",messageRoutes);

const server=app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
})

const io=require("socket.io")(server,{
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000"
    }
})
io.on("connection",(socket)=>{
    console.log("Connected to socket.io")
    socket.on('setup',(userData)=>{
        socket.join(userData._id)
        socket.emit("Connected")
    })
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User Joined room: "+room);
    })

    socket.on("new message",(newMessageReceived)=>{
        var chat=newMessageReceived.chat;
        if(!chat.participants){
            return console.log("Chat participants are not defined");
        }
        chat.participants.forEach(user => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived)
        })

    })

    socket.off("setup",()=>{
        console.log("user is Disconnected");
        socket.leave(userData._id);
    })
})