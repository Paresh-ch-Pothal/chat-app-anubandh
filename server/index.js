const mongoose=require("mongoose");
const cors=require("cors")
const express=require("express")
const ConnectToMOngoDB=require("./connectDB");
const app=express()
const userRoutes=require("./routes/user");
const chatRoutes=require("./routes/chat")
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT=5000
ConnectToMOngoDB();
app.use("/user",userRoutes);
app.use("/chat",chatRoutes);

app.listen(PORT,()=>{
    console.log("Server is running on port 5000");
})