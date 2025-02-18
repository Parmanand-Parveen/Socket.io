import express from "express"
import http, { createServer } from "http"
import {Server} from "socket.io"
import cors from "cors"



const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

let users = {}

io.on("connection",(socket)=>{
    console.log("User Connected", socket.id)
    socket.on("joinRoom", ({userName , room})=>{
        users[socket.id]= {userName , room}
        socket.join(room)
        console.log(`${userName} joined room: ${room}`)
        socket.to(room).emit("message",{userName: "System", text: `${userName} has joined the chat`})
    })
    

     socket.on("sendMessage", ({sender, message, room})=>{
        io.to(room).emit("message",{userName : sender,text: message, room})
     })
     
    //Handleing personal messanging

    socket.on("privateMessage",({recipientId, message , sender})=>{
        console.log(recipientId)
        io.to(recipientId).emit("privatemsg", {message , sender})
    })
   
    socket.on("disconnect",()=>{
        delete users[socket.id]
        console.log("User disconnected", socket.id)
    })

}) 


server.listen(3000, ()=> console.log("Server is running on port 3000"))