"use client"
import React, { useState, useEffect } from 'react';

let webSocket: WebSocket;
if (typeof window !== "undefined") {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
  setInterval(() => {
    if (webSocket.readyState !== webSocket.OPEN) {
      webSocket = new WebSocket(`${protocol}//${window.location.host}/api/ws`);
      return;
    }

    webSocket.send(`{"event":"ping"}`);
  }, 29000);
}

const Index = () => {
  
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    webSocket.onmessage = (event) => {
      console.log("MESSAGE")
      if (event.data === "connection established") return;
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
  }, []);

  const sendMessage = () => {
    console.log("newMessage", newMessage)
    webSocket.send(newMessage);
    setNewMessage('');
  };

  console.log("messages", messages)

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      {/* <form onSubmit={sendMessage}> */}
        <input
          type="text"
          className="border border-gray-400 rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      {/* </form> */}
    </div>
  );
};

export default Index;