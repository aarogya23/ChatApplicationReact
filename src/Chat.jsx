import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const stompClient = useRef(null);

  const username = "User" + Math.floor(Math.random() * 1000);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:8083/ws",

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        stompClient.current.subscribe("/topic/public", (payload) => {
          const msg = JSON.parse(payload.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
    });

    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    stompClient.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        sender: username,
        content: message,
      }),
    });

    setMessage("");
  };

  return (
    <div style={{ width: 400, margin: "40px auto" }}>
      <h2>Chat App</h2>

      <div style={{ height: 300, border: "1px solid #ccc", padding: 10, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.sender}:</b> {m.content}
          </p>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "75%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: 8 }}>
        Send
      </button>
    </div>
  );
};

export default Chat;