import mongoose from "mongoose";


export const connect = async ()=>{
const result =await mongoose.connect("mongodb://127.0.0.1:27017/chatApp")
 console.log("Database connected")
}