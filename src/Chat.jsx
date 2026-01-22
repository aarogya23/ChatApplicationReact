import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  const username = "User" + Math.floor(Math.random() * 1000);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    stompClient.current = new Client({
      brokerURL: "ws://localhost:8083/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");
        setIsConnected(true);

        stompClient.current.subscribe("/topic/public", (payload) => {
          const msg = JSON.parse(payload.body);
          setMessages((prev) => [...prev, msg]);
        });
      },

      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !isConnected) return;

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
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <h2 style={styles.title}>Chat Room</h2>
          <div style={styles.statusContainer}>
            <div style={{
              ...styles.statusDot,
              backgroundColor: isConnected ? '#10b981' : '#ef4444'
            }}></div>
            <span style={styles.statusText}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div style={styles.username}>Logged in as: {username}</div>
        </div>

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: m.sender === username ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    backgroundColor: m.sender === username ? '#3b82f6' : '#e5e7eb',
                    color: m.sender === username ? '#ffffff' : '#1f2937',
                    alignSelf: m.sender === username ? 'flex-end' : 'flex-start'
                  }}
                >
                  {m.sender !== username && (
                    <div style={styles.senderName}>{m.sender}</div>
                  )}
                  <div style={styles.messageContent}>{m.content}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={styles.input}
            disabled={!isConnected}
          />
          <button 
            onClick={sendMessage} 
            style={{
              ...styles.button,
              opacity: !isConnected || !message.trim() ? 0.5 : 1,
              cursor: !isConnected || !message.trim() ? 'not-allowed' : 'pointer'
            }}
            disabled={!isConnected || !message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  chatBox: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '600px',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: '600',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  statusText: {
    fontSize: '14px',
    opacity: 0.9,
  },
  username: {
    fontSize: '13px',
    opacity: 0.8,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#9ca3af',
    fontSize: '14px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    borderRadius: '12px',
    wordWrap: 'break-word',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  senderName: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '4px',
    opacity: 0.8,
  },
  messageContent: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  inputContainer: {
    display: 'flex',
    padding: '16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
};

export default Chat;