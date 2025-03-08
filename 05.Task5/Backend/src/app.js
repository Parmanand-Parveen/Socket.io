import express from 'express'
import { Server } from "socket.io"
import http, { createServer } from "http"
import messageModel from './models/message.model.js'
import roomModel from './models/room.model.js'


const app = express()

export const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})


const user = {}
console.log("User list :=>" , user)

io.on("connection", (socket) => {
     
    //Connecting the user and take the socket ID

    console.log("User Connected", socket.id)

    //Sending the message to the room

    socket.on("sendMessage", async ({ recipient, sender, text }) => {
        console.log(recipient, sender , text)
        const newMessage = await messageModel.create({ recipient, sender, text })
        socket.to(recipient).emit("message", {sender, text })
    })

    //Join the room

    socket.on("joinRoom",async ({ roomId, userName }) => {
        socket.join(roomId)
        user[socket.id] = {roomId , userName }
        const isRoomAllReadyCreated = await roomModel.findOne({roomId})
         
        if(isRoomAllReadyCreated){
            const updateUserList = await roomModel.findOneAndUpdate({roomId} , {users:[...isRoomAllReadyCreated.users,userName]})
            socket.to(roomId).emit("message", { sender: "System", text: `${userName} joined the room` })
        }else{
            const newRoom = await roomModel.create({roomId , users:[userName]})
            socket.to(roomId).emit("message", { sender: "System", text: `${userName} joined the room` })
        }
         


    })

    //Handling the private message 
    
    socket.on("privateMsg",async ({recipient,sender,text})=>{
        console.log(recipient,sender,text)
        const msg =await messageModel.create({recipient,sender,text})
        socket.to(recipient).emit("privateMessage",{sender,text})
    })
     
    socket.on("disconnect",()=>{
        delete user[socket.id]
        console.log("User Disconnected", socket.id)
    })
})