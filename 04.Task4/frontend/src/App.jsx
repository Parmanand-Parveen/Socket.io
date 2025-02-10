import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const App = () => {
    const [userName, setUsername] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [privateMessage, setPrivateMessage] = useState('');
    const [privateMessages, setPrivateMessages] = useState([]);

    const joinRoom = () => {
        if (userName && room) {
            socket.emit('joinRoom', { userName, room });
        }
    };

    const sendMessage = () => {
        if (message) {
            socket.emit('sendMessage', {sender: userName ,  message, room });
            setMessage('');
        }
    };

    const sendPrivateMessage = () => {
        if (privateMessage && recipientId) {
            socket.emit('privateMessage', { recipientId, message: privateMessage, sender: userName });
            // setPrivateMessages((prev) => [...prev, { sender: 'Me', message: privateMessage }]);
            setPrivateMessage('');
        }
    };

  
   
    useEffect(() => {
        socket.on('message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        socket.on('privatemsg', (data) => {
            setPrivateMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off('message');
            socket.off('privateMessage');
        };
    }, []);

    return (
        <div>
            <h2>Join Chat</h2>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
            <button onClick={joinRoom}>Join</button>

            <h2>Group Chat</h2>
            <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button onClick={sendMessage}>Send</button>

            <ul>
                {messages.map((msg, index) => (
                    <li key={index}><strong>{console.log(msg)}  {msg.userName}:</strong> {msg.text}</li>
                ))}
            </ul>

            <h2>Private Chat</h2>
            <input type="text" placeholder="Recipient ID" onChange={(e) => setRecipientId(e.target.value)} />
            <input type="text" placeholder="Private Message" value={privateMessage} onChange={(e) => setPrivateMessage(e.target.value)} />
            <button onClick={sendPrivateMessage}>Send</button>

            <ul>
                {privateMessages.map((msg, index) => (
                    <li key={index}><strong>{console.log(msg, "Private message")}{msg.sender}:</strong> {msg.message}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
