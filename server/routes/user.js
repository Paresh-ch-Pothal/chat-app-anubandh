const express = require("express");
const User = require("../models/user");
const app = express();
const router = express.Router();

//... Signup ...//
router.post("/signup", async (req, res) => {
    const { name, email, password, batch, domain, pic } = req.body;
    if (!name || !email || !password || !batch || !domain) {
        return res.status(200).json({ success: false, message: "please provide all the required details" })
    }
    const userExist = await User.findOne({email});
    if (userExist) {
        return res.status(200).json({ success: false, message: "Someone alerady exist with the same email" });
    }
    try {
        const user = await User.create({
            name, email, password, batch, domain, pic
        })
        return res.status(200).json({success: true,user})
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...FetchAllUser...//
router.get("/fetchalluser",async(req,res)=>{
    try {
        const users=await User.find();
        return res.status(200).json({success: true,users})
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


//...searchUser...//
router.get("/searchuser",async(req,res)=>{
    const search=req.query.search;
    try {
        if(!search){
            return res.status(200).json({success: true,message: "No Search item is present"});
        }
        const users=await User.find({
            $or: [
                {name : {$regex: search,$options: "i"}}
            ]
        })
        if(users.length == 0){
            return res.status(200).json({success: false,message:"No User is present"});
        }
        return res.status(200).json({success: true,users})
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})



module.exports=router