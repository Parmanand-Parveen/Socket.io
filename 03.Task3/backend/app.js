import express from "express"
import http, { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"




const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})



io.on("connection", (socket) => {
  socket.on("joinRoom" , ({userName , room})=>{
    socket.join(room)
    console.log(`${userName} joined the ${room} room`)
    socket.to(room).emit("message" , {user: "System" ,text:`${userName} joined the room`})
  })
  
  socket.on("sendMessage", ({userName,room,message})=>{
    io.to(room).emit("message",{user : userName, text : message})
  })
  
  socket.on("disconnect",()=>{
    console.log("User get disconnected")
  })
})

server.listen(3000, () => {
    console.log("App is running on port number 3000")
})
