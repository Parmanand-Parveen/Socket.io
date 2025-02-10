import React, { useState } from "react";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if(message){
        socket.emit("sendMessage" ,{userName,room,message })
        setMessage("")
    }
  };

  const joinRoom = ()=>{
    socket.emit("joinRoom", {userName,room})
  } 
  
  socket.on("message", (data)=>{
    setMessages((prev)=>[...prev ,data])
  })

  return (
    <div>
      <input
        type="text"
        placeholder="Room Id"
        onChange={(e) => setRoom(e.target.value)}
      />
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUserName(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>


      <input
        type="text"
        placeholder="Message"
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}></button>
      <div>
        {messages.map((message) => (
          <div>
            <li> <strong>{message?.user}</strong>  {message?.text} </li>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
