import mongoose from "mongoose";



const roomSchema = new mongoose.Schema({
    roomId : {
        type: String
    },
    users : {
        type: [String]
    }
})

const roomModel = new mongoose.model("room",roomSchema)

export default roomModel