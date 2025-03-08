import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const App = () => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomMessage, setRoomMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  console.log("Room messages :=>", roomMessages);
  console.log("Private Message :=>", privateMessages);

  const joinRoom = () => {
    if (roomId && userName) {
      socket.emit("joinRoom", { roomId, userName });
    }
  };

  const sendMessage = () => {
    socket.emit("sendMessage", {
      recipient: roomId,
      sender: userName,
      text: roomMessage,
    });
    setRoomMessage("");
  };

  const prvtMessage = () => {
    socket.emit("privateMsg", {
      recipient: recipientId,
      sender: userName,
      text: privateMessage,
    });
    setPrivateMessages((prev) => [
      ...prev,
      { sender: "Me", text: privateMessage },
    ]);
    setPrivateMessage("");
  };

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setRoomMessages((prev) => [...prev, data]);
    });

    socket.on("privateMessage", (data) => {
      console.log(data);
      setPrivateMessages((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div>
      <h3>Join Room</h3>
      <input
        placeholder="Username"
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        placeholder="Room Id"
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>

      <br />
      <h3>Group msg</h3>
      <input
        placeholder="Group Msg"
        type="text"
        value={roomMessage}
        onChange={(e) => setRoomMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>

      {roomMessages &&
        roomMessages.map((msg, i) => {
          return (
            <p key={i}>
              <strong>
                {console.log(msg)}
                {msg.sender}:<span>{msg.text}</span>{" "}
              </strong>
            </p>
          );
        })}

      <br />
      <h3>Private message</h3>

      <input
        placeholder="Recipient Id"
        type="text"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
      />
      <input
        placeholder="Message"
        type="text"
        value={privateMessage}
        onChange={(e) => setPrivateMessage(e.target.value)}
      />
      <button onClick={prvtMessage}>Send</button>
      {privateMessages &&
        privateMessages.map((msg, i) => {
          return (
            <p key={i}>
              <strong>
                {console.log(msg)}
                {msg.sender}:<span>{msg.text}</span>{" "}
              </strong>
            </p>
          );
        })}
    </div>
  );
};

export default App;
