import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
    sender:{
        type: String
    },
    recipient :{
        type: String   //It can be a user Id or a room Id
    },
    text:{
       type: String
    }
},{
    timestamps:true
})



const messageModel = new mongoose.model("message", messageSchema)

export default messageModel