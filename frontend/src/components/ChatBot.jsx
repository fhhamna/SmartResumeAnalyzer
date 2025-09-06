import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    // add user message to chat
   setMessages((prev) => [...prev, { type: "user", text: input }]);


    try {
      const res = await axios.post("http://localhost:5000/chatbot", { message: input });
      const botReply = res.data.reply;

      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { type: "bot", text: "Error: Could not reach server." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
   <div className="chat-container">
  <h2 className="chat-title">HireWise - Bot</h2>
  <div className="chat-box">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`chat-message ${msg.type === "user" ? "user-msg" : "bot-msg"}`}
      >
        <span className="chat-bubble">{msg.text}</span>
      </div>
    ))}
  </div>
  <div className="chat-input-container">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      placeholder="Ask HireWise..."
      className="chat-input"
    />
    <button onClick={sendMessage} className="chat-send-btn">Send</button>
  </div>
</div>

  );
};

export default ChatBot;
