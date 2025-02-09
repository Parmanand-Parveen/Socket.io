import express from "express"
import {Server} from "socket.io"
import http, {createServer} from "http"




const app = express()
const server =createServer(app)
const io = new Server(server)
app.set("view engine","ejs")

app.get("/",(req,res)=>{
    res.render("index")
})

io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)

    socket.on("message",(data)=>{
        io.emit("message",data)
    })

    socket.on("disconnect",()=>{
        console.log("user disconnected:" , socket.id)
    })
})



server.listen(3000,()=>{
    console.log("Port is running on 3000")
})