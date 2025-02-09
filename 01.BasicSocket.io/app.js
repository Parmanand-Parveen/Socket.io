import express from "express";
import http, { createServer } from "http"
import { join } from "path";
import {Server} from "socket.io"

const app = express();
app.set("view engine", "ejs");
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
   res.render('index');
});

io.on('connection', (socket) => {
  console.log('a user connected');
   socket.on("disconnect",()=>{
     console.log("user disconnected");
   })
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
